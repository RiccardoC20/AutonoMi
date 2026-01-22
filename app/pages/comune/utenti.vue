<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Utente from '../../components/Utente.vue';
import { type UtenteType } from '../../../composables/dataType'



const error = ref<string | null>(null);
const utenti = ref<UtenteType[]>([]);
const loading = ref(false);

// Barra di ricerca
const searchTerm = ref('');

// Lista utenti filtrata
const utentiFiltrati = computed(() => {
  if (!searchTerm.value) return utenti.value;

  return utenti.value.filter(utente =>
    utente.nome.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    utente.cognome.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    utente.codiceUtente.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

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

// Funzione per eliminare utente
const eliminaUtente = async (vettoreId: string) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    error.value = "Token non trovato. Effettua il login.";
    return;
  }

  try {
    const response = await $fetch<{
      success: boolean;
      message: string;
    }>(`/api/utente/${vettoreId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.success) {
      // Ricarica la lista dei vettori
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
        <h1>Gestione Utenti</h1>

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

        <!-- Contenuto principale -->
        <div v-else>
          <!-- Barra di ricerca -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <input
                    v-model="searchTerm"
                    type="text"
                    class="form-control"
                    placeholder="Cerca per nome o codice utente..."
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Lista utenti usando il componente Utente -->
          <div class="mb-4">
            <div class="card h-100">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="bi bi-people me-2"></i>
                  Lista Utenti ({{ utentiFiltrati.length }})
                </h5>
              </div>
              <div class="card-body">
                <div v-if="utentiFiltrati.length === 0" class="text-center py-4">
                  <i class="bi bi-people text-muted fs-1 mb-2"></i>
                  <p class="text-muted">
                    {{ searchTerm ? 'Nessun utente trovato con la ricerca effettuata' : 'Nessun utente disponibile' }}
                  </p>
                </div>
                <div v-else class="d-flex flex-column gap-3">
                  <Utente
                    v-for="utente in utentiFiltrati"
                    :key="utente._id"
                    :nome="utente.nome"
                    :cognome="utente.cognome"
                    :codiceUtente="utente.codiceUtente"
                    @elimina="eliminaUtente(utente._id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </HomeLayout>
</template>

<style scoped>
.content-wrapper {
  max-width: 1200px;
  width: 100%;
}
</style>
