<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Corsa from '../../components/Corsa.vue';

// Dati mock per corse effettuate
const corseEffettuate = [
  {
    id: 1,
    partenza: 'Via Dante 22',
    arrivo: 'Corso Como 15',
    data: new Date('2024-12-10T09:15:00'),
    stimaKm: 12.3,
    extra: [ '18.45€', 'Vettore1'],
  },
  {
    id: 2,
    partenza: 'Via Milano 5',
    arrivo: 'Piazza della Scala',
    data: new Date('2024-12-09T16:45:00'),
    stimaKm: 9.2,
    extra: [ '13.80€', 'Vettore3'],
  },
  {
    id: 3,
    partenza: 'Corso Buenos Aires 20',
    arrivo: 'Via Paolo Sarpi 8',
    data: new Date('2024-12-08T11:30:00'),
    stimaKm: 15.7,
    extra: [ '23.55€', 'Vettore2'],
  },
  {
    id: 4,
    partenza: 'Via Garibaldi 78',
    arrivo: 'Corso Italia 45',
    data: new Date('2024-12-07T14:20:00'),
    stimaKm: 8.9,
    extra: [ '13.35€', 'Vettore1'],
  },
  {
    id: 5,
    partenza: 'Piazza Duomo',
    arrivo: 'Via Roma 123',
    data: new Date('2024-12-06T10:00:00'),
    stimaKm: 11.5,
    extra: [ '13.35€', 'Vettore3'],
  },
  {
    id: 6,
    partenza: 'Via Paolo Sarpi 8',
    arrivo: 'Corso Buenos Aires 20',
    data: new Date('2024-12-05T18:30:00'),
    stimaKm: 15.7,
    extra: [ '23.55€', 'Vettore2']
  }
];

// Filtri di ricerca
const searchTerm = ref('');
const sortBy = ref('data'); // 'data', 'costo', 'valutazione', 'km'

const corseFiltrate = computed(() => {
  let filtered = corseEffettuate.filter(corsa => {
    const matchesSearch = corsa.partenza.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         corsa.arrivo.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         corsa.extra.some(e => e.toLowerCase().includes(searchTerm.value.toLowerCase()));

    return matchesSearch;
  });

  // Ordinamento
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'data':
        return new Date(b.data).getTime() - new Date(a.data).getTime();
      case 'km':
        return b.stimaKm - a.stimaKm;
      default:
        return 0;
    }
  });

  return filtered;
});

// Statistiche calcolate
const statistiche = computed(() => {
  const corse = corseFiltrate.value;
  return {
    totaleCorse: corse.length,
    chilometriTotali: corse.reduce((sum, corsa) => sum + corsa.stimaKm, 0),
    costoTotale: corse.reduce((sum, corsa) => sum + parseFloat(corsa.extra[0] || '0'), 0)
  };
});
</script>

<template>
  <HomeLayout role="utente" >
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1>Corse Effettuate</h1>
        <!-- Statistiche riepilogative -->
        <div class="row mb-4">
          <div class="col-md-3 mb-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <div class="fs-2 fw-bold text-primary mb-2">{{ statistiche.totaleCorse }}</div>
                <div class="text-muted small">Corse Totali</div>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <div class="fs-2 fw-bold text-success mb-2">{{ statistiche.chilometriTotali.toFixed(1) }}</div>
                <div class="text-muted small">Km Percorsi</div>
              </div>
            </div>
          </div>
          <div class="col-md-3 mb-3">
            <div class="card text-center h-100">
              <div class="card-body">
                <div class="fs-2 fw-bold text-info mb-2">€{{ statistiche.costoTotale.toFixed(2) }}</div>
                <div class="text-muted small">Costo Totale</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Controlli di ricerca e ordinamento -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row g-3">
              <div class="col-md-8">
                <input
                  v-model="searchTerm"
                  type="text"
                  class="form-control"
                  placeholder="Cerca per partenza, arrivo o vettore..."
                >
              </div>
              <div class="col-md-4">
                <select v-model="sortBy" class="form-select">
                  <option value="data">Ordina per Data ↓</option>
                  <option value="costo">Ordina per Costo ↓</option>
                  <option value="km">Ordina per Km ↓</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista corse effettuate -->
        <div class="mb-4">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="bi bi-calendar-check me-2"></i>
              Corse effettuate ({{ corseFiltrate.length }})
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
