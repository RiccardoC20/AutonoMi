# 🔧 Configurazione MongoDB Cloud

## 📋 Cosa mi serve per connetterti al database MongoDB Cloud?

Per far funzionare l'applicazione con MongoDB Atlas (cloud), ho bisogno di:

### 1. **Connection String MongoDB Atlas**

La connection string ha questo formato:
```
mongodb+srv://username:password@cluster.mongodb.net/autonomi?retryWrites=true&w=majority
```

### 2. **Come ottenere la Connection String**

#### Opzione A: Da MongoDB Atlas Dashboard
1. Accedi a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Seleziona il tuo progetto/cluster
3. Clicca sul pulsante **"Connect"**
4. Scegli **"Connect your application"**
5. Seleziona il driver: **Node.js** e la versione più recente
6. Copia la connection string che appare
7. Sostituisci `<password>` con la tua password reale
8. Sostituisci `<dbname>` con `autonomi` (o il nome del database che preferisci)

#### Opzione B: Costruisci manualmente
Se hai già i dati del cluster, la connection string è:
```
mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER_HOST]/[DATABASE_NAME]?retryWrites=true&w=majority
```

Dove:
- `[USERNAME]` = il tuo username MongoDB
- `[PASSWORD]` = la tua password MongoDB (codifica caratteri speciali con % encoding)
- `[CLUSTER_HOST]` = l'host del cluster (es. `cluster0.abc123.mongodb.net`)
- `[DATABASE_NAME]` = nome del database (es. `autonomi`)

### 3. **Cosa fare con la Connection String**

Una volta che hai la connection string completa, crea un file `.env` nella root del progetto:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autonomi?retryWrites=true&w=majority
```

**Esempio reale:**
```env
MONGODB_URI=mongodb+srv://mioUser:mioPassword123@cluster0.abc123.mongodb.net/autonomi?retryWrites=true&w=majority
```

### 4. **Configurazioni aggiuntive necessarie**

#### Network Access (Whitelist IP)
1. Vai su MongoDB Atlas → **Network Access**
2. Clicca **"Add IP Address"**
3. Per sviluppo locale, puoi aggiungere:
   - Il tuo IP corrente
   - Oppure `0.0.0.0/0` per permettere tutti gli IP (⚠️ solo per sviluppo!)
4. Clicca **"Confirm"**

#### Database User
1. Vai su MongoDB Atlas → **Database Access**
2. Assicurati di avere un utente con permessi di lettura/scrittura
3. Se non hai un utente, creane uno:
   - Clicca **"Add New Database User"**
   - Scegli username e password
   - Assegna il ruolo: **"Atlas admin"** o **"Read and write to any database"**

### 5. **Verifica della connessione**

Dopo aver configurato il file `.env`, puoi testare la connessione:

```bash
npm run db:query
```

Se la connessione funziona, vedrai:
```
✅ MongoDB Connected
📊 Totale parole nel database: X
...
```

## ⚠️ Note Importanti

1. **NON condividere mai** la connection string pubblicamente
2. Il file `.env` è già nel `.gitignore` e non verrà committato
3. Se la password contiene caratteri speciali, devono essere codificati:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
   - ecc.
4. La connection string deve essere su una singola riga, senza spazi

## 🚨 Problemi Comuni

### "Authentication failed"
- Verifica username e password
- Controlla che l'utente esista in Database Access
- Codifica i caratteri speciali nella password

### "IP not whitelisted"
- Aggiungi il tuo IP in Network Access
- Per sviluppo, puoi usare `0.0.0.0/0` (tutti gli IP)

### "Connection timeout"
- Verifica che il cluster sia attivo su MongoDB Atlas
- Controlla la connection string per errori di battitura
- Verifica la connessione internet

