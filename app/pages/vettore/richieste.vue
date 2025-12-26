<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Corsa from '../../components/Corsa.vue';
import { ref, onMounted } from 'vue';

// Stato delle richieste
const richieste = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Stato per i popup di conferma
const showAccettaModal = ref(false);
const showRifiutaModal = ref(false);
const richiestaSelezionata = ref<any>(null);
const processing = ref(false);

// Funzione per caricare le richieste dal backend
const caricaRichieste = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Ottieni token JWT da localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
      error.value = 'Devi effettuare il login per visualizzare le richieste';
      loading.value = false;
      return;
    }

    // Chiamata API per ottenere le richieste
    const response = await $fetch<{
      success: boolean;
      data: any[];
      count: number;
    }>('/api/richieste-corsa/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.success) {
      richieste.value = response.data.map(richiesta => {
        // Combina data e orario per creare un Date completo
        const dataCompleta = new Date(richiesta.data);
        if (richiesta.orario) {
          const [ore, minuti] = richiesta.orario.split(':');
          dataCompleta.setHours(parseInt(ore, 10), parseInt(minuti, 10), 0, 0);
        }
        
        return {
          ...richiesta,
          data: dataCompleta,
          orario: richiesta.orario, // Conserva l'orario originale
          // Usa codiceUtente come extra per il componente Corsa
          extra: [`Utente: ${richiesta.codiceUtente}`]
        };
      });
    } else {
      error.value = 'Errore nel caricamento delle richieste';
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Errore durante il caricamento delle richieste';
    console.error('Errore caricamento richieste:', err);
  } finally {
    loading.value = false;
  }
};

// Funzione per aprire il popup di accettazione
const apriAccettaModal = (richiesta: any) => {
  richiestaSelezionata.value = richiesta;
  showAccettaModal.value = true;
};

// Funzione per aprire il popup di rifiuto
const apriRifiutaModal = (richiesta: any) => {
  richiestaSelezionata.value = richiesta;
  showRifiutaModal.value = true;
};

// Funzione per confermare l'accettazione: elimina la richiesta e crea una corsa
const confermaAccetta = async () => {
  if (!richiestaSelezionata.value) return;

  processing.value = true;
  const richiestaId = richiestaSelezionata.value._id;
  const richiesta = richiestaSelezionata.value;

  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      error.value = 'Token di autenticazione non trovato';
      return;
    }

    // Prima elimina la richiesta
    const deleteResponse = await $fetch<{
      success: boolean;
      message: string;
    }>(`/api/richieste-corsa/${richiestaId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!deleteResponse.success) {
      error.value = 'Errore durante l\'eliminazione della richiesta';
      return;
    }

    // Poi crea la corsa con effettuata = false
    // Prepara la data nel formato corretto per l'API
    const dataFormato = richiesta.data instanceof Date 
      ? richiesta.data.toISOString().split('T')[0] 
      : new Date(richiesta.data).toISOString().split('T')[0];
    
    const orarioFormato = richiesta.orario || 
      (richiesta.data instanceof Date 
        ? `${richiesta.data.getHours().toString().padStart(2, '0')}:${richiesta.data.getMinutes().toString().padStart(2, '0')}`
        : '00:00');

    const createResponse = await $fetch<{
      success: boolean;
      message: string;
      corsa: any;
    }>('/api/corse/crea', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        codiceUtente: richiesta.codiceUtente,
        codiceVettore: richiesta.codiceVettore,
        partenza: richiesta.partenza,
        arrivo: richiesta.arrivo,
        data: dataFormato,
        orario: orarioFormato
      }
    });

    if (createResponse.success) {
      showAccettaModal.value = false;
      richiestaSelezionata.value = null;
      // Ricarica automaticamente tutte le richieste dal server
      await caricaRichieste();
    } else {
      error.value = 'Errore durante la creazione della corsa';
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Errore durante l\'accettazione della richiesta';
    console.error('Errore accettazione richiesta:', err);
  } finally {
    processing.value = false;
  }
};

// Funzione per confermare il rifiuto e cancellare la richiesta
const confermaRifiuta = async () => {
  if (!richiestaSelezionata.value) return;

  processing.value = true;
  const richiestaId = richiestaSelezionata.value._id;

  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      error.value = 'Token di autenticazione non trovato';
      return;
    }

    const response = await $fetch<{
      success: boolean;
      message: string;
    }>(`/api/richieste-corsa/${richiestaId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.success) {
      showRifiutaModal.value = false;
      richiestaSelezionata.value = null;
      // Ricarica automaticamente tutte le richieste dal server
      await caricaRichieste();
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Errore durante l\'eliminazione della richiesta';
    console.error('Errore eliminazione richiesta:', err);
  } finally {
    processing.value = false;
  }
};

