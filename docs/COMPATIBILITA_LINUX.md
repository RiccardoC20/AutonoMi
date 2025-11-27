# 🐧 Compatibilità Linux

## ✅ Il progetto è completamente compatibile con Linux

Tutto il codice è **cross-platform** e funziona identicamente su Windows, Linux e macOS.

## 🔍 Verifica della compatibilità

### 1. **Codice sorgente**
- ✅ Nessun percorso hardcoded Windows-specific
- ✅ Nessun comando shell specifico per Windows
- ✅ Usa solo Node.js standard e librerie cross-platform
- ✅ Tutti i percorsi usano `/` (compatibile con tutti i sistemi)

### 2. **Dipendenze**
Tutte le dipendenze sono cross-platform:
- ✅ `nuxt` - Framework cross-platform
- ✅ `mongoose` - Driver MongoDB cross-platform
- ✅ `dotenv` - Gestione variabili d'ambiente cross-platform

### 3. **Scripts npm**
Tutti gli script in `package.json` usano comandi standard:
```json
{
  "scripts": {
    "dev": "nuxt dev",           // ✅ Cross-platform
    "build": "nuxt build",        // ✅ Cross-platform
    "db:query": "node scripts/db-query.js"  // ✅ Cross-platform
  }
}
```

### 4. **File di configurazione**
- ✅ `.env` - Formato standard, funziona ovunque
- ✅ `nuxt.config.ts` - Configurazione cross-platform
- ✅ `.gitignore` - Formato standard Git

## 🚀 Come usare su Linux

### Installazione dipendenze
```bash
npm install
```

### Configurazione
1. Crea il file `.env` (stesso contenuto di Windows):
   ```bash
   nano .env
   # oppure
   vim .env
   ```
2. Aggiungi la connection string:
   ```env
   MONGODB_URI=mongodb+srv://admin:root@clusterautonomi.zgs1gz5.mongodb.net/autonomi?retryWrites=true&w=majority
   ```

### Avvio
```bash
npm run dev
```

### Test database
```bash
npm run db:query
```

## 🔧 Differenze minime (solo per comandi manuali)

### Comandi terminale
Se usi comandi manuali nel terminale, ci sono piccole differenze:

| Windows | Linux/macOS |
|---------|-------------|
| `type file.txt` | `cat file.txt` |
| `dir` | `ls` |
| `cd \` | `cd /` |

**Ma questi NON sono necessari** - tutti gli script npm funzionano identicamente!

## ✅ Verifica funzionamento

Dopo aver clonato il progetto su Linux:

1. **Installa dipendenze:**
   ```bash
   npm install
   ```

2. **Configura `.env`:**
   ```bash
   cp env.example .env
   nano .env  # Modifica con la tua connection string
   ```

3. **Testa la connessione:**
   ```bash
   npm run db:query
   ```

4. **Avvia il server:**
   ```bash
   npm run dev
   ```

5. **Apri nel browser:**
   ```
   http://localhost:3000
   ```

## 📝 Note importanti

1. **Nessuna modifica necessaria** - Il codice funziona identicamente su Linux
2. **Stessa connection string** - MongoDB Atlas è cloud, funziona da qualsiasi OS
3. **Stessi comandi npm** - Tutti gli script funzionano allo stesso modo
4. **Stesso file `.env`** - Formato identico su tutti i sistemi

## 🎯 Conclusione

**Non serve cambiare nulla!** Il progetto è già completamente compatibile con Linux. Basta:
- Clonare il repository
- Installare le dipendenze (`npm install`)
- Configurare il file `.env`
- Avviare con `npm run dev`

Tutto funzionerà esattamente come su Windows! 🚀

