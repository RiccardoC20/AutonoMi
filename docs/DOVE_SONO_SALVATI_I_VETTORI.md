# 📍 Dove vengono salvati i vettori nel database

## 🗄️ Posizione nel Database

I vettori vengono salvati in:
- **Database**: `autonomi` (definito nella connection string `MONGODB_URI`)
- **Collezione**: `vettori` (derivata automaticamente dal modello `Vettore`)

## 🔍 Cosa definisce la zona di salvataggio

### 1. **Nome del Database** - `server/utils/mongo.js` (riga 6)

Il database è definito nella connection string nel file `.env`:

```env
MONGODB_URI=mongodb+srv://admin:root@clusterautonomi.zgs1gz5.mongodb.net/autonomi?retryWrites=true&w=majority
                                                                        ^^^^^^^^
                                                                        Nome database
```

**Come funziona:**
- La connection string contiene il nome del database dopo l'host e prima dei parametri
- In questo caso: `autonomi`

### 2. **Nome della Collezione** - `server/models/vettore.model.js` (riga 12)

```javascript
mongoose.model("Vettore", VettoreSchema);
//              ^^^^^^^^
//              Nome modello
```

**Come funziona:**
- Mongoose prende il nome del modello: `"Vettore"`
- Lo converte in minuscolo: `"vettore"`
- Lo mette al plurale: `"vettori"`
- Crea la collezione `vettori` nel database

### 3. **Salvataggio** - `server/api/vettore.post.js` (riga 19)

```javascript
const vettore = await Vettore.create({ ... });
//                              ^^^^^^
//                              Salva in autonomi.vettori
```

## 👀 Come vedere i vettori salvati

### Opzione 1: MongoDB Compass

1. Apri MongoDB Compass
2. Connettiti usando la stessa connection string del file `.env`
3. Naviga: **Cluster** → **Database `autonomi`** → **Collezione `vettori`**
4. Vedi tutti i documenti salvati

### Opzione 2: MongoDB Atlas Web Interface

1. Accedi a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Vai al tuo cluster
3. Clicca su **"Browse Collections"**
4. Seleziona il database **`autonomi`**
5. Clicca sulla collezione **`vettori`**

### Opzione 3: Script Node.js

Crea un file `scripts/query-vettori.js`:

```javascript
import mongoose from 'mongoose';
import Vettore from '../server/models/vettore.model.js';

const mongoUri = process.env.MONGODB_URI;
await mongoose.connect(mongoUri);

const vettori = await Vettore.find();
console.log('Vettori nel database:', vettori);

await mongoose.connection.close();
```

Esegui: `node scripts/query-vettori.js`

## 📋 Struttura del documento salvato

Ogni vettore salvato ha questa struttura:

```json
{
  "_id": ObjectId("..."),
  "nome": "Nome Vettore",
  "mail": "vettore@example.com",
  "numeroTelefono": "123456789",
  "indirizzo": "Via Roma 1",
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

**Nota:** I campi `createdAt` e `updatedAt` vengono aggiunti automaticamente grazie a `timestamps: true` nello schema (riga 9 del modello).

## 🔧 Come cambiare il database o la collezione

### Cambiare il database:
Modifica la connection string nel file `.env`:
```env
MONGODB_URI=mongodb+srv://...@cluster.mongodb.net/NUOVO_NOME_DB?...
```

### Cambiare il nome della collezione:
Modifica il modello in `server/models/vettore.model.js`:

```javascript
// Opzione 1: Specifica esplicitamente il nome
export default mongoose.model("Vettore", VettoreSchema, "nome_collezione_custom");

// Opzione 2: Cambia il nome del modello (diventerà plurale)
export default mongoose.model("VettoreCustom", VettoreSchema);
// → creerà la collezione "vettorecustoms"
```

