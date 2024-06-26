from fastapi import FastAPI,HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime
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
    cursor.execute("INSERT INTO utenti (nome, cognome, email, password, autenticato, genere, cap, città, via, prefisso, numero) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", (utente.nome, utente.cognome, utente.email, crypt(utente.password), utente.autenticato, utente.genere, utente.cap, utente.città, utente.via, utente. prefisso, utente.numero))
    close_db_connection(conn)

#Creazione di un utente gestore
@app.post('/api/add_admin',status_code=201)
def create(utente: Gestore):
    conn, cursor = open_db_connection()
    cursor.execute("SELECT * FROM gestori WHERE email = %s AND ruolo = %s", (utente.email, utente.role))
    email = cursor.fetchone()
    if email != None:
        raise HTTPException(status_code=409)
    cursor.execute("INSERT INTO gestori(nome,cognome,email,password,autenticato,ruolo) VALUES (%s, %s, %s, %s, %s, %s)",(utente.nome, utente.cognome, utente.email, crypt(utente.password), "0", utente.role))
    close_db_connection(conn)
    
#Aggiornamento di un utente 
@app.put('/api/update_account',status_code=200)
def update(utente: Old_New_User):
    conn, cursor = open_db_connection()
    if utente.new.password != "":
        password = crypt(utente.new.password)
    else:
        password = admin.old.password
    cursor.execute("UPDATE utenti SET nome = %s, cognome = %s, email = %s, password = %s, autenticato = %s, genere = %s, cap = %s, città = %s, via = %s, prefisso = %s, numero = %s WHERE id_utente = %s",(utente.new.nome, utente.new.cognome, utente.new.email, password,utente.new.autenticato, utente.new.genere, utente.new.cap, utente.new.città, utente.new.via, utente.new.prefisso, utente.new.numero, utente.old.id_utente))
    cursor.execute("SELECT password FROM gestori WHERE email = %s",(utente.new.email,))
    passs = cursor.fetchone()
    close_db_connection(conn)
    return {
        "password": passs
    }
    close_db_connection(conn)

#Aggiornamento di un utente gestore
@app.put('/api/update_account_admin',status_code=200)
def update(admin: Old_New_Gestore):
    conn, cursor = open_db_connection()
    if admin.new.password != "":
        password = crypt(admin.new.password)
    else:
        password = admin.old.password
    cursor.execute("UPDATE gestori SET nome = %s, cognome = %s, email = %s, password = %s WHERE email = %s AND password = %s",(admin.new.nome, admin.new.cognome, admin.new.email, password, admin.old.email, admin.old.password))
    cursor.execute("SELECT password FROM gestori WHERE email = %s",(admin.new.email,))
    passs = cursor.fetchone()
    close_db_connection(conn)
    return {
        "password": passs
    }

#Eliminazione di un utente
@app.delete('/api/delete_account',status_code=200)
def delete(utente: User):
    conn,cursor = open_db_connection()
    #cursor.execute("DELETE FROM utenti WHERE email = %s AND password = %s",(utente.email, utente.password))
    cursor.execute("SELECT COUNT(id_utente) as ordini FROM ordini WHERE id_utente = %s AND stato != 7",(utente.id_utente, ))
    ordini_incompleti = cursor.fetchone()
    if ordini_incompleti["ordini"] != 0:
        raise HTTPException(status_code=400, detail=ordini_incompleti)
    else:
        cursor.execute("DELETE FROM ordini WHERE id_utente = %s",(utente.id_utente, ))
        cursor.execute("DELETE FROM utenti WHERE id_utente = %s",(utente.id_utente, ))
    close_db_connection(conn)

#Eliminazione di un gestore
@app.delete('/api/delete_admin',status_code=200)
def delete(admin: Gestore):
    conn,cursor = open_db_connection()
    cursor.execute("DELETE FROM gestori WHERE email = %s AND password = %s",(admin.email, admin.password))
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
  
