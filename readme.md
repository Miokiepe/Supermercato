# Backend Documentation

## Indice
1. [Struttura del Database "supermercato"](#database)
    1. [Utenti](#utenti)
    2. [Prodotti](#prodotti)
    3. [Carrello](#carrello)
    4. [Ordini](#ordini)
    5. [Gestori](#gestori)
2. [Strutture del server Python](#server-python)
    1. [functions.py](#functions-py)
        - open_db_connection
        - close_db_connection
        - crypt
        - generate_token
        - bisestile
    2. [models.py](#models-py)
        - User
        - Gestore
        - Old_New_Gestore
        - Old_New_User
        - Login
        - User_token
        - User_id
        - Item
        - Old_New_Item
        - Cart_Item
        - Cart_Items
        - Order_Items
        - Order
    3. [server.py](#server-py)
        - Gestione utenti
        - Gestione prodotti
        - Gestione ordini
        - Gestione del carrello
        - Acquisto dei prodotti
        - Login e Logout
        - Home
        - Statistiche per i gestori

## 1. Struttura del Database "supermercato" <a name="database"></a>

### 1.1 Tabella Utenti <a name="utenti"></a>
La tabella utenti ha 12 campi:
- `id_utente` INT PRIMARY KEY AUTO_INCREMENT
- `nome` VARCHAR(32)
- `cognome` VARCHAR(32)
- `email` VARCHAR(64)
- `password` VARCHAR(128)
- `autenticato` VARCHAR(128)
- `genere` INT
- `cap` VARCHAR(10)
- `città` VARCHAR(64)
- `via` VARCHAR(64)
- `prefisso` VARCHAR(3)
- `numero` VARCHAR(10)

Questa tabella memorizza tutti gli utenti senza ruolo particolare (non admin o corrieri).

### 1.2 Tabella Prodotti <a name="prodotti"></a>
La tabella prodotti ha 6 campi:
- `id_prodotto` INT PRIMARY KEY AUTO_INCREMENT
- `nome` VARCHAR(64)
- `tipo` INT
- `costo` FLOAT
- `disponibilità` INT
- `creazione` DATE

Questa tabella memorizza tutti i prodotti disponibili nella piattaforma. Gli admin possono aggiungerli, modificarli ed eliminarli. Gli utenti possono aggiungerli al carrello ed acquistarli.

### 1.3 Tabella Carrello <a name="carrello"></a>
La tabella carrello ha 4 campi:
- `id_carrello` INT PRIMARY KEY AUTO_INCREMENT
- `id_utente` INT FOREIGN KEY REFERENCES utenti(`id_utente`)
- `id_prodotto` INT FOREIGN KEY REFERENCES prodotti(`id_prodotto`)
- `quantità_richiesta` INT

Questa tabella memorizza gli elementi del carrello di ogni utente.

### 1.4 Tabella Ordini <a name="ordini"></a>
La tabella ordini ha 7 campi:
- `id_ordine` INT PRIMARY KEY AUTO_INCREMENT
- `id_utente` INT FOREIGN KEY REFERENCES utenti(`id_utente`)
- `id_prodotto` INT FOREIGN KEY REFERENCES prodotti(`id_prodotto`)
- `quantità` INT
- `stato` INT
- `gruppo` INT
- `creazione` DATE

Questa tabella memorizza gli ordini effettuati dagli utenti. I corrieri possono visualizzare e modificare lo stato degli ordini. Gli stati della spedizione sono:
- In preparazione
- Spedito
- In transito
- In consegna
- Consegnato
- Mancata consegna
- Smarrito
- Spedizione annullata

### 1.5 Tabella Gestori <a name="gestori"></a>
La tabella gestori ha 7 campi:
- `id_gestore` INT PRIMARY KEY AUTO_INCREMENT
- `nome` VARCHAR(64)
- `cognome` VARCHAR(64)
- `email` VARCHAR(64)
- `password` VARCHAR(128)
- `autenticato` VARCHAR(128)
- `ruolo` VARCHAR(32)

Questa tabella memorizza i gestori, che possono essere:
- **Admin**:
  - Gestisce prodotti (aggiunta, modifica, eliminazione, visualizzazione)
  - Gestisce utenti (aggiunta e eliminazione di gestori, modifica dei dati del gestore)
  - Visualizza le transazioni degli utenti
- **Corriere**:
  - Aggiorna lo stato della spedizione

## 2. Strutture del server Python <a name="server-python"></a>

### 2.1 functions.py <a name="functions-py"></a>

#### 2.1.1 open_db_connection()
Apre la connessione con il server e restituisce una tupla contenente il cursore e la connessione.

#### 2.1.2 close_db_connection(connessione)
Esegue il commit dei cambiamenti nel db e chiude la connessione, utilizzando la variabile connessione passata per parametro.

#### 2.1.3 crypt(password)
Cripta le password da salvare nel database e restituisce una stringa di 128 caratteri. Utilizza la libreria "hashlib".

#### 2.1.4 generate_token()
Genera un token per la sessione, utilizzato sia per l'utente che per il gestore. Restituisce una stringa di 128 caratteri.

#### 2.1.5 bisestile()
Calcola se un anno è bisestile. Restituisce vero o falso. Utilizzato per costruire una query per un grafico nella pagina home del gestore.

### 2.2 models.py <a name="models-py"></a>

#### 2.2.1 Modello User
- `id_utente`: int | None
- `nome`: str
- `cognome`: str
- `email`: str
- `password`: str
- `autenticato`: str = "0"
- `genere`: int
- `cap`: str
- `città`: str
- `via`: str
- `prefisso`: str
- `numero`: str

Viene impiegato per la creazione ed eliminazione dell'utente.

#### 2.2.2 Modello Gestore
- `nome`: str
- `cognome`: str
- `email`: str
- `password`: str
- `ruolo`: str

Viene impiegato per la creazione ed eliminazione del gestore.

#### 2.2.3 Modello Old_New_Gestore
- `old`: Gestore
- `new`: Gestore

Viene impiegato per la modifica di un gestore.

#### 2.2.4 Modello Old_New_User
- `old`: User
- `new`: User

Viene impiegato per la modifica di un utente.

#### 2.2.5 Modello Login
- `email`: str
- `password`: str
- `role`: str

Viene impiegato per il login e logout dell'utente e del gestore. Il ruolo può essere: "Utente", "Admin" o "Corriere".

#### 2.2.6 Modello User_token
- `email`: str
- `password`: str
- `token`: str
- `role`: str

Viene impiegato per verificare che la sessione sia attiva. Se la sessione è scaduta, si è rediretti alla pagina di login.

#### 2.2.7 Modello User_id
- `id_utente`: int

Viene impiegato per la restituzione degli elementi nel carrello di un utente.

#### 2.2.8 Modello Item
- `id_prodotto`: int | None
- `nome`: str
- `tipo`: int
- `costo`: float
- `disponibilità`: int
- `creazione`: str | None

Viene impiegato per l'aggiunta e cancellazione di un prodotto.

#### 2.2.9 Modello Old_New_Item
- `old`: Item
- `new`: Item

Viene impiegato per la modifica di un prodotto.

#### 2.2.10 Modello Cart_Item
- `id_utente`: int
- `id_prodotto`: int
- `quantità`: int

Viene impiegato per l'aggiunta di un prodotto al carrello, la modifica di un prodotto nel carrello e la rimozione di un prodotto nel carrello.

#### 2.2.11 Modello Cart_Items
- `items`: List[Cart_Item]

Viene impiegato per l'acquisto dei prodotti nel carrello.

#### 2.2.12 Modello Order_Items
- `id_ordine`: int | None
- `id_utente`: int
- `id_prodotto`: int
- `quantità`: int
- `stato`: int
- `gruppo`: int

Viene impiegato per la modifica dello stato dell'ordine da parte del corriere.

#### 2.2.13 Modello Order
- `id_utente`: int
- `id_prodotto`: int
- `quantità`: int

Viene impiegato per restituire gli ordini di un utente.

### 2.3 server.py <a name="server-py"></a>

#### 2.3.1 Gestione utenti
#### Creazione dell'utente
`@app.post('/api/create_account', status_code=201) 
def create(utente: User): ...`  

#### Modifica dell'utente
`@app.put('/api/update_account',status_code=200)
def update(utente: Old_New_User):`

#### Eliminazione dell'utente
`@app.delete('/api
/delete_account'status_code=200)
def delete(utente: User):`

#### Restituzione dell'account per la modifica
`@app.post('/api/get_account')
def get(utente: User_token):`  

### 2.3.2 - Gestione prodotti
#### Aggiunta di un prodotto
`@app.post('/api/add_item', status_code=201)
def add(item: Item):`

#### Modifica di un prodotto
`@app.put('/api/update_item', status_code=200)
def update(item: Old_New_Item)`

#### Eliminazione di un prodotto
`@app.delete('/api/delete_item', status_code=200)
def delete(item: Item):`  
N.B: l'item viene cancellato logicamente, in quanto deve essere ancora visualizzabile in caso un utente lo abbia acquistato e un admin lo abbia eliminato

#### Restituzione dei prodotti
`@app.get('/api/get_items/{n}')
def get(n)`  
n indica il numero di item da restituire

#### Ricerca di un prodotto
`#Ricerca di un prodotto per nome
@app.get('/api/search_items/{nome}')
def search(nome)`

### 2.3.3 - Gestione carrello
#### Aggiunta di un prodotto al carrello
`@app.post('/api/add_cart', status_code=201)
def add(item: Cart_Item):`

#### Modifica della quantità di un prodotto nel carrello
`@app.put("/api/update_cart")
def update(item: Cart_Item):`

#### Eliminazione di un prodotto dal carrello
`@app.delete('/api/delete_cart', status_code=200)
def delete(item: Cart_Item):`

#### Restituzione degli elementi nel carrello di un utente
`@app.post('/api/get_cart')
def get(user_id: User_id):`

### 2.3.4 - Acquisto di prodotti
`@app.put('/api/buy_cart', status_code=200)
def buy(items: Cart_Items):`
Gli elementi salvati nel carrello sono raggruppati da un numero gestito dal server. Grazie a questo numero nella riga "gruppo" è possibile raggruppare gli ordini

### 2.3.5 - Gestione degli ordini
#### Modifica dello stato dell' ordine
`@app.put('/api/update_status')
def update(item: Order_Items | Order):`
Questa rotta viene chiamata sia dal corriere e sia dall'utente

#### Restituzione degli ordini per il corriere
`@app.post('/api/get_orders',status_code=200)
def get(corriere: User_token):`

#### Ricerca di un ordine
`@app.get('/api/search_orders/{id}',status_code=200)
def search(id: str):`

#### Restituzione degli ordini per l'utente
`@app.post('/api/get_orders_user',status_code=200)
def get(user: User_token):`

### 2.3.6 - Login e Logout
#### Log-in
`@app.post('/api/login', status_code=301)
def login(login: Login):`
Al login viene generato un token che definisce la sessione

#### Log-out
`@app.post('/api/logout', status_code=301)
def logout(login: Login):`
Il token viene eliminato e definisce una sessione scaduta

### 2.3.7 - Home
`@app.post('/api/home', status_code=200)
def home(token: User_token):`  
Questa rotta verifica il token. Se non è corretto o scaduto, l'utente viene reindirizzato alla pagina di login. Questa rotta viene chiamata quando l'utente o il gestore naviga in ogni pagina del sito

### 2.3.8 - Statistiche per i gestori
#### Rotte per il gestore
`@app.get('/api/get_data_admin')
def get():`
`@app.get('/api/get_data/{mese}')
def get(mese: int):`
`@app.get('/api/get_transazioni')
def get():`
`@app.get('/api/get_transazione/{id}')
def get(id):`

#### Rotte per il corriere
`@app.get('/api/get_data_courier')
def get():`