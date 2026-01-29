<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import { type CorsaType } from '../../../composables/dataType';
import { ref, computed, onMounted } from 'vue';

// Stato delle corse
const corse = ref<CorsaType[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const corsaDaEffettuare = ref<string | null>(null);


// Funzione per caricare le corse dal backend
const caricaCorse = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Ottieni token JWT da localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
      error.value = 'Devi effettuare il login per visualizzare le corse';
      loading.value = false;
      return;
    }

    // Chiamata API per ottenere le corse
    const response = await $fetch<{
      success: boolean;
      data: CorsaType[];
    }>('/api/corse/vettore/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.success) {
      corse.value = response.data;
      console.log("stampa delle corse trovate dalla chiamate get")
      corse.value.forEach((corsa, index) => {
        console.log(index, corsa)
      })
    } else {
      error.value = 'Errore nel caricamento delle corse';
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Errore durante il caricamento delle corse';
    console.error('Errore caricamento corse:', err);
  } finally {
    loading.value = false;
  }
};
// Funzione per dividere le corse in efffettuate e prenotate
const corseFiltrate = computed(() => {
  return {
    effettuate: corse.value.filter(c => c.effettuata === true),
    prenotate: corse.value.filter(c => c.effettuata === false)
  }
})

const confermaEffettuata = async () => {
  if (!corsaDaEffettuare.value) return;
  await promuoviCorsa(corsaDaEffettuare.value);
  corsaDaEffettuare.value = null;
}

const promuoviCorsa = async (id : string) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Token non trovato');
    await $fetch(`/api/corse/vettore/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });
    await caricaCorse();
  } catch (err) {
    console.error(err);
  }
}

const apriModalEffettua = (id : string) => {
  corsaDaEffettuare.value = id;
  console.log("modal aperto con: " + id)
};

// Carica le corse al mount del componente
onMounted(() => {
  caricaCorse();
});


</script>

<template>
  <HomeLayout role="vettore">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1>Corse</h1>

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

        

     

        <!-- Lista corse prenotate -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="bi bi-calendar-check me-2"></i>
              Corse Prenotate ({{ corseFiltrate.prenotate.length }})
            </h5>
          </div>
          <!-- Loading -->
          <!-- <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Caricamento...</span>
          </div>
          <p class="mt-3 text-muted">Caricamento corse...</p>
          </div> -->
          <div class="card-body">
            <div v-if="corseFiltrate.prenotate.length === 0" class="text-center py-4">
              <i class="bi bi-calendar-x text-muted fs-1 mb-2"></i>
              <p class="text-muted">Nessuna corsa prenotata</p>
            </div>
            <div v-else class="d-flex flex-column gap-3">
              <CorsaPrenotataVettore
                v-for="corsa in corseFiltrate.prenotate"
                :key="corsa._id"
                :id="corsa._id"
                :partenza="corsa.partenza"
                :arrivo="corsa.arrivo"
                :codiceUtente="corsa.codiceUtente"
                :km="corsa.km"
                :data="corsa.data"
                @effettuaCorsa="apriModalEffettua"
              />
            </div>
          </div>
        </div>

         <!-- Lista corse effettuate -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="bi bi-calendar-check me-2"></i>
              Corse effettuate ({{ corseFiltrate.effettuate.length }})
            </h5>
          </div>
          <!-- Loading -->
          <!-- <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Caricamento...</span>
          </div>
          <p class="mt-3 text-muted">Caricamento corse...</p>
          </div> -->
          <div class="card-body">
            <div v-if="corseFiltrate.effettuate.length === 0" class="text-center py-4">
              <i class="bi bi-calendar-x text-muted fs-1 mb-2"></i>
              <p class="text-muted">Nessuna corsa effettuata</p>
            </div>
            <div v-else class="d-flex flex-column gap-3">
              <CorsaEffettuata
                v-for="corsa in corseFiltrate.effettuate"
                :key="corsa._id"
                :partenza="corsa.partenza"
                :arrivo="corsa.arrivo"
                :codiceUtente="corsa.codiceUtente"
                :km="corsa.km"
                :data="corsa.data"
                :effettuata="corsa.effettuata"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  </HomeLayout>
<!-- Modal Corse da Prenotate a Effettuate -->
<div 
    class="modal fade" 
    id="corsaEffettuataBackdrop" 
    data-bs-backdrop="static" 
    data-bs-keyboard="false" 
    tabindex="-1" 
    aria-labelledby="staticBackdropLabel" 
    aria-hidden="true"
  >
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Corsa Effettua?</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Questa corsa è stata effettuata?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
        <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="confermaEffettuata">Conferma</button>
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
  