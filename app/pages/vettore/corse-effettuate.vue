<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Corsa from '../../components/Corsa.vue';

// Dati mock per corse effettuate dal vettore
const corse = [
  {
    id: 1,
    partenza: 'Via Dante 22',
    arrivo: 'Corso Como 15',
    data: new Date('2024-12-10T09:15:00'),
    stimaKm: 12.3,
    extra: ['Utente001']
  },
  {
    id: 2,
    partenza: 'Via Milano 5',
    arrivo: 'Piazza della Scala',
    data: new Date('2024-12-09T16:45:00'),
    stimaKm: 9.2,
    extra: ['Utente004']
  },
  {
    id: 3,
    partenza: 'Corso Buenos Aires 20',
    arrivo: 'Via Paolo Sarpi 8',
    data: new Date('2024-12-08T11:30:00'),
    stimaKm: 15.7,
    extra: ['Utente002']
  },
  {
    id: 4,
    partenza: 'Via Garibaldi 78',
    arrivo: 'Corso Italia 45',
    data: new Date('2024-12-07T14:20:00'),
    stimaKm: 8.9,
    extra: ['Utente001']
  },
  {
    id: 5,
    partenza: 'Piazza Duomo',
    arrivo: 'Via Roma 123',
    data: new Date('2024-12-06T10:00:00'),
    stimaKm: 11.5,
    extra: ['Utente004']
  }
];

// Filtri di ricerca e ordinamento
const sortBy = ref('data-desc'); // 'data-desc', 'data-asc'
const dateFrom = ref('');
const dateTo = ref('');

const corseFiltrate = computed(() => {
  let filtered = corse.filter(corsa => {
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

// Statistiche calcolate
const statistiche = computed(() => {
  const corseEffettuate = corseFiltrate.value;
  return {
    totaleCorse: corseEffettuate.length,
    chilometriTotali: corseEffettuate.reduce((sum, corsa) => sum + corsa.stimaKm, 0),
    utentiServiti: new Set(corseEffettuate.flatMap(corsa => corsa.extra)).size
  };
});
</script>

<template>
  <HomeLayout role="vettore">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4 ">
        <h1>Corse Effettuate</h1>
        <!-- Statistiche rapide -->
        <div class="row mb-4">
          <div class="col-md-4 mb-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <div class="fs-2 fw-bold text-success mb-2">{{ statistiche.totaleCorse }}</div>
                <div class="text-muted small">Corse Completate</div>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <div class="fs-2 fw-bold text-primary mb-2">{{ statistiche.chilometriTotali.toFixed(1) }}</div>
                <div class="text-muted small">Km Percorsi</div>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <div class="fs-2 fw-bold text-info mb-2">{{ statistiche.utentiServiti }}</div>
                <div class="text-muted small">Utenti Serviti</div>
              </div>
            </div>
          </div>
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

        <!-- Lista corse  -->
        <div class="mb-4">
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
                :extra="corsa.extra"
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
