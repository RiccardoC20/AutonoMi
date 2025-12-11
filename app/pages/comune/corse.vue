<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Corsa from '../../components/Corsa.vue';

// Dati mock per le corse
const corse = [
  {
    id: 1,
    partenza: 'Via Roma 123',
    arrivo: 'Corso Italia 45',
    data: new Date('2024-12-10T10:30:00'),
    stimaKm: 8.5,
    extra: [
      'USR001' ,
      'V001' 
    ]
  },
  {
    id: 2,
    partenza: 'Piazza Duomo',
    arrivo: 'Via Garibaldi 78',
    data: new Date('2024-12-10T11:15:00'),
    stimaKm: 12.3,
    extra: [
       'USR002' ,
       'V002' 
    ]
  },
  {
    id: 3,
    partenza: 'Via Dante 22',
    arrivo: 'Corso Como 15',
    data: new Date('2024-12-10T14:20:00'),
    stimaKm: 6.8,
    extra: [
      'USR003' ,
       'V003'
    ]
  },
  {
    id: 4,
    partenza: 'Via Milano 5',
    arrivo: 'Piazza della Scala',
    data: new Date('2024-12-10T16:45:00'),
    stimaKm: 9.2,
    extra: [
       'USR004' ,
       'V001' 
    ]
  },
  {
    id: 5,
    partenza: 'Corso Buenos Aires 20',
    arrivo: 'Via Paolo Sarpi 8',
    data: new Date('2024-12-10T18:30:00'),
    stimaKm: 15.7,
    extra: [
       'USR005' ,
       'V004' 
    ]
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
</script>

<template>
  <HomeLayout role="comune" page-title="Monitoraggio Corse">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
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

    <!-- Lista corse usando il componente Corsa -->
    <div class="mb-4">
      <h5 class="mb-3">Corse Monitorate ({{ corseFiltrate.length }})</h5>
      <div style="width: fit-content;">
        <div class="d-flex flex-column gap-3">
          <Corsa
            v-for="corsa in corseFiltrate"
            :key="corsa.id"
            :partenza="corsa.partenza"
            :arrivo="corsa.arrivo"
            :data="corsa.data"
            :stimaKm="corsa.stimaKm"
            :extra="corsa.extra"
          />
          <div v-if="corseFiltrate.length === 0" class="text-center py-5">
            <i class="bi bi-search text-muted fs-1 mb-2"></i>
            <p class="text-muted">Nessuna corsa trovata con la ricerca effettuata</p>
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
