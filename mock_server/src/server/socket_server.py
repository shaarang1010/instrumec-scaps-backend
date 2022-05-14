# echo-server.py

import socket

HOST = "127.0.0.1"
PORT = 4000

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
sock.bind((HOST, PORT))
sock.listen(5)

try:
    while True:
        print("Connected to Server .... ")
        conn, addr = sock.accept()
        data = conn.recv(1024)
        while data:
            print(data.decode("utf-8"))
            data = conn.recv(1024)
            conn.sendall(data)
except KeyboardInterrupt:
    sock.close
