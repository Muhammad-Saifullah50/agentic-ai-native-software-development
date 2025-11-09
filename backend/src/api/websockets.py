from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.websocket_manager import manager

router = APIRouter()

@router.websocket("/ws/{simulation_id}")
async def websocket_endpoint(websocket: WebSocket, simulation_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # For now, just echo back the message or handle specific commands
            await manager.send_personal_message(f"You sent: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{simulation_id} left the chat")
