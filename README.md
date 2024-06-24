# Frontend
Indice: 
1. Struttura del sito  
    1. favicon e admin_favicon
    2. Components
        - admin_navbar.html e admin_nav_footer.css
        - courier_navbar.html
        - navbar.html, footer.html e nav_footer.css
        - data.js
    3. Pages
        - home.html
        - prodotti.html
        - profilo.html
        - carrello.html
        - courier.html
        - ordini.html
        - courier_profilo.html
        - admin.html
        - admin_prodotti.html
        - admin_transazioni.html
        - utenti.html
        - admin_profilo.html
        - registrati.html
    4. script
    5. Styles
    6. index.html
2. Framework e librerie utilizzate
    1. Bootstrap
    2. Fontawesome

### 1 - Struttura del sito
#### 1.1 - favicon e admin_favicon
Sono due cartelle che contengono le favicon.La prima è utilizzata dagli utenti classici, mentre la seconda da admin e corrieri

#### 1.2 - Components
Contengono principalmente navbar e footer, caricate in ogni pagina tramite uno script
##### 1.2.1 - admin_navbar.html e admin_nav_footer.css
Sono due file che contengono rispettivamente la navbar ed il suo foglio di stile per le pagine impiegate dall'admin.
##### 1.2.2 - courier_navbar.html
È la navbar impiegata dal corriere, utilizza lo stesso foglio di stile dell'admin
##### 1.2.3 - navbar.html, footer.html e nav_footer.css
Il primo file è la navbar impiegata da utenti classici, il secondo file è il footer, che è lo stesso per tutte e 3 le tipologie di utenza. L'ultimo è un foglio di stile per gli utenti classici
##### 1.2.4 - data.js
Contiene una serie di costanti utilizzate nelle varie pagine: prefissi telefonici, stati delle spedizioni, tipologie di prodotti...
Inoltre, contiene delle funzioni che mostrano messaggi di errore, spinner di caricamento...

#### 1.3 -  Pages
Questa cartella contiene tutti i file delle pagine del sito, comprese quelle degli admin e dei corrieri
##### 1.3.1 home.html
Questa è la pagina che vede l'utente dopo l'accesso. Qui può visualizzare i prodotti recenti ed i suoi ordini, anche filtrati per data 
##### 1.3.2 - prodotti.html
Questa pagina visualizza tutti i prodotti. È possibile anche cercarli, filtrarli per tipo, per prezzo ed aggiungerli al carrello
##### 1.3.3 - profilo.html
Questa pagina permette di visualizzare il proprio profilo, modificarlo, cancellarlo ed eseguire il logout
##### 1.3.4 - carrello.html
Questa pagina permette di acquistare i prodotti nel carrello. È possibile eliminare prodotti che non sono più desiderati e modificarne la quantità nel carrello.
##### 1.3.5 - courier.html
Questa è la pagina che vede il corriere dopo l'accesso. È presente un grafico a ciambella che rappresenta il numero di ordini per stato di spedizione
##### 1.3.6 - ordini.html
Grazie a questa pagina, i corrieri possono modificare lo stato della spedizione. Possono anche cercare e filtrare gli ordini
##### 1.3.7 - courier_profilo.html
Questa pagina permette di visualizzare il proprio profilo, modificarlo, cancellarlo ed eseguire il logout