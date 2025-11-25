# Guida all'Avvio del Server e Database

## 🔍 Cosa succede quando esegui `npm run dev`?

### 1. **MongoDB Cloud (MongoDB Atlas)**
   - ✅ Il database MongoDB è in cloud (MongoDB Atlas)
   - ✅ Non serve avviare MongoDB localmente
   - ✅ Solo il server Nuxt si avvia con `npm run dev`
   - ⚠️ **IMPORTANTE**: Devi configurare la connection string nel file `.env`
   - Il server Nuxt si connette a MongoDB cloud quando viene chiamata un'API route

### 2. **Script che determina cosa avviare**
   - Il comando `npm run dev` esegue lo script definito in `package.json`:
     ```json
     "dev": "nuxt dev"
     ```
   - Questo avvia **Nuxt 3** che internamente usa:
     - **Vite** come build tool e dev server
     - **Nitro** come server runtime per le API routes

### 3. **Porta del server**
   - **Porta predefinita**: `3000`
   - La porta è gestita da Nuxt/Vite
   - Se la porta 3000 è occupata, Nuxt usa automaticamente la porta successiva disponibile (3001, 3002, ecc.)
   - Puoi configurare la porta in `nuxt.config.ts`:
     ```ts
     export default defineNuxtConfig({
       devServer: {
         port: 3000  // Porta personalizzata
       }
     })
     ```

### 4. **MongoDB Cloud Connection**
   - Il database è su MongoDB Atlas (cloud)
   - La connection string usa il formato: `mongodb+srv://...`
   - Non serve configurare porte o avviare servizi locali
   - La connection string è configurata nel file `.env`

## 📋 Processo di Avvio Completo

### Passo 1: Configura la Connection String MongoDB
Crea un file `.env` nella root del progetto con:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autonomi?retryWrites=true&w=majority
```

**Come ottenere la connection string:**
1. Accedi a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Vai al tuo cluster
3. Clicca su **"Connect"**
4. Scegli **"Connect your application"**
5. Copia la connection string
6. Sostituisci `<password>` con la tua password reale
7. Sostituisci `<dbname>` con `autonomi`

### Passo 2: Avvia il server Nuxt
```bash
npm run dev
```

### Cosa succede:
1. ✅ Nuxt avvia Vite dev server
2. ✅ Compila i file Vue/TypeScript
3. ✅ Avvia Nitro server per le API routes
4. ✅ Server disponibile su `http://localhost:3000`
5. ⚠️ MongoDB cloud si connette solo quando viene chiamata un'API route (lazy connection)

## 🔧 Interrogare il Database dalla Console

### Opzione 1: Script Node.js (Raccomandato)
Ho creato uno script per interrogare il database:

```bash
npm run db:query
```

Questo script:
- Si connette al database MongoDB
- Mostra statistiche e dati
- Puoi modificare `scripts/db-query.js` per personalizzare le query

### Opzione 2: MongoDB Compass (GUI)
- Scarica MongoDB Compass: https://www.mongodb.com/products/compass
- Usa la stessa connection string del file `.env`
- Connettiti al cluster MongoDB Atlas
- Naviga nel database `autonomi` e nella collezione `words`

### Opzione 3: MongoDB Atlas Web Interface
- Accedi a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Vai al tuo cluster
- Clicca su **"Browse Collections"**
- Naviga nel database `autonomi` e nella collezione `words`

## 🚨 Troubleshooting

### Errore: "MongoDB connection failed" o "MONGODB_URI non è definita"
- ✅ Verifica che il file `.env` esista nella root del progetto
- ✅ Controlla che `MONGODB_URI` sia correttamente definita nel file `.env`
- ✅ Verifica che la connection string sia completa e valida
- ✅ Assicurati che username e password siano corretti (senza caratteri speciali non codificati)
- ✅ Controlla che il tuo IP sia nella whitelist di MongoDB Atlas (Network Access)

### Errore: "Authentication failed"
- ✅ Verifica username e password nella connection string
- ✅ Controlla che l'utente MongoDB abbia i permessi corretti
- ✅ Assicurati che la password non contenga caratteri speciali non codificati (usa % encoding)

### Errore: "IP not whitelisted"
- ✅ Vai su MongoDB Atlas → Network Access
- ✅ Aggiungi il tuo IP corrente (o usa `0.0.0.0/0` per permettere tutti gli IP - solo per sviluppo!)

### Errore: "Port 3000 already in use"
- ✅ Chiudi altri processi sulla porta 3000
- ✅ Oppure cambia porta in `nuxt.config.ts`

## 📝 Note Importanti

1. **Il file `.env` è OBBLIGATORIO** - senza di esso l'applicazione non funziona
2. La connessione al database avviene **lazy** (solo quando serve)
3. Il server Nuxt si avvia su porta **3000** (o successiva se occupata)
4. Il database è su **MongoDB Atlas (cloud)** - non serve installare MongoDB localmente
5. **NON committare il file `.env`** nel repository (è già nel `.gitignore`)

