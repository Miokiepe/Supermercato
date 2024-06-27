![](./frontend/favicon/android-chrome-512x512.png "")   
# WebSpin

Benvenuto nella documentazione della piattaforma WebSpin.

## Indice
1. [Chi siamo](#1---chi-siamo)
2. [Guida della piattaforma](#2---guida-della-piattaforma)
    1. [Log-in](#21---log-in)
    2. [Registrazione](#22---registrazione)
    3. [Navigazione utente](#23---navigazione-utente)
        1. [Home](#231---home)
        2. [Prodotti](#232---prodotti)
        3. [Profilo](#233---profilo)
        4. [Carrello](#234---carrello)
    4. [Navigazione corriere](#24---navigazione-corriere)
        1. [Home](#241---home)
        2. [Gestione ordini](#242---gestione-ordini)
        3. [Profilo](#243---profilo)
    5. [Navigazione admin](#25---navigazione-admin)
        1. [Home](#251---home)
        2. [Gestione prodotti](#252---gestione-prodotti)
        3. [Transazioni](#253---transazioni)
        4. [Gestione utenti](#254---gestione-utenti)
        5. [Profilo](#255---profilo)
3. [Conclusioni](#3---conclusioni)

### 1 - Chi siamo

Siamo un piccolo supermercato nella Puglia che ha deciso di espandere i suoi orizzonti nel mondo del web.  
Vendiamo un vasto tipo di prodotti: arredamento, alimentari, abbigliamento, elettronica e sport.

### 2 - Guida della piattaforma

#### 2.1 - Log-in

Questa è la pagina di login. Grazie ad essa puoi accedere alla piattaforma. Se lo switch è disabilitato accederai come utente, se è attivo accederai come gestore. Se scegli la seconda opzione devi selezionare anche il ruolo: admin o corriere.

**Nota**: Per accedere alla piattaforma è necessario che l'account esista.

#### 2.2 - Registrazione

In caso tu non abbia un account, grazie a questa pagina è possibile creare un profilo utente classico. Gli account gestori possono essere creati solo da altri gestori. Il primo account gestore è stato salvato manualmente sul db. Una volta creato l'account utente, accedi alla piattaforma.

#### 2.3 - Navigazione utente

##### 2.3.1 - Home

Una volta eseguito l'accesso vedrai una pagina di questo tipo. È possibile esplorare i prodotti recenti, selezionare la quantità ed aggiungerli al carrello. Più in basso potrai visualizzare tutti gli ordini che hai effettuato ed il loro stato di spedizione. Puoi anche filtrare gli ordini in base al loro stato o al periodo in cui sono stati effettuati.

##### 2.3.2 - Prodotti

Questa pagina visualizza tutti i prodotti disponibili sulla piattaforma. Seleziona la quantità ed aggiungili al carrello. Se cerci un prodotto specifico puoi cercarlo, oppure selezionare quelli di una determinata categoria tramite i filtri presenti.

##### 2.3.3 - Profilo

Questa pagina visualizza tutte le informazioni relative al profilo. Puoi modificarlo o cancellarlo, ma ricorda che questa azione è permanente. Infine, puoi anche eseguire il logout.

##### 2.3.4 - Carrello

Questa è la pagina che mostra tutti i prodotti nel carrello. Da qui puoi aggiornare la quantità dei prodotti oppure eliminarli se non sono più di tuo gradimento. Clicca sul pulsante "Acquista" per acquistare tutti i prodotti nel carrello. Una volta tornati alla home visualizzerai il tuo ordine.

#### 2.4 - Navigazione corriere

##### 2.4.1 - Home

Questa pagina fornisce un utile grafico a ciambella che ti permette di visualizzare il numero di ordini in base al loro stato di spedizione.

##### 2.4.2 - Gestione ordini

Questa pagina ti permette di aggiornare lo stato degli ordini. Clicca sull'icona del pacco che apparirà quando passi il cursore su un prodotto, e modifica il suo stato. Ci sono 8 stati in cui il pacco può trovarsi:
- In preparazione
- Spedito
- In transito
- In consegna
- Consegnato
- Mancata consegna
- Smarrito
- Annullato: ordine annullato dal corriere dopo 2 tentativi fallimentari o dall'utente. In questo caso l'utente sarà rimborsato.

Dato che il numero di ordini tenderà sempre ad aumentare, puoi cercarli direttamente tramite il loro ID e filtrarli in base alle tue esigenze.

##### 2.4.3 - Profilo

Questa pagina visualizza le informazioni relative al tuo profilo. Puoi modificarle. Inoltre puoi eseguire l'eliminazione permanente dell'account o eseguire il logout.

#### 2.5 - Navigazione admin

##### 2.5.1 - Home

Questa pagina mostra una serie di grafici che permettono di farti capire l'andatura delle tue vendite. Puoi anche cliccare sul primo grafico a destra per visualizzare le vendite di un mese specifico.

##### 2.5.2 - Gestione prodotti

Da questa pagina puoi visualizzare tutti i prodotti della piattaforma. Aggiornali modificandone il nome, la categoria, il costo o la quantità. Puoi anche decidere di eliminare un prodotto, ma ricorda che gli utenti che lo hanno ordinato ed i corrieri potranno ancora visualizzarli.

##### 2.5.3 - Transazioni

Questa pagina mostra tutte le transazioni degli utenti che hanno acquistato prodotti. Puoi filtrarle e cercarle a tuo piacimento.

##### 2.5.4 - Gestione utenti

Questa pagina mostra tutti gli utenti della piattaforma. Clicca sul '+' per aggiungere un nuovo gestore.  
Puoi anche modificare od eliminare account esistenti di gestori. Infine, puoi anche eliminare gli utenti classici se violano le politiche della piattaforma.

##### 2.5.5 - Profilo

Questa pagina visualizza le informazioni relative al tuo profilo. Puoi modificarle. Inoltre puoi eseguire l'eliminazione permanente dell'account o eseguire il logout.

### 3 - Conclusioni

Questa è la fine della documentazione. Speriamo che la lettura di essa ti abbia fatto venire voglia di registrarti alla piattaforma ed iniziare ad usarla subito, compiendo il tuo primo ordine.

**Sito interamente realizzato da Mazzola Francesco come progetto finale del corso NextGeneration**
