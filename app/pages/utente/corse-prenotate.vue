<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Corsa from '../../components/Corsa.vue';

// Dati mock per corse prenotate dall'utente
const corse = [
  {
    id: 1,
    partenza: 'Via Roma 123',
    arrivo: 'Corso Italia 45',
    data: new Date('2024-12-15T10:30:00'),
    stimaKm: 8.5,
    extra: ['Vettore1']
  },
  {
    id: 2,
    partenza: 'Piazza Duomo',
    arrivo: 'Via Garibaldi 78',
    data: new Date('2024-12-16T14:20:00'),
    stimaKm: 12.3,
    extra: ['Vettore2']
  },
  {
    id: 3,
    partenza: 'Via Dante 22',
    arrivo: 'Corso Como 15',
    data: new Date('2024-12-17T09:15:00'),
    stimaKm: 6.8,
    extra: ['Vettore3']
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
  <HomeLayout role="utente">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1>Corse Prenotate</h1>

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
  