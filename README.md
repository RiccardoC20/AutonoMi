# AutonoMi
progetto ingegneria del software, UniTn 

## Database MongoDB

Il progetto utilizza MongoDB con Mongoose per la gestione del database.

### Struttura Database

Il database contiene due collezioni principali:

#### 1. Users (Utenti)
Collezione per gli utenti dell'applicazione con i seguenti campi:
- **Credenziali**: `username`, `email`, `password` (hashata con bcrypt)
- **Dati personali**: `nome`, `cognome`, `dataNascita`, `telefono`
- **Indirizzo**: `indirizzo.via`, `indirizzo.citta`, `indirizzo.cap`, `indirizzo.provincia`
- **Ruolo**: `ruolo` (utente/admin)
- **Stato**: `isActive`, `createdAt`, `updatedAt`

#### 2. Operators (Operatori Vettori)
Collezione per gli operatori dei vettori con i seguenti campi:
- **Credenziali**: `username`, `email`, `password` (hashata con bcrypt)
- **Dati personali**: `nome`, `cognome`, `telefono`
- **Dati lavorativi**: `codiceOperatore`, `vettore`, `tipoVettore`, `dataAssunzione`
- **Patente**: `patente.numero`, `patente.tipo`, `patente.scadenza`
- **Turno e autorizzazioni**: `turno`, `livelloAutorizzazione`
- **Stato**: `isActive`, `ultimoAccesso`, `createdAt`, `updatedAt`

### Installazione

1. Installa le dipendenze:
```bash
npm install
```

2. Configura le variabili d'ambiente:
   - Copia `env.example` in `.env`
   - Modifica `MONGODB_URI` con la tua stringa di connessione MongoDB

3. Assicurati che MongoDB sia in esecuzione

4. Avvia l'applicazione:
```bash
npm start
```

### Modelli

I modelli si trovano nella cartella `models/`:
- `User.js` - Schema per gli utenti
- `Operator.js` - Schema per gli operatori vettori

Entrambi i modelli includono:
- Validazione dei campi
- Hash automatico delle password prima del salvataggio
- Metodi per confrontare password (`comparePassword`)
- Metodi per aggiornare timestamp

### Esempio di Utilizzo

```javascript
const User = require('./models/User');
const Operator = require('./models/Operator');

// Creare un nuovo utente
const user = new User({
  username: 'mario_rossi',
  email: 'mario@example.com',
  password: 'password123',
  nome: 'Mario',
  cognome: 'Rossi',
  // ... altri campi
});
await user.save();

// Creare un nuovo operatore
const operator = new Operator({
  username: 'op_vettore1',
  email: 'operatore@vettore.it',
  password: 'operator123',
  codiceOperatore: 'OP001',
  vettore: 'Trentino Trasporti',
  // ... altri campi
});
await operator.save();
```