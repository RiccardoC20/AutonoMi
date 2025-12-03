# 🔐 Sistema di Autenticazione JWT

## Come funziona il controllo di autenticazione

### Flusso completo:

```
1. UTENTE FA LOGIN
   ↓
2. Frontend invia codiceUtente + password a /api/utente/login
   ↓
3. Backend verifica credenziali nel database (collezione "utenti")
   ↓
4. Backend genera JWT token e lo restituisce
   ↓
5. Frontend salva token in localStorage come "auth_token"
   ↓
6. Frontend reindirizza alla pagina protetta
   ↓
7. AD OGNI APERTURA DI PAGINA:
   ↓
8. Frontend legge token da localStorage
   ↓
9. Frontend chiama /api/utente/me con header: Authorization: Bearer <token>
   ↓
10. Backend verifica il token JWT:
    - Decodifica il token
    - Estrae l'ID utente dal token
    - Cerca l'utente nel database usando l'ID
    ↓
11. Backend restituisce i dati utente (senza password)
   ↓
12. Frontend salva i dati utente nello stato
   ↓
13. Pagina mostra i dati solo se autenticato
```

## 📋 Componenti del Sistema

### 1. **API Login** (`/api/utente/login`)
- **Input**: `codiceUtente` (stringa), `password` (stringa)
- **Processo**:
  1. Cerca utente nel database: `Utente.findOne({ codiceUtente })`
  2. Verifica password con `bcrypt.compare()`
  3. Genera JWT token con `jwt.sign()`
  4. Restituisce token + dati utente

### 2. **API Verifica Token** (`/api/utente/me`)
- **Input**: Token JWT nell'header `Authorization: Bearer <token>`
- **Processo**:
  1. Estrae token dall'header
  2. Verifica token con `jwt.verify()`
  3. Estrae `userId` dal token decodificato
  4. Cerca utente nel database: `Utente.findById(userId)`
  5. Restituisce dati utente (senza password)

### 3. **Composable `useAuth()`** (`composables/useAuth.ts`)
- **Funzione**: Centralizza la logica di autenticazione
- **Metodi**:
  - `checkAuth()`: Verifica token e carica dati utente
  - `logout()`: Rimuove token e dati
  - `loadUserFromStorage()`: Carica dati da localStorage

## 🔧 Come usare in una pagina

### Esempio base:

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';

const { user, loading, error, isAuthenticated, checkAuth } = useAuth();

// Verifica autenticazione all'avvio della pagina
onMounted(() => {
  checkAuth();
});
</script>

<template>
  <div v-if="loading">Caricamento...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="isAuthenticated">
    <h1>Benvenuto {{ user?.nome }}!</h1>
    <p>Codice Utente: {{ user?.codiceUtente }}</p>
  </div>
</template>
```

## 🗄️ Chiamata al Database

### Quando viene chiamato il database?

1. **Durante il login** (`/api/utente/login`):
   - Query: `Utente.findOne({ codiceUtente: "123456" })`
   - Scopo: Verificare che l'utente esista e la password sia corretta

2. **Ad ogni verifica token** (`/api/utente/me`):
   - Query: `Utente.findById(userId)`
   - Scopo: Recuperare i dati aggiornati dell'utente dal database

### Perché chiamare il database ad ogni verifica?

- ✅ I dati potrebbero essere cambiati nel database
- ✅ Verifica che l'utente esista ancora
- ✅ Ottieni dati sempre aggiornati
- ✅ Il token potrebbe essere valido ma l'utente eliminato

## 🔑 Struttura del Token JWT

Il token contiene:
```json
{
  "userId": "6929d33ce2434fc91bc602ea",
  "codiceUtente": "123456",
  "email": "prova@gmail.com",
  "iat": 1234567890,  // Data di emissione
  "exp": 1234567890   // Data di scadenza (7 giorni)
}
```

## 📝 Best Practices

1. **Sempre verificare il token** ad ogni pagina protetta
2. **Non fare affidamento solo su localStorage** - verifica sempre con il server
3. **Gestire gli errori** - se il token è scaduto, reindirizza al login
4. **Usare il composable** - evita duplicazione di codice

## 🚨 Casi d'Errore

- **Token non trovato**: Utente non ha fatto login → Reindirizza al login
- **Token scaduto**: Token JWT è scaduto → Reindirizza al login
- **Token non valido**: Token modificato o corrotto → Reindirizza al login
- **Utente non trovato**: Utente eliminato dal DB → Reindirizza al login



