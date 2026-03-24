import socket
import serial
import time

HOST = "0.0.0.0"
PORT = 5001
SERIAL_PORT = "/dev/ttyACM0"
BAUDRATE = 9600

arduino = serial.Serial(SERIAL_PORT, BAUDRATE, timeout=2)
time.sleep(2)

def leer_arduino():
    arduino.reset_input_buffer()
    arduino.write(b"GET_DATA\n")

    inicio = time.time()
    timeout_total = 5  # segundos máximos de espera

    while time.time() - inicio < timeout_total:
        respuesta = arduino.readline().decode("utf-8", errors="ignore").strip()
        print("Arduino respondió:", repr(respuesta))

        if respuesta.startswith("{") and respuesta.endswith("}"):
            return respuesta

    return None

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind((HOST, PORT))
server.listen(5)

print(f"Servidor TCP escuchando en {HOST}:{PORT}")

while True:
    conn, addr = server.accept()
    print("Conexión desde:", addr)

    try:
        data = conn.recv(1024).decode("utf-8", errors="ignore").strip()
        print("Comando recibido:", repr(data))

        if data == "GET_DATA":
            respuesta = leer_arduino()

            if respuesta:
                conn.sendall((respuesta + "\n").encode("utf-8"))
            else:
                conn.sendall(b'{"error":"Sin respuesta valida del Arduino"}\n')
        else:
            conn.sendall(b'{"error":"Comando no valido"}\n')

    except Exception as e:
        print("Error en servidor:", repr(e))
        mensaje = f'{{"error":"{str(e)}"}}\n'
        conn.sendall(mensaje.encode("utf-8"))

    finally:
        conn.close()