#Restituzione di tutti gli utenti per il gestore
@app.post('/api/get_users')
def get_users(admin: User_token):
        conn,cursor = open_db_connection()
        cursor.execute("SELECT * FROM gestori WHERE email = %s AND password = %s AND autenticato = %s",(admin.email, admin.password, admin.token))
        user = cursor.fetchone()
        if user == None:
            raise HTTPException(status_code=401)
        cursor.execute("SELECT gestori.nome, gestori.cognome, gestori.email, gestori.password, gestori.ruolo FROM gestori")
        gestori = cursor.fetchall()
        cursor.execute("SELECT utenti.nome, utenti.cognome, utenti.email, utenti.password, utenti.genere, utenti.numero, utenti.prefisso, utenti.città FROM utenti")
        utenti = cursor.fetchall()
        close_db_connection(conn)
        return {
            "gestori": gestori,
            "utenti": utenti
        }

#Eseguendo il login viene generato un token.
@app.post('/api/login', status_code=301)
def login(login: Login):
    conn, cursor = open_db_connection()
    if login.role == "utente":
        cursor.execute("SELECT * FROM utenti WHERE email = %s AND password = %s",(login.email, crypt(login.password)))
    else:
        cursor.execute("SELECT * FROM gestori WHERE email = %s AND password = %s AND ruolo = %s",(login.email, crypt(login.password), login.role))
    exists = cursor.fetchone()
    if exists == None:
        raise HTTPException(status_code=401)
    token = generate_token()
    table = "utenti" if login.role == "utente" else "gestori"
    cursor.execute(f"UPDATE {table} SET autenticato = %s WHERE email = %s AND password = %s", (token,login.email, crypt(login.password)))
    close_db_connection(conn)
    return {
        "token": token,
        "password": crypt(login.password)
        }

#Quando si accede a home.html il client invia il token ricevuto dal server per verificare la sessione.
#Inoltre, l'utente riceve il suo nome, il suo ID, il numero di item nel carrello, gli ordini che ha effetuato
@app.post('/api/home', status_code=200)
def home(token: User_token):
    conn, cursor = open_db_connection()
    table = "utenti" if token.role == "utente" else "gestori"
    id = "id_utente" if token.role == "utente" else "id_gestore"
    cursor.execute(f"SELECT {id}, nome FROM {table} WHERE autenticato = %s AND email = %s AND password = %s",(token.token,token.email,token.password))
    user = cursor.fetchone()
    if user == None:
        raise HTTPException(status_code=301)
    if table == "utenti":
        cursor.execute("SELECT COUNT(id_utente) as n FROM carrello WHERE id_utente = %s",(user[id],))
        n = cursor.fetchone()
        close_db_connection(conn)
        return {
                "nome":user["nome"],
                "id": user["id_utente"],
                "carrello":n,
               }
    else:
        close_db_connection(conn)
        return {
            "nome": user["nome"]
        }
#Log out utenti, gestori
@app.post('/api/logout', status_code=301)
def logout(login: Login):
    table = "utenti" if login.role == "utente" else "gestori"
    conn, cursor = open_db_connection()
    cursor.execute(f"UPDATE {table} SET autenticato = 0 WHERE email = %s AND password = %s",(login.email, login.password))
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

#Cancellazione di un prodotto
@app.delete('/api/delete_item', status_code=200)
def delete(item: Item):
    conn, cursor = open_db_connection()
    #Contrassegnare l'item con un nome riservato, in modo da considerarlo come eliminato. 
    cursor.execute("UPDATE prodotti SET tipo = 5 WHERE id_prodotto = %s",(item.id_prodotto, ))
    close_db_connection(conn)

#Restituzione di tutti prodotti 
@app.get('/api/get_items/{n}')
def get(n):
    conn, cursor = open_db_connection()
    cursor.execute(f"SELECT * FROM prodotti WHERE tipo != 5 ORDER BY creazione DESC LIMIT {n}")
    items = cursor.fetchall()
    close_db_connection(conn)
    return {"items": items}         

#Ricerca di un prodotto per nome
@app.get('/api/search_items/{nome}')
def search(nome):
    conn, cursor = open_db_connection()
    cursor.execute("SELECT * FROM prodotti WHERE nome LIKE %s",("%" + nome + "%",))
    items = cursor.fetchall()
    close_db_connection(conn)
    return {
        "items":items
    }

