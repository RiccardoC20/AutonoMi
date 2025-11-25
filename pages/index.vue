<template>
  <div class="container">
    <h1>Gestione Parole</h1>
    
    <!-- Form per inserire nuove parole -->
    <section class="form-section">
      <h2>Aggiungi una nuova parola</h2>
      <form @submit.prevent="addWord" class="word-form">
        <div class="form-group">
          <label for="word-input">Parola:</label>
          <input
            id="word-input"
            v-model="newWord"
            type="text"
            placeholder="Inserisci una nuova parola..."
            class="word-input"
            :disabled="loading"
            required
          />
        </div>
        <button type="submit" class="submit-btn" :disabled="loading || !newWord.trim()">
          {{ loading ? 'Salvataggio...' : 'Aggiungi Parola' }}
        </button>
      </form>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </section>

    <!-- Sezione visualizzazione parole dal database -->
    <section class="words-section">
      <div class="section-header">
        <h2>Parole nel Database</h2>
        <button @click="loadWords" class="refresh-btn" :disabled="loadingWords">
          {{ loadingWords ? 'Caricamento...' : '🔄 Aggiorna' }}
        </button>
      </div>
      
      <div v-if="loadingWords" class="loading">
        Caricamento parole...
      </div>
      
      <div v-else-if="words.length === 0" class="empty-state">
        <p>Nessuna parola nel database. Aggiungi la prima parola usando il form sopra!</p>
      </div>
      
      <div v-else class="words-list">
        <div
          v-for="word in words"
          :key="word._id"
          class="word-item"
        >
          <span class="word-text">{{ word.text }}</span>
          <span class="word-date">
            {{ formatDate(word.createdAt) }}
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const newWord = ref('');
const words = ref([]);
const loading = ref(false);
const loadingWords = ref(false);
const error = ref('');
const successMessage = ref('');

// Carica le parole dal database
const loadWords = async () => {
  loadingWords.value = true;
  error.value = '';
  
  try {
    const response = await $fetch('/api/words');
    if (response.success) {
      words.value = response.data;
    } else {
      error.value = 'Errore nel caricamento delle parole';
    }
  } catch (err) {
    error.value = err.data?.message || 'Errore nel caricamento delle parole';
    console.error('Errore:', err);
  } finally {
    loadingWords.value = false;
  }
};

// Aggiunge una nuova parola
const addWord = async () => {
  if (!newWord.value.trim()) {
    return;
  }

  loading.value = true;
  error.value = '';
  successMessage.value = '';

  try {
    const response = await $fetch('/api/words', {
      method: 'POST',
      body: {
        text: newWord.value.trim()
      }
    });

    if (response.success) {
      successMessage.value = 'Parola aggiunta con successo!';
      newWord.value = '';
      // Ricarica la lista delle parole
      await loadWords();
      // Rimuovi il messaggio di successo dopo 3 secondi
      setTimeout(() => {
        successMessage.value = '';
      }, 3000);
    }
  } catch (err) {
    error.value = err.data?.message || 'Errore nel salvataggio della parola';
    console.error('Errore:', err);
  } finally {
    loading.value = false;
  }
};

// Formatta la data
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Carica le parole all'avvio della pagina
onMounted(() => {
  loadWords();
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

h2 {
  color: #34495e;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

/* Form Section */
.form-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.word-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #34495e;
}

.word-input {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.word-input:focus {
  outline: none;
  border-color: #3498db;
}

.word-input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.submit-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

/* Messages */
.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fee;
  color: #c33;
  border-radius: 4px;
  border-left: 4px solid #c33;
}

.success-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #efe;
  color: #3c3;
  border-radius: 4px;
  border-left: 4px solid #3c3;
}

/* Words Section */
.words-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.refresh-btn {
  padding: 0.5rem 1rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #229954;
}

.refresh-btn:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-style: italic;
}

.words-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.word-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #3498db;
  transition: transform 0.2s, box-shadow 0.2s;
}

.word-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.word-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #2c3e50;
}

.word-date {
  font-size: 0.85rem;
  color: #7f8c8d;
}

/* Responsive */
@media (max-width: 600px) {
  .container {
    padding: 1rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .word-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>

