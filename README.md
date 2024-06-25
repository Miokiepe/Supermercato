# Frontend

## Indice
1. **Struttura del sito**  
    1. [favicon e admin_favicon](#11---favicon-e-admin_favicon)
    2. [Components](#12---components)
        - admin_navbar.html e admin_nav_footer.css
        - courier_navbar.html
        - navbar.html, footer.html e nav_footer.css
        - data.js
    3. [Pages](#13---pages)
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
    4. [script](#14---script)
        - check_au e admin_check_au
    5. [Styles](#15---styles)
    6. [index.html](#16---indexhtml)
2. **Framework e librerie utilizzate**
    1. [Bootstrap](#21---bootstrap)
    2. [Fontawesome](#22---fontawesome)

### 1 - Struttura del sito

#### 1.1 - favicon e admin_favicon
Sono due cartelle che contengono le favicon. La prima è utilizzata dagli utenti classici, mentre la seconda da admin e corrieri.

#### 1.2 - Components
Contengono principalmente navbar e footer, caricate in ogni pagina tramite uno script.

##### 1.2.1 - admin_navbar.html e admin_nav_footer.css
Sono due file che contengono rispettivamente la navbar ed il suo foglio di stile per le pagine impiegate dall'admin.

##### 1.2.2 - courier_navbar.html
È la navbar impiegata dal corriere, utilizza lo stesso foglio di stile dell'admin.

##### 1.2.3 - navbar.html, footer.html e nav_footer.css
Il primo file è la navbar impiegata da utenti classici, il secondo file è il footer, che è lo stesso per tutte e 3 le tipologie di utenza. L'ultimo è un foglio di stile per gli utenti classici. I colori della navbar e del footer degli utenti sono differenti da quelli dei gestori (admin e corrieri), in quanto segnalano la diversità nei ruoli e nelle azioni che compiono.

##### 1.2.4 - data.js
Contiene una serie di costanti utilizzate nelle varie pagine: prefissi telefonici, stati delle spedizioni, tipologie di prodotti... Inoltre, contiene delle funzioni che mostrano messaggi di errore, spinner di caricamento...

### 1.3 - Pages
Questa cartella contiene tutti i file delle pagine del sito, comprese quelle degli admin e dei corrieri.

##### 1.3.1 - home.html
Questa è la pagina che vede l'utente dopo l'accesso. Qui può visualizzare i prodotti recenti ed i suoi ordini, anche filtrati per data.

##### 1.3.2 - prodotti.html
Questa pagina visualizza tutti i prodotti. È possibile anche cercarli, filtrarli per tipo, per prezzo ed aggiungerli al carrello.

##### 1.3.3 - profilo.html
Questa pagina permette di visualizzare il proprio profilo, modificarlo, cancellarlo ed eseguire il logout.

##### 1.3.4 - carrello.html
Questa pagina permette di acquistare i prodotti nel carrello. È possibile eliminare prodotti che non sono più desiderati e modificarne la quantità nel carrello.

##### 1.3.5 - courier.html
Questa è la pagina che vede il corriere dopo l'accesso. È presente un grafico a ciambella che rappresenta il numero di ordini per stato di spedizione.

##### 1.3.6 - ordini.html
Grazie a questa pagina, i corrieri possono modificare lo stato della spedizione. Possono anche cercare e filtrare gli ordini.

##### 1.3.7 - courier_profilo.html
Questa pagina permette di visualizzare il proprio profilo, modificarlo, cancellarlo ed eseguire il logout.

##### 1.3.8 - admin.html
Questa pagina mostra tre grafici: uno a ciambella che rappresenta le vendite di prodotti per tipo, uno a linea che rappresenta le vendite per ogni mese (È possibile scegliere un mese specifico da visualizzare nel grafico) ed un altro a ciambella che rappresenta il numero di utenza per tipo (utenti classici, admin e corrieri).

##### 1.3.9 - admin_prodotti.html
Questa pagina permette di inserire prodotti all'interno del db. L'admin può anche modificare, eliminare, cercare e filtrare gli item in base al prezzo ed al loro tipo. Quando un item viene eliminato, è ancora visualizzabile per i corrieri e per gli utenti che lo hanno acquistato.

##### 1.3.10 - admin_transazioni.html
Questa pagina permette di visualizzare tutte le transazioni eseguite dagli utenti. È possibile cercarle, filtrarle per tipo di prodotto acquistato, prezzo e data di acquisto.

##### 1.3.11 - utenti.html
Questa pagine permette l'aggiunta di un nuovo gestore (admin o corriere). Infatti i gestori possono essere creati solo da admin (il primo admin verrà salvato manualmente nel db). L'admin può anche modificare alcune informazioni degli utenti, ed eventualmente eliminarli dalla piattaforma.

##### 1.3.12 - admin_profilo.html
Questa pagina permette di visualizzare il proprio profilo, modificarlo, cancellarlo ed eseguire il logout.

##### 1.3.13 - registrati.html
Questa pagina permette di creare un utente classico, una volta compilato il form, sarà possibile accedere alla piattaforma.

### 1.4 - script
Questa cartella contiene tutti i file di script della piattaforma. Molti contengono la logica del sito, altri sono fondamentali per la verifica della sessione: `check_au.js` e `admin_check_au.js`.

##### 1.4.1 - check_au e admin_check_au
Questo script viene eseguito ogni volta che si accede ad una pagina. Viene eseguita una richiesta POST al server, inviando email, password criptata ed il token del server. Il server verifica le credenziali. Se sono errate, l'utente verrà rediretto alla pagina di login, se sono corrette, può continuare la navigazione.

### 1.5 - Styles
Questa cartella contiene tutti i fogli di stile della pagina. Non tutte le pagine hanno un proprio foglio di stile ed alcune pagine ne condividono lo stesso.

### 1.6 - index.html
Questa è la pagina di login. Tramite uno switch è possibile eseguire il login come utente classico o come gestore (admin o corriere).

### 2 - Framework e librerie utilizzate

#### 2.1 - Bootstrap
Il primo framework utilizzato è bootstrap. È stato impiegato in tutta la piattaforma.

#### 2.2 - Fontawesome
Questa libreria fornisce una vasta gamma di icone per aumentare la leggibilità e le informazioni visive della piattaforma.
