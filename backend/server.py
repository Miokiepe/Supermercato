from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from models import *
from functions import *

#Creazione del server
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
        #Restituiamo 409 se la mail usata nella registrazione è gia presente nel db
        raise HTTPException(status_code=409) 
    else:
        cursor.execute("INSERT INTO utenti (nome, cognome, email, password) VALUES (%s, %s, %s, %s)", (utente.nome, utente.cognome, utente.email, crypt(utente.password)))
        close_db_connection(conn)

#Aggiornamento di un utente
@app.put('/api/update_account',status_code=200)
def update(utente: Old_New_User):
    conn, cursor = open_db_connection()
    cursor.execute("UPDATE utenti SET nome = %s, cognome = %s, email = %s, password = %s WHERE email = %s AND password = %s",(utente.new.nome, utente.new.cognome, utente.new.email, crypt(utente.new.password), utente.old.email, crypt(utente.old.password)))
    close_db_connection(conn)

#Cancellazzione di un utente
@app.delete('/api/delete_account',status_code=200)
def delete(utente: User):
    conn,cursor = open_db_connection()
    cursor.execute("DELETE FROM utenti WHERE id_utente = '%s'",(utente.id))
    close_db_connection(conn)

#Aggiunta di un prodotto
@app.post('/api/add_item', status_code=201)
def add(item: Item):
    conn, cursor = open_db_connection()
    cursor.execute("INSERT INTO prodotti(nome, tipo, costo, disponibilità) VALUES(%s, %s, %s, %s)", (item.nome, item.tipo, item.costo, item.disponibilità))
    close_db_connection(conn)
    
#Modifica di un prodotto
@app.put('/api/update_item', status_code=200)
def update(item: Old_New_Item):
    conn, cursor = open_db_connection()
    cursor.execute("UPDATE prodotti SET nome = %s, tipo = %s, costo = %s, disponibilità = %s WHERE nome = %s AND tipo = %s",(item.new.nome, item.new.tipo, item.new.costo, item.new.disponibilità, item.old.nome, item.old.tipo))
    close_db_connection(conn)

#Cancellazzione di un prodotto
@app.delete('/api/delete_item', status_code=200)
def delete(item: Item):
    conn, cursor = open_db_connection()
    cursor.execute("DELETE FROM prodotti WHERE id_prodotto = '%s'", (item.id,))
    close_db_connection(conn)

#Restituzione di tutti prodotti 
@app.get('/api/get_items')
def get():
    conn, cursor = open_db_connection()
    cursor.execute("SELECT * FROM prodotti")
    items = cursor.fetchall()
    close_db_connection(conn)
    return {"items": items}         

if __name__ == "__main__":
    uvicorn.run("server:app", port=5000, log_level="info")