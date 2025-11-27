# 📍 Dove vengono salvate le parole nel Database Atlas

## 🗄️ Database e Collezione

Le parole che aggiungi dall'app vengono salvate in:

- **Database**: `autonomi` (definito nella connection string)
- **Collezione**: `words` (derivata dal modello Mongoose)

### Esempio di documento salvato:
```json
{
  "_id": ObjectId("..."),
  "text": "esempio",
  "createdAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

## 🔍 Parte del codice che definisce questo comportamento

### 1. **Nome del Database** - `server/utils/database.js`
```javascript
// La connection string contiene il nome del database
// mongodb+srv://...@cluster.mongodb.net/autonomi?...
//                                                      ^^^^^^^^
//                                                      Nome database
const mongoURI = process.env.MONGODB_URI;
// Esempio: mongodb+srv://admin:root@clusterautonomi.zgs1gz5.mongodb.net/autonomi?...
```

### 2. **Nome della Collezione** - `server/models/Word.js`
```javascript
// Mongoose crea automaticamente la collezione "words" (plurale di "Word")
export default mongoose.models.Word || mongoose.model('Word', wordSchema);
//                                                                  ^^^^
//                                                          Nome modello → collezione "words"
```

**Come funziona:**
- Mongoose prende il nome del modello: `Word`
- Lo converte in minuscolo: `word`
- Lo mette al plurale: `words`
- Crea la collezione `words` nel database

### 3. **Salvataggio delle parole** - `server/api/words/index.post.js`
```javascript
// Linea 22-23: Crea e salva la parola
const word = new Word({ text: text.trim() });
await word.save();  // ← Qui viene salvata nel database
```

**Flusso completo:**
1. L'utente inserisce una parola nel form (`pages/index.vue`)
2. Il form invia una richiesta POST a `/api/words`
3. L'API route (`server/api/words/index.post.js`) riceve la richiesta
4. Crea un nuovo documento Word con il testo
5. Salva nel database `autonomi`, collezione `words`

## 👀 Come vedere le parole in MongoDB Compass

### Passo 1: Apri MongoDB Compass
1. Scarica e installa [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Avvia MongoDB Compass

### Passo 2: Connettiti al cluster
1. Nella schermata iniziale, incolla la connection string dal file `.env`:
   ```
   mongodb+srv://admin:root@clusterautonomi.zgs1gz5.mongodb.net/autonomi?retryWrites=true&w=majority
   ```
2. Clicca **"Connect"**

### Passo 3: Naviga nel database
1. Nel pannello sinistro, espandi il cluster
2. Trova e clicca sul database **`autonomi`**
3. Clicca sulla collezione **`words`**

### Passo 4: Visualizza i documenti
Nella collezione `words` vedrai tutti i documenti salvati, ad esempio:
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "text": "ciao",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Funzionalità utili in Compass:
- **Browse Documents**: Vedi tutti i documenti
- **Schema**: Vedi la struttura dei documenti
- **Indexes**: Vedi gli indici della collezione
- **Validation**: Regole di validazione (se configurate)

## 🔄 Verifica rapida dalla console

Puoi anche verificare le parole salvate usando lo script:
```bash
npm run db:query
```

Questo mostrerà:
- Totale parole nel database
- Ultime 5 parole inserite
- Statistiche

