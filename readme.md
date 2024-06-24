# Backend

## Indice
1. [Struttura del Database "supermercato"](#1-struttura-del-database-supermercato)
    1. [Utenti](#11-tabella-utenti)
    2. [Prodotti](#12-tabella-prodotti)
    3. [Carrello](#13-tabella-carrello)
    4. [Ordini](#14-tabella-ordini)
    5. [Gestori](#15-tabella-gestori)
2. [Strutture del server Python](#2-strutture-del-server-python)
    1. [functions.py](#21-functionspy)
        - open_db_connection
        - close_db_connection
        - crypt
        - generate_token
        - bisestile
    2. [models.py](#22-modelspy)
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
    3. [server.py](#23-serverpy)
        - Gestione utenti
        - Gestione prodotti
        - Gestione ordini
        - Gestione del carrello
        - Acquisto dei prodotti
        - Login e Logout
        - Home
        - Statistiche per i gestori

## 1. Struttura del Database "supermercato"

### 1.1 Tabella Utenti
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

### 1.2 Tabella Prodotti
La tabella prodotti ha 6 campi:
- `id_prodotto` INT PRIMARY KEY AUTO_INCREMENT
- `nome` VARCHAR(64)
- `tipo` INT
- `costo` FLOAT
- `disponibilità` INT
- `creazione` DATE

Questa tabella memorizza tutti i prodotti disponibili nella piattaforma. Gli admin possono aggiungerli, modificarli ed eliminarli. Gli utenti possono aggiungerli al carrello ed acquistarli.

### 1.3 Tabella Carrello
La tabella carrello ha 4 campi:
- `id_carrello` INT PRIMARY KEY AUTO_INCREMENT
- `id_utente` INT FOREIGN KEY REFERENCES utenti(`id_utente`)
- `id_prodotto` INT FOREIGN KEY REFERENCES prodotti(`id_prodotto`)
- `quantità_richiesta` INT

Questa tabella memorizza gli elementi del carrello di ogni utente.

### 1.4 Tabella Ordini
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

### 1.5 Tabella Gestori
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

## 2. Strutture del server Python

### 2.1 functions.py

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

### 2.2 models.py

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

### 2.3 server.py

#### 2.3.1 Gestione utenti
1. **Aggiunta utente:**
   - Percorso: `/user`
   - Metodo: `POST`
   - Modello: `User`

2. **Modifica utente:**
   - Percorso: `/update_user`
   - Metodo: `PUT`
   - Modello: `Old_New_User`

3. **Eliminazione utente:**
   - Percorso: `/delete_user`
   - Metodo: `DELETE`
   - Modello: `User`

#### 2.3.2 Gestione prodotti
1. **Aggiunta prodotto:**
   - Percorso: `/item`
   - Metodo: `POST`
   - Modello: `Item`

2. **Modifica prodotto:**
   - Percorso: `/update_item`
   - Metodo: `PUT`
   - Modello: `Old_New_Item`

3. **Eliminazione prodotto:**
   - Percorso: `/delete_item`
   - Metodo: `DELETE`
   - Modello: `Item`

#### 2.3.3 Gestione ordini
1. **Visualizzazione ordini utente:**
   - Percorso: `/orders`
   - Metodo: `POST`
   - Modello: `User_id`

2. **Modifica stato ordine:**
   - Percorso: `/update_order_status`
   - Metodo: `PUT`
   - Modello: `Order_Items`

#### 2.3.4 Gestione del carrello
1. **Visualizzazione carrello:**
   - Percorso: `/cart`
   - Metodo: `POST`
   - Modello: `User_id`

2. **Aggiunta prodotto al carrello:**
   - Percorso: `/cart`
   - Metodo: `POST`
   - Modello: `Cart_Item`

3. **Modifica prodotto nel carrello:**
   - Percorso: `/update_cart`
   - Metodo: `PUT`
   - Modello: `Cart_Item`

4. **Rimozione prodotto dal carrello:**
   - Percorso: `/delete_cart`
   - Metodo: `DELETE`
   - Modello: `Cart_Item`

#### 2.3.5 Acquisto dei prodotti
1. **Acquisto prodotti nel carrello:**
   - Percorso: `/buy`
   - Metodo: `POST`
   - Modello: `Cart_Items`

#### 2.3.6 Login e Logout
1. **Login utente o gestore:**
   - Percorso: `/login`
   - Metodo: `POST`
   - Modello: `Login`

2. **Logout utente o gestore:**
   - Percorso: `/logout`
   - Metodo: `POST`
   - Modello: `User_token`

#### 2.3.7 Home
1. **Visualizzazione home:**
   - Percorso: `/home`
   - Metodo: `POST`
   - Modello: `User_token`

#### 2.3.8 Statistiche per i gestori
1. **Visualizzazione statistiche:**
   - Percorso: `/stats`
   - Metodo: `POST`
   - Modello: `User_token`
