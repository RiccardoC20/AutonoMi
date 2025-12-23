<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import { useAuth, type UtenteType , type CorsaType} from '../../../composables/useAuth';



const error = ref<string | null>(null);
const user = ref<UtenteType | null>(null);
const corse = ref<CorsaType[]>([]);
const loading = ref(false);

// Filtri di ricerca e ordinamento
const sortBy = ref('data-desc'); // 'data-desc', 'data-asc'
const dateFrom = ref('');
const dateTo = ref('');


// Carica corse prenotate
const getCorsePrenotate = async (token: string) => {
  try {
    const response = await $fetch<{
      success: boolean;
      corse: CorsaType[];
    }>('/api/corsa', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      corse.value = response.corse;
    } else {
      error.value = "Errore durante il caricamento delle corse prenotate";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento delle corse prenotate";
    console.error('Errore getCorsePrenotate:', err);
  }
};

// Carica dati utente
const getVettore = async () => {
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
    const response = await $fetch<{
      success: boolean;
      user: UtenteType;
    }>('/api/vettore/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      user.value = response.user;
      
      // Carica corse prenotate
      await getCorsePrenotate(token);
    } else {
      error.value = "Errore durante il caricamento dei dati del vettore";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento dei dati del vettore";
    console.error('Errore getVettore:', err);
  } finally {
    loading.value = false;
  }
};

const corseFiltrate = computed(() => {
  let filtered = corse.value.filter(corsa => {
    // Filtro per periodo di data
    const corsaDate = corsa.data?.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const matchesDateFrom = !dateFrom.value || !corsaDate || corsaDate >= dateFrom.value;
    const matchesDateTo = !dateTo.value || !corsaDate || corsaDate <= dateTo.value;

    return matchesDateFrom && matchesDateTo;
  });

  // Ordinamento
  filtered.sort((a, b) => {
    if (sortBy.value === 'data-desc') {
      return new Date(b.data).getTime() - new Date(a.data).getTime();
    } else if (sortBy.value === 'data-asc') {
      return new Date(a.data).getTime() - new Date(b.data).getTime();
    }
    return 0;
  });

  return filtered;
});

// Carica dati al mount
onMounted(() => {
  getVettore();
});
</script>

<template>
  <HomeLayout role="vettore">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1>Corse Prenotate</h1>

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
          <!-- Filtri e controlli --> 
          <div class="mb-4">
          <div class="card h-100">
            <div class="card-body">
              <!-- Ordinamento -->
              <div class="mb-3">
                <label class="form-label fw-bold">Ordina per:</label>
                <select v-model="sortBy" class="form-select">
                  <option value="data-desc">Più recenti prima</option>
                  <option value="data-asc">Più vecchie prima</option>
                </select>
              </div>

              <!-- Filtro data -->
              <div class="mb-3">
                <label class="form-label fw-bold">Filtra per data:</label>
                <button class="btn btn-outline-secondary w-100 mb-2" data-bs-toggle="collapse" data-bs-target="#dateFiltersUser">
                  <i class="bi bi-calendar-range me-2"></i>Imposta Periodo
                </button>

                <!-- Filtri data espandibili -->
                <div class="collapse" id="dateFiltersUser">
                  <div class="row g-2 mt-2">
                    <div class="col-6">
                      <label class="form-label small">Dal:</label>
                      <input
                        v-model="dateFrom"
                        type="date"
                        class="form-control form-control-sm"
                      >
                    </div>
                    <div class="col-6">
                      <label class="form-label small">Al:</label>
                      <input
                        v-model="dateTo"
                        type="date"
                        class="form-control form-control-sm"
                      >
                    </div>
                    <div class="col-12 mt-2">
                      <button
                        class="btn btn-outline-danger btn-sm w-100"
                        @click="dateFrom = ''; dateTo = ''"
                      >
                        <i class="bi bi-x-circle me-1"></i>Rimuovi Filtri
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista corse prenotate -->
        <div class="mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-calendar-check me-2"></i>
                Corse Prenotate ({{ corseFiltrate.length }})
              </h5>
            </div>
            <div class="card-body">
              <div v-if="corseFiltrate.length === 0" class="text-center py-4">
                <i class="bi bi-calendar-x text-muted fs-1 mb-2"></i>
                <p class="text-muted">Nessuna corsa prenotata</p>
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <Corsa
                  v-for="corsa in corseFiltrate"
                  :key="corsa.id"
                  :partenza="corsa.partenza"
                  :arrivo="corsa.arrivo"
                  :data="corsa.data"
                  :stimaKm="corsa.stimaKm"
                  :codiceVettore="corsa.codiceVettore"
                  :nomeVettore="corsa.nomeVettore"
                  :codiceUtente="corsa.codiceUtente"
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
  