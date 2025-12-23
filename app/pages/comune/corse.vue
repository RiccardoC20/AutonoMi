<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Corsa from '../../components/Corsa.vue';
import { type CorsaType } from '~~/composables/useAuth';

const error = ref<string | null>(null);
const corse = ref<CorsaType[]>([]);
const loading = ref(false);


// Filtri di ricerca e ordinamento
const sortBy = ref('data-desc'); // 'data-desc', 'data-asc'
const dateFrom = ref('');
const dateTo = ref('');

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

//carica corse
const loadData = async () =>{

  const token = localStorage.getItem('auth_token');
  if (!token) {
    error.value = "Token non trovato. Effettua il login.";
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    //carica corse
    const response = await $fetch<{
      success: boolean;
      data: CorsaType[];
    }>('/api/corsa/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      corse.value = response.data;
    } else {
      error.value = "Errore durante il caricamento delle corse";
    }

  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento dei dati";
    console.error('Errore loadData:', err);
  } finally {
    loading.value = false;
  }

}
// Carica dati al mount
onMounted(() => {
  loadData();
});
</script>

<template>
  <HomeLayout role="comune">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1>Monitoraggio Corse</h1>

        <!-- Messaggio di errore -->
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>


          <!-- Filtri e ricerca -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="row g-3">

                <!-- Ordinamento -->
                <div class="col-md-3">
                  <select v-model="sortBy" class="form-select">
                    <option value="data-desc">Più recenti prima</option>
                    <option value="data-asc">Più vecchie prima</option>
                  </select>
                </div>

                <!-- Filtro data -->
                <div class="col-md-3">
                  <button class="btn btn-outline-secondary w-100" data-bs-toggle="collapse" data-bs-target="#dateFilters">
                    <i class="bi bi-calendar-range me-2"></i>Filtro Data
                  </button>
                </div>
              </div>

              <!-- Filtri data espandibili -->
              <div class="collapse mt-3" id="dateFilters">
                <div class="row g-3">
                  <div class="col-md-4">
                    <label class="form-label small fw-bold">Data dal:</label>
                    <input
                      v-model="dateFrom"
                      type="date"
                      class="form-control"
                    >
                  </div>
                  <div class="col-md-4">
                    <label class="form-label small fw-bold">Data al:</label>
                    <input
                      v-model="dateTo"
                      type="date"
                      class="form-control"
                    >
                  </div>
                  <div class="col-md-4 d-flex align-items-end">
                    <button
                      class="btn btn-outline-danger w-100"
                      @click="dateFrom = ''; dateTo = ''"
                    >
                      <i class="bi bi-x-circle me-2"></i>Rimuovi Filtro
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

    <!-- Lista corse-->
    <div class="mb-4 ">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="bi bi-calendar-check me-2"></i>
              Corse Effettuate ({{ corseFiltrate.length }})
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
                :codiceUtente="corsa.codiceUtente"
              />
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
