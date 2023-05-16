import asyncio
import json
import websockets
import socket

IP1 = "192.168.1.72"
IP2 = "192.168.1.48"

async def start_server():
    await websockets.serve(connect, IP1, 5679)


async def connect(websocket, path):
    print("connected")
    while True:
        new_mess = await websocket.recv()
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.sendto(b'hepy2', (IP2, 4567))
        new_data, addr = sock.recvfrom(1024)
        message = json.dumps({"pulse_data": new_data[0], "sp02_data": new_data[1]})
        print(message)
        await websocket.send(message)


if __name__ == '__main__':
    event_loop = asyncio.new_event_loop()
    asyncio.set_event_loop(event_loop)
    event_loop.run_until_complete(start_server())
    event_loop.run_forever()
