// book-source/src/services/websocketService.test.ts
import { WebSocketService } from './websocketService';

// Mock WebSocket
class MockWebSocket {
  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  readyState: number = WebSocket.CLOSED;
  url: string;
  messages: string[] = [];

  constructor(url: string) {
    this.url = url;
    setTimeout(() => {
      this.readyState = WebSocket.OPEN;
      this.onopen && this.onopen();
    }, 100); // Simulate async connection
  }

  send(data: string) {
    this.messages.push(data);
  }

  close(code?: number, reason?: string) {
    this.readyState = WebSocket.CLOSED;
    this.onclose && this.onclose(new CloseEvent('close', { code, reason }));
  }
}

// Mock global WebSocket
(global as any).WebSocket = MockWebSocket;

describe('WebSocketService', () => {
  let service: WebSocketService;
  let mockWs: MockWebSocket;

  const WS_URL = 'ws://localhost:8000/ws/test-sim-123';
  const SIM_ID = 'test-sim-123';

  beforeEach(() => {
    service = new WebSocketService();
    // Reset the mock WebSocket for each test
    (global as any).WebSocket = jest.fn((url) => {
      mockWs = new MockWebSocket(url);
      return mockWs;
    });
  });

  afterEach(() => {
    service.disconnect();
  });

  it('should connect to the WebSocket server', async () => {
    await service.connect(SIM_ID);
    expect(global.WebSocket).toHaveBeenCalledWith(WS_URL);
    expect(mockWs.readyState).toBe(WebSocket.OPEN);
  });

  it('should send messages when connected', async () => {
    await service.connect(SIM_ID);
    const message = { type: 'PLAY', payload: { action: 'start' } };
    service.sendMessage(message);
    expect(mockWs.messages).toEqual([JSON.stringify(message)]);
  });

  it('should not send messages when not open', () => {
    const message = { type: 'PLAY', payload: { action: 'start' } };
    service.sendMessage(message);
    expect(mockWs.messages).toEqual([]);
    // Expect a console warning, but not an error
    expect(console.warn).toHaveBeenCalledWith('WebSocket is not open. Message not sent:', message);
  });

  it('should receive messages', async () => {
    await service.connect(SIM_ID);
    const handler = jest.fn();
    const unsubscribe = service.onMessage(handler);

    const receivedMessage = { type: 'UPDATE', payload: { status: 'running' } };
    mockWs.onmessage && mockWs.onmessage({ data: JSON.stringify(receivedMessage) } as MessageEvent);

    expect(handler).toHaveBeenCalledWith(receivedMessage);
    unsubscribe();
  });

  it('should handle WebSocket errors during connection', async () => {
    const errorHandler = jest.fn();
    service.onError(errorHandler);

    (global.WebSocket as jest.Mock).mockImplementationOnce((url) => {
      mockWs = new MockWebSocket(url);
      setTimeout(() => {
        mockWs.onerror && mockWs.onerror(new Event('error'));
      }, 100);
      return mockWs;
    });

    await expect(service.connect(SIM_ID)).rejects.toThrow('WebSocket connection error. Please check your network and ensure the backend server is accessible.');
    expect(errorHandler).toHaveBeenCalledWith(new Error('WebSocket connection error. Please check your network and ensure the backend server is accessible.'));
  });

  it('should handle WebSocket disconnection', async () => {
    const errorHandler = jest.fn();
    service.onError(errorHandler);

    await service.connect(SIM_ID);
    service.disconnect();

    expect(mockWs.readyState).toBe(WebSocket.CLOSED);
    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error));
    expect(errorHandler.mock.calls[0][0].message).toMatch(/WebSocket disconnected\. Code: \d+\. Reason: .*/);
  });

  it('should handle WebSocket abnormal disconnection (server not running)', async () => {
    const errorHandler = jest.fn();
    service.onError(errorHandler);

    await service.connect(SIM_ID);
    mockWs.onclose && mockWs.onclose(new CloseEvent('close', { code: 1006, reason: 'Abnormal closure' }));

    expect(errorHandler).toHaveBeenCalledWith(new Error('WebSocket disconnected: Could not connect to the backend WebSocket server. Please ensure the server is running.'));
  });

  it('should handle message parsing errors', async () => {
    const errorHandler = jest.fn();
    service.onError(errorHandler);
    await service.connect(SIM_ID);

    mockWs.onmessage && mockWs.onmessage({ data: 'invalid json' } as MessageEvent);

    expect(errorHandler).toHaveBeenCalledWith(new Error('Failed to parse WebSocket message: Unexpected token \'i\', \'invalid json\' is not valid JSON'));
  });
});
