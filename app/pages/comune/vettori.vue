<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Vettore from '../../components/Vettore.vue';
import { type VettoreType , type ComuneType} from '~~/composables/dataType';

const error = ref<string | null>(null);
const vettori = ref<VettoreType[]>([]);
const loading = ref(false);
const vettoreDaEliminare = ref<string | null>(null);

// Barra di ricerca
const searchTerm = ref('');

// Lista vettori filtrata
const vettoriFiltrati = computed(() => {
  if (!searchTerm.value) return vettori.value;

  return vettori.value.filter(vettore =>
    vettore.nome.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    vettore.codiceVettore.toString().includes(searchTerm.value)
  );
});

// Carica vettori
const getVettori = async (token: string) => {
  try {
    const response = await $fetch<{
      success: boolean;
      data: VettoreType[];
      count: number;
    }>('/api/vettore/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      vettori.value = response.data;
    } else {
      error.value = "Errore durante il caricamento dei vettori";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento dei vettori";
    console.error('Errore getVettori:', err);
  }
};

// Carica dati iniziali
const loadData = async () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  const token = localStorage.getItem('auth_token');
  if (!token) {
    error.value = "Token non trovato. Effettua il login.";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // Carica vettori
    await getVettori(token)

  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento dei dati";
    console.error('Errore loadData:', err);
  } finally {
    loading.value = false;
  }
};
const apriModalElimina = (id: string) => {
  vettoreDaEliminare.value = id;
  console.log("id: " + id)
};

const confermaEliminazione = async () => {
  if (!vettoreDaEliminare.value) return;
  await eliminaVettore(vettoreDaEliminare.value);
  vettoreDaEliminare.value = null;
};
// Funzione per eliminare vettore
const eliminaVettore = async (vettoreId: string) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    error.value = "Token non trovato. Effettua il login.";
    return;
  }

  try {
    const response = await $fetch<{
      success: boolean;
      message: string;
    }>(`/api/vettore/${vettoreId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.success) {
      // Ricarica la lista dei vettori
      await getVettori(token);
    } else {
      error.value = "Errore durante l'eliminazione del vettore";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante l'eliminazione del vettore";
    console.error('Errore eliminaVettore:', err);
  }
};

// Carica dati 
onMounted(() => {
  loadData();
});
</script>

<template>
  <HomeLayout role="comune">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1>Gestione Vettori</h1>

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
                    placeholder="Cerca per nome o codice vettore..."
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Lista vettori -->
          <div class="mb-4">
            <div class="card h-100">
              <div class="card-header">
                <h5 class="card-title mb-0">
                  <i class="bi bi-truck me-2"></i>
                  Lista Vettori ({{ vettoriFiltrati.length }})
                </h5>
              </div>
              <div class="card-body">
                <div v-if="vettoriFiltrati.length === 0" class="text-center py-4">
                  <i class="bi bi-truck text-muted fs-1 mb-2"></i>
                  <p class="text-muted">
                    {{ searchTerm ? 'Nessun vettore trovato con la ricerca effettuata' : 'Nessun vettore disponibile' }}
                  </p>
                </div>
                <div v-else class="d-flex flex-column gap-3">
                  <Vettore
                    v-for="vettore in vettoriFiltrati"
                    :key="vettore._id"
                    :_id="vettore._id"
                    :codiceVettore="vettore.codiceVettore.toString()"
                    :nome="vettore.nome"
                    :email="vettore.email"
                    @elimina="apriModalElimina"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </HomeLayout>
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
