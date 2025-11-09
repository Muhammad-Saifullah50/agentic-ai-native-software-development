// book-source/src/services/websocketService.ts

const WS_BASE_URL = process.env.REACT_APP_BACKEND_WS_URL || 'ws://localhost:8000';

interface WebSocketMessage {
  type: string;
  payload: any;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private simulationId: string | null = null;
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];
  private errorHandler: ((error: Error) => void) | null = null;

  public connect(simulationId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN && this.simulationId === simulationId) {
        console.log('Already connected to WebSocket for simulation ID:', simulationId);
        resolve();
        return;
      }

      this.disconnect(); // Disconnect any existing connection

      this.simulationId = simulationId;
      this.ws = new WebSocket(`${WS_BASE_URL}/ws/${simulationId}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected for simulation ID:', simulationId);
        resolve();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(message));
        } catch (error: any) {
          console.error('Error parsing WebSocket message:', error);
          this.errorHandler && this.errorHandler(new Error(`Failed to parse WebSocket message: ${error.message}`));
        }
      };

      this.ws.onclose = (event) => {
        let message = `WebSocket disconnected. Code: ${event.code}. Reason: ${event.reason || 'No reason provided'}.`;
        if (event.code === 1006) { // Abnormal closure, e.g., server not running
          message = 'WebSocket disconnected: Could not connect to the backend WebSocket server. Please ensure the server is running.';
        }
        console.log(message);
        this.errorHandler && this.errorHandler(new Error(message));
        this.simulationId = null;
      };

      this.ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        const errorMessage = 'WebSocket connection error. Please check your network and ensure the backend server is accessible.';
        this.errorHandler && this.errorHandler(new Error(errorMessage));
        reject(new Error(errorMessage));
      };
    });
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public sendMessage(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      const errorMessage = 'WebSocket is not open. Message not sent.';
      console.warn(errorMessage, message);
      this.errorHandler && this.errorHandler(new Error(errorMessage));
    }
  }

  public onMessage(handler: (message: WebSocketMessage) => void): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  public onError(handler: (error: Error) => void): () => void {
    this.errorHandler = handler;
    return () => {
      this.errorHandler = null;
    };
  }
}

export const webSocketService = new WebSocketService();