#Aggiunta di un prodotto nel carrello
@app.post('/api/add_cart', status_code=201)
def add(item: Cart_Item):
    conn, cursor = open_db_connection()
    #Se l'elemento non esiste aggiungilo, altrimenti incrementa la quantità esistente
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
    cursor.execute("SELECT utenti.id_utente, prodotti.id_prodotto ,prodotti.nome, prodotti.tipo, prodotti.costo, prodotti.disponibilità, carrello.quantità_richiesta FROM prodotti JOIN carrello ON prodotti.id_prodotto = carrello.id_prodotto JOIN utenti ON carrello.id_utente = utenti.id_utente WHERE carrello.id_utente = %s;",(user_id.id_utente,))
    items = cursor.fetchall()
    close_db_connection(conn)
    return {"items": items}

#Acquisto dei prodotti nel carrello
@app.put('/api/buy_cart', status_code=200)
def buy(items: Cart_Items):
    conn, cursor = open_db_connection()
    cursor = conn.cursor(dictionary=True)
    gruppo = 0
    cursor.execute("SELECT gruppo FROM ordini ORDER BY gruppo DESC LIMIT 1")
    g = cursor.fetchone()["gruppo"]
    if g != None:
        gruppo = g + 1
    for item in items.items:
        cursor.execute("SELECT * FROM prodotti WHERE id_prodotto = %s",(item.id_prodotto,))
        old_quantity = cursor.fetchone()["disponibilità"]
        if old_quantity < item.quantità :
            raise HTTPException(status_code=409)
        else:
            cursor.execute("INSERT INTO ordini(id_utente, id_prodotto, quantità, stato, gruppo) VALUES (%s, %s, %s, %s, %s)",(item.id_utente, item.id_prodotto,item.quantità, 0, gruppo))
            cursor.execute("DELETE from carrello WHERE id_utente = %s AND id_prodotto = %s",(item.id_utente, item.id_prodotto))
            cursor.execute("UPDATE prodotti SET disponibilità = %s WHERE id_prodotto = %s",(old_quantity - item.quantità,item.id_prodotto))
    close_db_connection(conn)

#Modifica dello stato dell'ordine
@app.put('/api/update_status')
def update(item: Order_Items | Order):
    conn, cursor = open_db_connection()
    cursor.execute("UPDATE ordini SET stato = %s WHERE id_ordine = %s",(item.stato, item.id_ordine))
    close_db_connection(conn)

#Restituzione di tutti gli ordini per il corriere
@app.post('/api/get_orders',status_code=200)
def get(corriere: User_token):
    conn, cursor = open_db_connection()
    cursor.execute("SELECT utenti.via, utenti.cap, utenti.città, ordini.* FROM ordini JOIN utenti ON utenti.id_utente = ordini.id_utente ORDER BY GRUPPO ASC")
    items = cursor.fetchall()
    close_db_connection(conn)
    return {
        "items":items
    }

#Ricerca di un ordine
@app.get('/api/search_orders/{id}',status_code=200)
def search(id: str):
    conn, cursor = open_db_connection()
    ordini = []
    ids = id.split('-')
    for char in ids:
        cursor.execute("SELECT utenti.via, utenti.cap, utenti.città, ordini.* FROM ordini JOIN utenti ON utenti.id_utente = ordini.id_utente WHERE id_ordine = %s",(char, ))
        ordini.append(cursor.fetchone())
    close_db_connection(conn)
    if(len(ordini) > 1):
        i = 0
        while(i < len(ordini) - 1 and i != -1):
            if ordini[i]["gruppo"] != ordini[i+1]["gruppo"]:
                    i = -1
            else:
                i+=1
    
        if i == -1:
            raise HTTPException(404)
    return {
        "ordini": list(ordini)
    }

#Restituzione di tutti gli ordini per l'utente   
@app.post('/api/get_orders_user',status_code=200)
def get(user: User_token):
    conn, cursor = open_db_connection()
    
    cursor.execute("SELECT id_utente FROM utenti WHERE email = %s AND password = %s AND autenticato = %s",(user.email, user.password, user.token))
    id = cursor.fetchone()
    cursor.execute("SELECT prodotti.nome, prodotti.tipo, prodotti.costo, ordini.id_ordine, ordini.quantità, ordini.stato, ordini.gruppo, ordini.creazione FROM ordini JOIN prodotti ON ordini.id_prodotto = prodotti.id_prodotto WHERE id_utente = %s ORDER BY ordini.creazione DESC",(id['id_utente'],))
    ordini = cursor.fetchall()
    close_db_connection(conn)
    return {
        "ordini": ordini
    }