// Carica le richieste al mount del componente
onMounted(() => {
  caricaRichieste();
});
</script>

<template>
  <HomeLayout role="vettore">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1>Richieste di Corsa</h1>

        <!-- Messaggio di errore -->
        <div
          v-if="error"
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {{ error }}
          <button
            type="button"
            class="btn-close"
            @click="error = null"
            aria-label="Close"
          ></button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Caricamento...</span>
          </div>
          <p class="mt-3 text-muted">Caricamento richieste...</p>
        </div>

        <!-- Lista richieste -->
        <div v-else class="mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-list-ul me-2"></i>
                Richieste Ricevute ({{ richieste.length }})
              </h5>
            </div>
            <div class="card-body">
              <div v-if="richieste.length === 0" class="text-center py-5">
                <i class="bi bi-inbox text-muted fs-1 mb-3"></i>
                <p class="text-muted">Nessuna richiesta di corsa disponibile</p>
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <div
                  v-for="richiesta in richieste"
                  :key="richiesta._id"
                  class="d-flex align-items-center gap-3"
                >
                  <div class="flex-grow-1">
                    <Corsa
                      :partenza="richiesta.partenza"
                      :arrivo="richiesta.arrivo"
                      :data="richiesta.data"
                      :extra="richiesta.extra"
                    />
                  </div>
                  <div class="d-flex gap-2">
                    <button
                      class="btn btn-success btn-sm"
                      @click="apriAccettaModal(richiesta)"
                      :disabled="processing"
                    >
                      <i class="bi bi-check-circle me-1"></i>
                      Accetta
                    </button>
                    <button
                      class="btn btn-danger btn-sm"
                      @click="apriRifiutaModal(richiesta)"
                      :disabled="processing"
                    >
                      <i class="bi bi-x-circle me-1"></i>
                      Rifiuta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal di conferma Accetta -->
    <div
      class="modal fade"
      :class="{ show: showAccettaModal }"
      :style="{ display: showAccettaModal ? 'block' : 'none' }"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <i class="bi bi-check-circle me-2"></i>
              Conferma Accettazione
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="showAccettaModal = false"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>Sei sicuro di voler accettare questa richiesta di corsa?</p>
            <div v-if="richiestaSelezionata" class="small text-muted">
              <strong>Partenza:</strong> {{ richiestaSelezionata.partenza }}<br>
              <strong>Arrivo:</strong> {{ richiestaSelezionata.arrivo }}<br>
              <strong>Data:</strong> {{ richiestaSelezionata.data?.toLocaleDateString() }}<br>
              <strong>Orario:</strong> {{ richiestaSelezionata.data?.toLocaleTimeString() }}
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showAccettaModal = false"
            >
              Annulla
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="confermaAccetta"
            >
              <i class="bi bi-check-circle me-1"></i>
              Conferma Accettazione
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showAccettaModal"
      class="modal-backdrop fade show"
      @click="showAccettaModal = false"
    ></div>

    <!-- Modal di conferma Rifiuta -->
    <div
      class="modal fade"
      :class="{ show: showRifiutaModal }"
      :style="{ display: showRifiutaModal ? 'block' : 'none' }"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Conferma Rifiuto
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="showRifiutaModal = false"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p><strong>Attenzione!</strong> Sei sicuro di voler rifiutare questa richiesta di corsa?</p>
            <p class="text-danger mb-0">Questa azione eliminerà definitivamente la richiesta dal database.</p>
            <div v-if="richiestaSelezionata" class="small text-muted mt-3">
              <strong>Partenza:</strong> {{ richiestaSelezionata.partenza }}<br>
              <strong>Arrivo:</strong> {{ richiestaSelezionata.arrivo }}<br>
              <strong>Data:</strong> {{ richiestaSelezionata.data?.toLocaleDateString() }}<br>
              <strong>Orario:</strong> {{ richiestaSelezionata.data?.toLocaleTimeString() }}
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showRifiutaModal = false"
              :disabled="processing"
            >
              Annulla
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="confermaRifiuta"
              :disabled="processing"
            >
              <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-x-circle me-1"></i>
              {{ processing ? 'Eliminazione...' : 'Conferma Rifiuto' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showRifiutaModal"
      class="modal-backdrop fade show"
      @click="showRifiutaModal = false"
    ></div>
  </HomeLayout>
</template>

<style scoped>
.content-wrapper {
  max-width: 1200px;
  width: 100%;
}
</style>
