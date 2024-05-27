from fastapi import FastAPI,HTTPException
from fastapi.responses import RedirectResponse
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
        cursor.execute("INSERT INTO utenti (nome, cognome, email, password, autenticato, genere, cap, città, via, prefisso, numero) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (utente.nome, utente.cognome, utente.email, crypt(utente.password), utente.autenticato, utente.genere, utente.cap, utente.città, utente.via, utente. prefisso, utente.numero))
        close_db_connection(conn)

#Aggiornamento di un utente 
@app.put('/api/update_account',status_code=200)
def update(utente: Old_New_User):
    conn, cursor = open_db_connection()
    cursor.execute("UPDATE utenti SET nome = %s, cognome = %s, email = %s, password = %s, autenticato = %s, genere = %s, cap = %s, città = %s, via = %s, prefisso = %s, numero = %s WHERE id_utente = %s",(utente.new.nome, utente.new.cognome, utente.new.email, utente.new.password,utente.new.autenticato, utente.new.genere, utente.new.cap, utente.new.città, utente.new.via, utente.new.prefisso, utente.new.numero, utente.old.id_utente))
    close_db_connection(conn)

#Cancellazzione di un utente
@app.delete('/api/delete_account',status_code=200)
def delete(utente: User):
    conn,cursor = open_db_connection()
    cursor.execute("DELETE FROM utenti WHERE id_utente = %s",(utente.id_utente,))
    close_db_connection(conn)
    
#Restituzione dell'utente
@app.post('/api/get_account')
def get(utente: User_token):
    conn,cursor = open_db_connection()
    table = "utenti" if utente.role == "utente" else "gestori"
    cursor.execute(f"SELECT * FROM {table} WHERE email = %s AND password = %s AND autenticato = %s",(utente.email, utente.password, utente.token))
    user = cursor.fetchone()
    close_db_connection(conn)
    return {"user": user}
    
#Eseguendo il login viene generato un token.
@app.post('/api/login', status_code=301)
def login(login: Login):
    conn, cursor = open_db_connection()
    table = "utenti" if login.role == "utente" else "gestori"
    cursor.execute(f"SELECT * FROM {table} WHERE email = %s AND password = %s",(login.email, crypt(login.password)))
    exists = cursor.fetchone()
    if exists == None:
        raise HTTPException(status_code=401)
    token = generate_token()
    cursor.execute(f"UPDATE {table} SET autenticato = %s WHERE email = %s AND password = %s", (token,login.email, crypt(login.password)))
    close_db_connection(conn)
    return {
        "token": token,
        "password": crypt(login.password)
        }

#Quando si accede a home.html il client invia il token ricevuto dal server per verificare la sessione
@app.post('/api/home', status_code=200)
def home(token: User_token):
    conn, cursor = open_db_connection()
    table = "utenti" if token.role == "utente" else "gestori"
    id = "id_utente" if token.role == "utente" else "id_gestore"
    cursor.execute(f"SELECT {id}, nome FROM {table} WHERE autenticato = %s AND email = %s AND password = %s",(token.token,token.email,token.password))
    user = cursor.fetchone()
    if user[id] == None:
        raise HTTPException(status_code=301)
    if table == "utenti":
        cursor.execute("SELECT COUNT(id_utente) as n FROM carrello WHERE id_utente = %s",(user[id],))
        n = cursor.fetchone()
        close_db_connection(conn)
        return {
                "nome":user["nome"],
                "id": user["id_utente"],
                "carrello":n
               }
    else:
        close_db_connection(conn)
        return {
            "nome": user["nome"]
        }

@app.post('/api/logout', status_code=301)
def logout(login: Login):
    table = "utenti" if login.role == "utente" else "gestori"
    conn, cursor = open_db_connection()
    cursor.execute(f"UPDATE {table} SET autenticato = 0 WHERE email = %s AND password = %s",(login.email, crypt(login.password)))
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
    cursor.execute("UPDATE prodotti SET nome = %s, tipo = %s, costo = %s, disponibilità = %s WHERE id_prodotto = %s",(item.new.nome, item.new.tipo, item.new.costo, item.new.disponibilità, item.old.id_prodotto))
    close_db_connection(conn)

#Cancellazzione di un prodotto
@app.delete('/api/delete_item', status_code=200)
def delete(item: Item):
    conn, cursor = open_db_connection()
    cursor.execute("DELETE FROM prodotti WHERE id_prodotto = '%s'", (item.id_prodotto,))
    close_db_connection(conn)

#Restituzione di tutti prodotti 
@app.get('/api/get_items/{n}')
def get(n):
    conn, cursor = open_db_connection()
    cursor.execute(f"SELECT * FROM prodotti ORDER BY creazione DESC LIMIT {n}")
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