#Restituzione di statistiche per il gestore
@app.get('/api/get_data_admin')
def get():
    conn, cursor = open_db_connection()
    cursor.execute("SELECT prodotti.tipo, SUM(ordini.quantità) AS n_venduti FROM ordini JOIN prodotti ON prodotti.id_prodotto = ordini.id_prodotto WHERE prodotti.tipo != 7 GROUP BY tipo")
    venduti = cursor.fetchall()
    venduti_mese = []
    for mese in range(1,13):
        cursor.execute("SELECT SUM(quantità) AS n_venduti, creazione FROM ordini WHERE YEAR(creazione) = YEAR(CURDATE()) AND MONTH(creazione) = %s GROUP BY creazione;",(mese, ))
        venduti_mese.append(cursor.fetchone())
    cursor.execute("SELECT COUNT(id_utente) AS n_item FROM utenti")
    utenti = cursor.fetchone()
    cursor.execute("SELECT ruolo, COUNT(ruolo) as n_items from gestori GROUP BY ruolo;")
    gestori = cursor.fetchall()
    close_db_connection(conn)
    return {
       "venduti_categorie": venduti,
       "venduti_mese": venduti_mese,
       "utenza": {
           "utenti": utenti,
           "gestori": gestori
       } 
    }

#Restituzione delle vendite dato un mese
@app.get('/api/get_data/{mese}')
def get(mese: int):
    conn, cursor = open_db_connection()
    venduti_mese = []
    for i in range(1, mesi[mese]["giorni"] + 1):
        cursor.execute("SELECT SUM(quantità) AS n_venduti, creazione FROM ordini WHERE YEAR(creazione) = YEAR(CURDATE()) AND MONTH(creazione) = %s AND DAY(creazione) = %s GROUP BY creazione;",(mese + 1, i))
        venduti_mese.append(cursor.fetchone())
    if bisestile(datetime.now().year) and mese == 1:
        cursor.execute("SELECT SUM(quantità) AS n_venduti, creazione FROM ordini WHERE YEAR(creazione) = YEAR(CURDATE()) AND MONTH(creazione) = %s AND DAY(creazione) = %s GROUP BY creazione;",(mese + 1, 29))
        venduti_mese.append(cursor.fetchone())
    close_db_connection(conn)
    return {
        "venduti_mese": venduti_mese
    }
   
#Restituzione di statistiche per il corriere
@app.get('/api/get_data_courier')
def get():
       conn, cursor = open_db_connection()
       cursor.execute("SELECT COUNT(stato) AS n_item, stato FROM ordini GROUP BY stato;")
       items = cursor.fetchall()
       close_db_connection(conn)
       return {
           "spedizioni" : items
       }

#Restituzione delle transazioni degli utenti
@app.get('/api/get_transazioni')
def get():
    conn, cursor = open_db_connection()
    cursor.execute("SELECT prodotti.nome, prodotti.tipo, prodotti.costo, ordini.quantità, ordini.creazione, ordini.id_ordine FROM ordini JOIN prodotti ON prodotti.id_prodotto = ordini.id_prodotto ORDER BY ordini.id_ordine ASC")
    transazioni = cursor.fetchall()
    close_db_connection(conn)
    return {
        "transazioni": transazioni
    }

#Restituzione di una transazione dato l'id
@app.get('/api/get_transazione/{id}')
def get(id):
       conn, cursor = open_db_connection()
       cursor.execute("SELECT prodotti.nome, prodotti.tipo, prodotti.costo, ordini.quantità, ordini.creazione, ordini.id_ordine FROM ordini JOIN prodotti ON prodotti.id_prodotto = ordini.id_prodotto WHERE ordini.id_ordine = %s",(id, ))
       transazione = cursor.fetchone()
       close_db_connection(conn)
       return transazione
    
if __name__ == "__main__":
    uvicorn.run("server:app", port=5000, log_level="info")
