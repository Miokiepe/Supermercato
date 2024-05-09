import mysql.connector
import hashlib
config = {
    "host":"127.0.0.1",
    "port":"3306",
    "user":"root",
    "database": "supermercato"
}

#Creazione della connessione al db
def open_db_connection():
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor(dictionary=True)
    return conn, cursor
    
#Chiusura della connessione al db
def close_db_connection(conn: mysql.connector.MySQLConnection):
    conn.commit()
    conn.close()
    
#Criptaggio della password dell'utente
def crypt(password: str) -> str:
    hash_object = hashlib.sha1()
    # Convert la password in byte e la cifra
    hash_object.update(password.encode())
    # restituisce la password in cifre esadecimali
    return hash_object.hexdigest()
    