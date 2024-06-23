# Backend side
Indice  
1. Struttura del Database "supermercato"
    1. utenti
    2. prodotti
    3. carrello
    4. Ordini
    5. Gestori
2. Strutture del server python
    1. functions.py  
        - open_db_connection
        - close_db_connection
        - crypt
        - generate_token
        - bisestile
    2. models.py
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
        - Order_items
        - Order
    3. server.py   
        - Gestione utenti
        - Gestione prodotti
        - Gestione ordini
        - Gestione del carrello
        - Acquisto dei prodotti
        - Gestione degli ordini
        - Login e Logout
        - Home
        - Statistiche per i gestori

### 1.1 - Tabella utenti  
La tabella utenti ha 12 campi:  
- id_utente INT PRIMARY KEY AUTO_INCREMENT
- nome VARCHAR(32)
- cognome VARCHAR(32)
- email VARCHAR(64)
- password VARCHAR(128)
- autenticato VARCHAR(128)
- genere INT
- cap VARCHAR(10)
- città VARCHAR(64)
- via VARCHAR(64)
- prefisso VARCHAR(3)
- numero VARCHAR(10)

Questa tabella memorizza tutti gli utenti che non hanno nessun ruolo particolare (non admin o corrieri)

### 1.2 - Tabella prodotti  
La tabella ha 6 campi:  
- id_prodotto INT PRIMARY KEY AUTO_INCREMENT
- nome VARCHAR(64)
- tipo INT
- costo FLOAT
- disponibilità INT
- creazione DATE

Questa tabella memorizza tutti i prodotti disponibili nella piattaforma. Gli admin possono aggiungerli, modificarli ed eliminarli. Gli utenti possono aggiungerli al carrello ed acquistarli.

### 1.3 - Tabella carrello  
La tabella ha 4 campi:  
- id_carrello INT PRIMARY KEY AUTO_INCREMENT
- id_utente INT FOREGIN KEY REFERENCES TO utenti(id_utente)
- id_prodotto  INT FOREGIN KEY REFERENCES TO prodotti(id_prodotto)
- quantità_richiesta: INT

Questa tabella memorizza gli elementi del carrello di ogni utente.

### 1.4 - Tabella ordini
La tabella ha 7 campi:  
- id_ordine INT PRIMARY KEY AUTO_INCREMENT
- id_utente INT FOREIGN KEY REFERENCES TO utenti(id_utente)
- id_prodotto INT FOREIGN KEY REFERENCES TO prodotti(id_prodotto)
- quantità INT
- stato INT
- gruppo INT
- creazione DATE

Questa tabella memorizza gli ordini effettuati dagli utenti. Inoltre i corrieri possono visualizzare gli ordini di tutti gli utenti e modificare lo stato della spedizione.  
Ci sono 8 stati in cui la spedizione può trovarsi: 
- In preparazione: Il pacco è in preparazione per la spedizione
- Spedito: Il pacco è partito dallo stabilimento in cui si trovava.
- In transito: Il pacco è in transito nei vari centri di smistamento.
- In consegna
- Consegnato
- Mancata consegna
- Smarrito
- Spedizione annullata: annullata o dall'utente oppure dal corriere dopo 2 tentativi di consegna falliti

### 1.5 - Tabella gestori  
La tabella ha 7 campi:  
- id_gestore INT PRIMARY KEY AUTO_INCREMENT
- nome VARCHAR(64)
- cognome VARCHAR(64)
- email VARCHAR(64)
- password VARCHAR(128)
- autenticato VARCHAR(128)
- ruolo VARCHAR(32)

Questa tabella memorizza i gestori. Esistono attualmente due ruolo:
- Admin:  
  - Gestisce prodotti: aggiunta, modifica, eliminazione, visualizzazione
  - Gestisce utenti: eliminazione, aggiunta di gestori e modifica dei dati del gestore (la password può essere modificata solo dal proprio account, nessun altro gestore può farlo per altri)
  - Visualizza le transazioni degli utenti
- Corriere:
  - Aggiornamento della spedizione: può modificare lo stato della spedizione degli utenti

### 2.1.1 - open_db_connection()
Questa funzione apre la connessione con il server e restituisce una tupla contenente il cursore e la connessione.

### 2.1.2 - close_db_connection(connessione)
Questa funzione esegui il commit dei cambiamenti nel db e chiude la connessione, grazie alla variabile connessione passata per parametro

### 2.1.3 - crypt(password)
Questa funzione cripta le password da salvare nel database e restituisce la stringa di 128 caratteri. 
È stata utilizzata la libreria "hashlib"

### 2.1.4 - generate_token()
Questa funzione genera il token per la sessione. Viene impiegata sia per l'utente e sia per il gestore. Restituisce una stringa di 128 caratteri

### 2.1.5 - bisestile()
Questa funzione viene utilizzata per il calcolo dell'anno bisestile. Restituisce vero o falso. Viene impiegata per la costruzione della query per renderizzare un grafico all'interno della pagina home del gestore

### 2.2.1 - Modello User
Questo modello è composto da:   
- id_utente: int | None  
- nome: str  
- cognome: str  
- email: str  
- password: str  
- autenticato: str = "0"  
- genere: int  
- cap: str  
- città: str  
- via: str  
- prefisso: str  
- numero: str  

Viene impiegato per la creazione ed eliminazione dell'utente

### 2.2.2 - Modello Gestore
Questo modello è composto da: 
- nome: str
- cognome: str
- email: str
- password: str    
- ruolo: str

Viene impiegato per la creazione ed eliminazione del gestore

### 2.2.3 - Modello Old_New_Gestore
Questo modello è composto da
- old: Gestore
- new: Gestore

Viene impiegato per la modifica di un gestore

### 2.2.4 - Modello Old_New_User
Questo modello è composto da
- old: User
- new: User

Viene impiegato per la modifica di un utente

### 2.2.5 - Modello Login
Questo modello è composto da
- email: str
- password: str
- role: str

Viene impiegato per il login e logout dell'utente e del gestore. Il ruolo può essere: "Utente", "Admin" o "Corriere"

### 2.2.6 - Modello User_token
Questo modello è composto da
- email: str
- password: str
- token: str
- role: str

Viene utilizzato per verificare che la sessione sia attiva. Se la sessione è scaduta, si è rediretti alla pagina di login

### 2.2.7 - Modello User_id
Questo modello è composto da
- id_utente: int

Viene utilizzato per la restituzione degli elementi nel carrello di un utente

### 2.2.8 - Modello Item
Questo modello è composto da
- id_prodotto: int | None
- nome: str
- tipo: int
- costo: float
- disponibilità: int
- creazione: str | None

Viene utilizzato per l'aggiunta e cancellazione di un prodotto