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

#Aggiunta di un prodotto nel carrello
@app.post('/api/add_cart', status_code=201)
def add(item: Cart_Item):
    conn, cursor = open_db_connection()
    #Se l'elemento non esiste aggiungilo, altrimenti incerementa la quantità esistente
    cursor.execute("SELECT * FROM carrello WHERE id_prodotto = %s AND id_utente = %s", (item.id_prodotto, item.id_utente))
    value = cursor.fetchone()
    if value == None:
        cursor.execute("INSERT INTO carrello(id_prodotto, id_utente, quantità_richiesta) VALUES (%s, %s, %s)", (item.id_prodotto, item.id_utente, item.quantità))
    else:
        cursor.execute("UPDATE carrello SET quantità_richiesta = %s WHERE id_utente = %s AND id_prodotto = %s",(value["quantità_richiesta"] + item.quantità, item.id_utente, item.id_prodotto))
    close_db_connection(conn)

#Modifica della quantità di un prodotto nel carrello
@app.put("/api/update_cart")
def update(item: Cart_Item):
    conn, cursor = open_db_connection()
    cursor.execute("UPDATE carrello SET quantità_richiesta = %s WHERE id_utente = %s AND id_prodotto = %s",(item.quantità, item.id_utente, item.id_prodotto))
    close_db_connection(conn)

#Rimozione di un prodotto nel carrello
@app.delete('/api/delete_cart', status_code=200)
def delete(item: Cart_Item):
    conn, cursor = open_db_connection()
    cursor.execute("DELETE from CARRELLO WHERE id_prodotto = %s AND id_utente = %s",(item.id_prodotto, item.id_utente))
    close_db_connection(conn)

#Restituzione degli elementi nel carrello
@app.post('/api/get_cart')
def get(user_id: User_id):
    conn, cursor = open_db_connection()
    cursor.execute("SELECT * FROM prodotti JOIN carrello ON prodotti.id_prodotto = carrello.id_prodotto JOIN utenti ON carrello.id_utente = %s",(user_id.id_utente,))
    items = cursor.fetchall()
    close_db_connection(conn)
    return {"items": items}

#Acquisto dei prodotti nel carrello
@app.put('/api/buy_cart', status_code=200)
def buy(items: Cart_Items):
    conn, cursor = open_db_connection()
    for item in items.items:
        cursor.execute("SELECT * FROM prodotti WHERE id_prodotto = %s",(item.id_prodotto,))
        old_quantity = cursor.fetchone()["disponibilità"]
        if(old_quantity < item.quantità):
            raise HTTPException(status_code=409)
        else:
            cursor.execute("UPDATE prodotti SET disponibilità = %s WHERE id_prodotto = %s",(old_quantity - item.quantità, item.id_prodotto))
            cursor.execute("DELETE from carrello WHERE id_utente = %s AND id_prodotto = %s",(item.id_utente, item.id_prodotto))
    close_db_connection(conn)

if __name__ == "__main__":
    uvicorn.run("server:app", port=5000, log_level="info")