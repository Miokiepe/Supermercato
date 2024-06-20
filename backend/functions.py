import mysql.connector
import hashlib
import random
config = {
    "host":"127.0.0.1",
    "port":"3306",
    "user":"root",
    "database": "supermercato"
}

#Creazione della connessione al db
def open_db_connection():
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor(dictionary=True, buffered=True)
    return conn, cursor
    
#Chiusura della connessione al db
def close_db_connection(conn: mysql.connector.MySQLConnection) -> None:
    conn.commit()
    conn.close()
    
#Criptaggio della password dell'utente
def crypt(password: str) -> str:
    hash_object = hashlib.sha1()
    # Convert la password in byte e la cifra
    hash_object.update(password.encode())
    # restituisce la password in cifre esadecimali
    return hash_object.hexdigest()
    
def generate_token() -> str:
    hash_object = hashlib.sha1()
    # Convert la password in byte e la cifra
    hash_object.update(str(random.randint(0,100) + random.random()).encode())
    # restituisce la password in cifre esadecimali
    return hash_object.hexdigest()

mesi = [
    {
        "nome": "Gennaio",
        "giorni": 31
    },
    {
        "nome": "Febbraio",
        "giorni": 28
    },
    {
        "nome": "Marzo",
        "giorni": 31
    },
    {
        "nome": "Aprile",
        "giorni": 30
    },
    {
        "nome": "Maggio",
        "giorni": 31
    },
    {
        "nome": "Giugno",
        "giorni": 30
    },
    {
        "nome": "Luglio",
        "giorni": 31
    },
    {
        "nome": "Agosto",
        "giorni": 31
    },
    {
        "nome": "Settembre",
        "giorni": 30
    },
    {
        "nome": "Ottobre",
        "giorni": 31
    },
    {
        "nome": "Novembre",
        "giorni": 30
    },
    {
        "nome": "Dicembre",
        "giorni": 31
    }
]


def bisestile(anno) -> bool:
    return anno % 4 == 0 and anno % 400 == 0
