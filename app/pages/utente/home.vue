<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import { type UtenteType , type CorsaType} from '../../../composables/dataType';


const error = ref<string | null>(null);
const corse = ref<CorsaType[]>([]);
// const corseEffettuate = ref<CorsaType[]>([]);
const loading = ref(false);

// Dati chilometri (default, verranno aggiornati con i dati reali)
// const chilometriTotali = ref(1000);
// const chilometriRimanenti = computed(() => chilometriTotali.value - chilometriUsati.value);

// Funzione per convertire stringa data in Date object
const parseDate = (date: Date | string): Date => {
  if (date instanceof Date) return date;
  return new Date(date);
};

// Carica corse prenotate
const getCorse = async () => {
  try {
    // Ottieni token JWT da localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
      error.value = 'Devi effettuare il login per visualizzare le corse';
      loading.value = false;
      return;
    }


    const response = await $fetch<{
      success: boolean;
      corse: CorsaType[];
    }>('/api/corse/utente/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      // Converti le date da stringhe a Date objects
      corse.value = response.corse;
    } else {
      error.value = "Errore durante il caricamento delle corse prenotate";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento delle corse prenotate";
    console.error('Errore getCorsePrenotate:', err);
  }
};

// // Carica corse effettuate
// const getCorseEffettuate = async (token: string) => {
//   try {
//     const response = await $fetch<{
//       success: boolean;
//       corse: CorsaType[];
//     }>('/api/corse/utente/get', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });
    
//     if (response.success) {
//       corseEffettuate.value = response.corse;
//     } else {
//       error.value = "Errore durante il caricamento delle corse effettuate";
//     }
//   } catch (err: any) {
//     error.value = err.data?.message || "Errore durante il caricamento delle corse effettuate";
//     console.error('Errore getCorseEffettuate:', err);
//   }
// };

// Carica dati utente
// const getCorse = async () => {
//   const token = localStorage.getItem('auth_token');
//   if (!token) {
//     error.value = "Token non trovato. Effettua il login.";
//     return;
//   }

//   loading.value = true;
//   error.value = null;

//   getCorsePrenotate(token);
//   getCorseEffettuate(token);

//   loading.value = false;
  
// };

// Calcola chilometri utilizzati dalle corse effettuate
// const chilometriUsati = computed(() => {
//   return corse.value.reduce((total, corsa) => total + (corsa.kmEffettivi || corsa.stimaKm), 0);
// });

// le corse vengono divise in effettuate e prenotate
const corseFiltrate = computed(() => {
  return {
    effettuate: corse.value.filter(c => c.effettuata === true),
    prenotate: corse.value.filter(c => c.effettuata === false)
  }
})

// Carica dati al mount
onMounted(() => {
  getCorse();

});
</script>

<template>
  <HomeLayout role="utente">

    <div class="row mt-4 mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
              <i class="bi bi-speedometer2 me-2"></i>
              Chilometraggio
            </h5>
            <div class="text-end">
              <div class="fs-4 fw-bold text-primary">{{ }} km</div>
              <small class="text-muted">Rimanenti su {{  }} km totali</small>
            </div>
          </div>
          <div class="card-body">

            <!-- Grafico a barre semplice -->
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-2">
                <span>Utilizzati</span>
                <span>Rimanenti</span>
              </div>
              <div class="progress" style="height: 30px;">
                <div
                  class="progress-bar bg-success"
                  :style="{ width: + '%' }"
                >
                </div>
                <div
                  class="progress-bar bg-light text-dark"
                  :style="{ width: + '%' }"
                >
                </div>
              </div>
            </div>

            <!-- Statistiche aggiuntive -->
            <div class="row text-center mt-4">
              <div class="col-md-3">
                <div class="border rounded p-3">
                  <div class="fs-4 fw-bold text-success">{{ }}</div>
                  <small class="text-muted">Km da corse effettuate</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="border rounded p-3">
                  <div class="fs-4 fw-bold text-info">{{ corseFiltrate.effettuate.length }}</div>
                  <small class="text-muted">Corse completate</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="border rounded p-3">
                  <div class="fs-4 fw-bold text-warning">{{ corseFiltrate.prenotate.length }}</div>
                  <small class="text-muted">Corse prenotate</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="border rounded p-3">
                  <div class="fs-4 fw-bold text-primary">{{  }}%</div>
                  <small class="text-muted">Utilizzo chilometri</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
          <Corsa
            v-for="corsa in corseFiltrate.prenotate"
            :key="corsa._id"
            :partenza="corsa.partenza"
            :arrivo="corsa.arrivo"
            :codiceVettore="corsa.codiceVettore"
            :data="corsa.data"
            :effettuata="corsa.effettuata"
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
          <Corsa
            v-for="corsa in corseFiltrate.effettuate"
            :key="corsa._id"
            :partenza="corsa.partenza"
            :arrivo="corsa.arrivo"
            :codiceVettore="corsa.codiceVettore"
            :data="corsa.data"
            :effettuata="corsa.effettuata"
          />
        </div>
      </div>
    </div>
  </HomeLayout>
</template>

