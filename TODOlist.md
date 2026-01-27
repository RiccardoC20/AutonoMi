FATTO:
- Richieste nuove con generazione km e controllo budget
- Corse nuove da accettazione richiesta con controllo budget e decurtazione budget
- Corse nuove da vettore con generazione km, controllo budget e decurtazione budget


COSE DA FARE NEL PROGETTO:

- rimuovere il plug in del CDN di bootstrap perché senza volerlo abbiamo installato le dipendenze di bootstrap e quindi il plug in con il link è inutile

- Capire a cosa serve la cartella pages (che nuxt con crea page fa in automatico oltre a quelle dentro app)

- Controllare di non aver tirato su le .env su github (perché mi arrivavano le mail di segnalazione)

- Nella documentazione definire come devono essere salvate e nominate le variabili d'ambiente

- Senza rendercene conto oltre a Nuxt e Vue ci siamo portati dietro anche Nitro. Va motivato nel D2 questa scelta.

- file .css che segna la palette dei colori di ogni attore

- sistemare email API (creare account di società)

- Creiamo il file con le OpenApi (è consigliato dai prof?)


___________________________
Cosa fare dopo il 19.
- comune login deve avere il suo colore FATTO
- il vettore per qualche motivo "Non ha i permessi per eliminare una corsa" FATTO
- eliminare pdf da supabase quando elimino  utente da comune FATTO
- la route vuota deve portarmi a login/utente FATTO
- Da valutare se creare un file .css per i tre colori principali FATTO
- in comune posso visualizzare gli utenti (e i vettori) ed eliminarli (anche file pdf) FATTO 
- fare il creaVettore da parte del comune nella sidebar e correggere il colore FATTO
- lista candidature deve avere la sidebar FATTO
- chiamata get di tutte le cors per il comune FATTO 
- mail automatica quando la richiesta viene rifiutata FATTO


- creare tutte le chiamate per far funzionare il FE 



- D2 iniziare seriamente a scriverlo
- Fare tutto il meccanismo delle corse con relativo branch 
- maps api

- vedere per i log
- vedere openApi

- togliere lo stampo di password hash e in chiaro ogni volta che ci si logga

- aggiornare il valore di ritorno delle chiamate api con un DataType specifico


- cambiare il date formate di invio candidature
- nella pagina vettore fa una get e prende le richieste di tutti i vettori non solo di se stesso
- in richieste di corsa di vettore se slidi la richiesta di candidatura overlappa la sidebar
- Blocchi informativi in ogni pagina che descrivono cosa stanno vedendo

- La pagina "richieste-in-sospeso" va tutta rifatta da capo 

1 - creare una vettore : get corse effettuate e corse prenotate
2 . creare un bottone lato vettore che porta una corsa da effettuata a prenotata
3 - creare una get corse prenotate ed effettuate lato utente

4** - rimane tutto il problema del chilometraggio residuo durante la prenotazione corsa / passaggio da richiesta corsa a prenotazione corsa.