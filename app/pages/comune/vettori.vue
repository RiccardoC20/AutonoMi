<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Vettore {
  _id: string;
  nome: string;
  mail: string;
  numeroTelefono: string;
  indirizzo: string;
  createdAt?: string;
  updatedAt?: string;
}

const vettori = ref<Vettore[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const deletingId = ref<string | null>(null);
const showConfirmModal = ref(false);
const vettoreDaEliminare = ref<Vettore | null>(null);

// Funzione per caricare i vettori dal server
async function caricaVettori() {
  loading.value = true;
  error.value = null;

  try {
    const response = await $fetch<{ success: boolean; data: Vettore[]; count: number }>('/api/vettore');
    
    if (response.success) {
      vettori.value = response.data;
    } else {
      error.value = 'Errore nel caricamento dei vettori';
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Errore nel caricamento dei vettori';
    console.error('Errore:', err);
  } finally {
    loading.value = false;
  }
}

// Apre il modal di conferma eliminazione
function confermaEliminazione(vettore: Vettore) {
  vettoreDaEliminare.value = vettore;
  showConfirmModal.value = true;
}

// Chiude il modal di conferma
function chiudiModal() {
  showConfirmModal.value = false;
  vettoreDaEliminare.value = null;
}

// Elimina il vettore dopo la conferma
async function eliminaVettore() {
  if (!vettoreDaEliminare.value) return;

  deletingId.value = vettoreDaEliminare.value._id;
  error.value = null;

  try {
    const response = await $fetch<{ success: boolean; message: string }>(
      `/api/vettore/${vettoreDaEliminare.value._id}`,
      { method: 'DELETE' }
    );

    if (response.success) {
      // Rimuovi il vettore dalla lista locale
      vettori.value = vettori.value.filter(v => v._id !== vettoreDaEliminare.value!._id);
      // Chiudi il modal
      chiudiModal();
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Errore nell\'eliminazione del vettore';
    console.error('Errore:', err);
  } finally {
    deletingId.value = null;
  }
}

// Carica i vettori all'avvio della pagina
onMounted(() => {
  caricaVettori();
});
</script>

<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h2 mb-0">Lista Vettori</h1>
      <button class="btn btn-primary" @click="caricaVettori" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
        {{ loading ? 'Caricamento...' : 'Aggiorna' }}
      </button>
    </div>

    <!-- Messaggio di errore -->
    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Loading state -->
    <div v-if="loading && vettori.length === 0" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Caricamento...</span>
      </div>
      <p class="mt-3 text-muted">Caricamento vettori...</p>
    </div>

    <!-- Lista vuota -->
    <div v-else-if="!loading && vettori.length === 0" class="alert alert-info" role="alert">
      Nessun vettore presente nel database.
    </div>

    <!-- Lista vettori -->
    <div v-else class="row g-4">
      <div v-for="vettore in vettori" :key="vettore._id" class="col-12 col-md-6 col-lg-4">
        <!-- Box grafico per ogni vettore -->
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ vettore.nome }}</h5>
            
            <div class="mb-2">
              <strong>Email:</strong>
              <div class="text-muted">{{ vettore.mail }}</div>
            </div>

            <div class="mb-2">
              <strong>Telefono:</strong>
              <div class="text-muted">{{ vettore.numeroTelefono }}</div>
            </div>

            <div class="mb-3">
              <strong>Indirizzo:</strong>
              <div class="text-muted">{{ vettore.indirizzo }}</div>
            </div>

            <!-- Bottone elimina -->
            <div class="d-grid">
              <button
                class="btn btn-outline-danger btn-sm"
                @click="confermaEliminazione(vettore)"
                :disabled="deletingId === vettore._id"
              >
                <span v-if="deletingId === vettore._id" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ deletingId === vettore._id ? 'Eliminazione...' : 'Elimina' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal di conferma eliminazione -->
    <div
      v-if="showConfirmModal"
      class="modal fade show"
      style="display: block; background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">Conferma Eliminazione</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="chiudiModal"
              :disabled="deletingId !== null"
            ></button>
          </div>
          <div class="modal-body">
            <p>Sei sicuro di voler eliminare il vettore:</p>
            <div class="alert alert-warning mb-0">
              <strong>{{ vettoreDaEliminare?.nome }}</strong><br>
              <small class="text-muted">{{ vettoreDaEliminare?.mail }}</small>
            </div>
            <p class="mt-3 mb-0 text-danger">
              <strong>Questa azione non può essere annullata.</strong>
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="chiudiModal"
              :disabled="deletingId !== null"
            >
              Annulla
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="eliminaVettore"
              :disabled="deletingId !== null"
            >
              <span v-if="deletingId" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ deletingId ? 'Eliminazione...' : 'Elimina' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contatore vettori -->
    <div v-if="vettori.length > 0" class="mt-4 text-muted text-center">
      Totale vettori: <strong>{{ vettori.length }}</strong>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.card-title {
  color: #0d6efd;
  margin-bottom: 1rem;
}
</style>
