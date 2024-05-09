from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from models import *
from functions import *
app = FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], #Modificare con le rotte /api/...
    allow_credentials=True,
    allow_methods=["GET","POST","PUT","DELETE"],
    allow_headers=["*"],
)

#Creazione di un utente
@app.post('/api/create_account', status_code=201) 
def create(utente: User):
    conn, cursor = open_db_connection()
    cursor.execute("SELECT * FROM utenti WHERE email = %s", (utente.email, ))
    email = cursor.fetchone()
    if email != None:
        raise HTTPException(status_code=409) #Restituiamo 409 se la mail usata nella registrazione è gia presente nel db
    else:
        cursor.execute("INSERT INTO utenti (nome, cognome, email, password) VALUES (%s, %s, %s, %s)", (utente.nome, utente.cognome, utente.email, crypt(utente.password)))
        close_db_connection(conn)


@app.put('/api/update_account',status_code=200)
def update(utente: Old_New_User):
    conn, cursor = open_db_connection()
    cursor.execute("UPDATE utenti SET nome = %s, cognome = %s, email = %s, password = %s WHERE email = %s AND password = %s",(utente.new.nome, utente.new.cognome, utente.new.email, crypt(utente.new.password), utente.old.email, crypt(utente.old.password)))
    close_db_connection(conn)

#Cancellazzione di un utente
@app.delete('/api/delete_account',status_code=200)
def delete(utente: User):
    conn,cursor = open_db_connection()
    cursor.execute("DELETE FROM utenti WHERE email = %s AND password = %s",(utente.email,crypt(utente.password)))
    close_db_connection(conn)

if __name__ == "__main__":
    uvicorn.run("server:app", port=5000, log_level="info")