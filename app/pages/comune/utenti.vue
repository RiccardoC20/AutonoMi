<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Utente from '../../components/Utente.vue';
import { type UtenteType } from '../../../composables/dataType'

const error = ref<string | null>(null);
const utenti = ref<UtenteType[]>([]);
const loading = ref(false);
const utenteDaEliminare = ref<string | null>(null);


// Carica dati iniziali
const getUtenti = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    error.value = "Token non trovato. Effettua il login.";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    //carica utenti
    const response = await $fetch<{
      success: boolean;
      data: UtenteType[];
    }>('/api/utente/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      utenti.value = response.data;
    } else {
      error.value = "Errore durante il caricamento degli utenti";
    }

  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento dei dati";
    console.error('Errore loadData:', err);
  } finally {
    loading.value = false;
  }
};

const apriModalElimina = (id: string) => {
  utenteDaEliminare.value = id;
  console.log("id: " + id)
};

const confermaEliminazione = async () => {
  if (!utenteDaEliminare.value) return;
  await eliminaUtente(utenteDaEliminare.value);
  utenteDaEliminare.value = null;
};
// Funzione per eliminare utente
const eliminaUtente = async (_id:string) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    error.value = "Token non trovato. Effettua il login.";
    return;
  }
  console.log('ID ricevuto:', _id);
  try {
    const response = await $fetch<{
      success: boolean;
      message: string;
    }>(`/api/utente/${_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.success) {
      await getUtenti();
    } else {
      error.value = "Errore durante l'eliminazione dell'utente";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante l'eliminazione dell'utente";
    console.error('Errore eliminaUtente:', err);
  }
};

// Carica dati al mount
onMounted(() => {
  getUtenti();
});
</script>

<template>
  <HomeLayout role="comune">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1>Gestione utenti</h1>

        <!-- Messaggio di errore -->
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Caricamento...</span>
          </div>
          <p class="mt-2 text-muted">Caricamento dati...</p>
        </div>

        <!-- Informazioni aggiuntive -->
        <div class="card mt-4 mb-3 p-3" style="background-color:  var(--color-background)">
            <div >
              <p class="mb-0 small text-center text-muted" style="padding: 0;">
                La lista di tutti gli utenti attualmente registrati al servizo. 
              </p>
            </div>
        </div>

        <!-- Lista utenti usando il componente Utente -->
        <div class="mb-4 mt-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-people me-2"></i>
                Lista utenti ({{ utenti.length }})
              </h5>
            </div>
            <div class="card-body">
              <div v-if="utenti.length === 0" class="text-center py-4">
                <i class="bi bi-people text-muted fs-1 mb-2"></i>
                
              </div>
              <div v-else class="d-flex flex-column gap-3">
              <Utente
                v-for="utente in utenti"
                :key="utente._id"
                :_id="utente._id"
                :nome="utente.nome"
                :cognome="utente.cognome"
                :codiceUtente="utente.codiceUtente"
                @richiedi-eliminazione="apriModalElimina"
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </HomeLayout>
  
<!-- Modal per eliminare l'utente -->
<div class="modal fade" id="removeUtenteBackdrop" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Elimina Utente</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        Vuoi eliminare questo utente?
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
        <button
          class="btn btn-danger"
          data-bs-dismiss="modal"
          @click="confermaEliminazione"
        >
          Conferma
        </button>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.content-wrapper {
  max-width: 1200px;
  width: 100%;
}
</style>
