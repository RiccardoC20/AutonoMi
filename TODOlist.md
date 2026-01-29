FATTO:
- Richieste nuove con generazione km e controllo budget 
- Corse nuove da accettazione richiesta con controllo budget e decurtazione budget
- Corse nuove da vettore con generazione km, controllo budget e decurtazione budget
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

- rimuovere il plug in del CDN di bootstrap perché senza volerlo abbiamo installato le dipendenze di bootstrap e quindi il plug in con il link è inutile FATTO
- Controllare di non aver tirato su le .env su github (perché mi arrivavano le mail di segnalazione) FATTO
- Senza rendercene conto oltre a Nuxt e Vue ci siamo portati dietro anche Nitro. Va motivato nel D2 questa scelta. FATTO
- D2 iniziare seriamente a scriverlo FATTO
- Fare tutto il meccanismo delle corse con relativo branch FATTO
- cambiare il date formate di invio candidature FATTO
- nella pagina vettore fa una get e prende le richieste di tutti i vettori non solo di se stesso FATTO
- vedere openApi FATTO
- in richieste di corsa di vettore se slidi la richiesta di candidatura overlappa la sidebar FATTO

1 - creare una vettore : get corse effettuate e corse prenotate FATTO
2 . creare un bottone lato vettore che porta una corsa da effettuata a prenotata FATTO
3 - creare una get corse prenotate ed effettuate lato utente FATTO
4** - rimane tutto il problema del chilometraggio residuo durante la prenotazione corsa / passaggio da richiesta corsa a prenotazione corsa. FATTO
_______________________________________________
COSE DA FARE NEL PROGETTO:

- vedere per i log
- Capire a cosa serve la cartella pages (che nuxt con crea page fa in automatico oltre a quelle dentro app)
- maps api 
- Nella documentazione definire come devono essere salvate e nominate le variabili d'ambiente
- togliere lo stampo di password hash e in chiaro ogni volta che ci si logga 
- controllare tutte le pagine e vedere se ci sono funzioni extra
- info 
- rinnovo abbonamento? 

- STAMPA ANCORA LE PASSWORD in CHIARO
- aggiornare il valore di ritorno delle chiamate api con un DataType specifico 
- in Richieste corse la variabile usata è "corse" da cambiare

- Blocchi informativi in ogni pagina che descrivono cosa stanno vedendo ù

- La pagina "richieste-in-sospeso" va tutta rifatta da capo 
- API per rendere una corsa effettuata  
- io personalmente togliere il riquadro nero di corsa effettuata

1 - creare una vettore : get corse effettuate e corse prenotate
2 . creare un bottone lato vettore che porta una corsa da effettuata a prenotata
3 - creare una get corse prenotate ed effettuate lato utente

4** - rimane tutto il problema del chilometraggio residuo durante la prenotazione corsa / passaggio da richiesta corsa a prenotazione corsa.



API mancanti
richieste-corsa/get.js
corse/delete.js
corse/vettore/update.patch.js
vettore/me.get.js


sistemare i colori
