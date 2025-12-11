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
    costoReale: 18.45,
    extra: ['Vettore1'],
    valutazione: 5,
    commenti: 'Ottimo servizio!'
  },
  {
    id: 2,
    partenza: 'Via Milano 5',
    arrivo: 'Piazza della Scala',
    data: new Date('2024-12-09T16:45:00'),
    stimaKm: 9.2,
    costoReale: 13.80,
    extra: ['Vettore3'],
    valutazione: 4,
    commenti: 'Vettore puntuale'
  },
  {
    id: 3,
    partenza: 'Corso Buenos Aires 20',
    arrivo: 'Via Paolo Sarpi 8',
    data: new Date('2024-12-08T11:30:00'),
    stimaKm: 15.7,
    costoReale: 23.55,
    extra: ['Vettore2'],
    valutazione: 5,
    commenti: 'Esperienza eccellente'
  },
  {
    id: 4,
    partenza: 'Via Garibaldi 78',
    arrivo: 'Corso Italia 45',
    data: new Date('2024-12-07T14:20:00'),
    stimaKm: 8.9,
    costoReale: 13.35,
    extra: ['Vettore1'],
    valutazione: 4,
    commenti: 'Buon servizio'
  },
  {
    id: 5,
    partenza: 'Piazza Duomo',
    arrivo: 'Via Roma 123',
    data: new Date('2024-12-06T10:00:00'),
    stimaKm: 11.5,
    costoReale: 17.25,
    extra: ['Vettore3'],
    valutazione: 5,
    commenti: 'Perfetto!'
  },
  {
    id: 6,
    partenza: 'Via Paolo Sarpi 8',
    arrivo: 'Corso Buenos Aires 20',
    data: new Date('2024-12-05T18:30:00'),
    stimaKm: 15.7,
    costoReale: 23.55,
    extra: ['Vettore2']
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
      case 'costo':
        return b.costoReale - a.costoReale;
      case 'valutazione':
        return b.valutazione - a.valutazione;
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
    costoTotale: corse.reduce((sum, corsa) => sum + corsa.costoReale, 0),
    valutazioneMedia: corse.length > 0 ? corse.reduce((sum, corsa) => sum + corsa.valutazione, 0) / corse.length : 0
  };
});
</script>

<template>
  <HomeLayout role="utente" page-title="Corse Effettuate">
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
      <div class="col-md-3 mb-3">
        <div class="card text-center h-100">
          <div class="card-body">
            <div class="fs-2 fw-bold text-warning mb-2">
              <i class="bi bi-star-fill me-1"></i>{{ statistiche.valutazioneMedia.toFixed(1) }}
            </div>
            <div class="text-muted small">Valutazione Media</div>
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
              <option value="valutazione">Ordina per Valutazione ↓</option>
              <option value="km">Ordina per Km ↓</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista corse effettuate -->
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <i class="bi bi-check-circle me-2"></i>
          Storico Corse ({{ corseFiltrate.length }})
        </h5>
      </div>
      <div class="card-body">
        <div v-if="corseFiltrate.length === 0" class="text-center py-5">
          <i class="bi bi-search text-muted fs-1 mb-2"></i>
          <p class="text-muted">Nessuna corsa trovata con i filtri selezionati</p>
        </div>

        <div v-else class="row g-3">
          <div v-for="corsa in corseFiltrate" :key="corsa.id" class="col-12">
            <!-- Card estesa per corsa con dettagli aggiuntivi -->
            <div class="card border-success">
              <div class="card-body p-3">
                <div class="row align-items-center">
                  <!-- Informazioni principali della corsa -->
                  <div class="col-md-8">
                    <div class="d-flex align-items-center gap-3 mb-2">
                      <div class="text-truncate fw-bold" style="width: 10rem;">
                        <i class="bi bi-house-door-fill me-1"></i>
                        {{ corsa.partenza }}
                      </div>
                      <div class="text-truncate fw-bold" style="width: 10rem;">
                        <i class="bi bi-flag-fill me-1"></i>
                        {{ corsa.arrivo }}
                      </div>
                      <div class="text-truncate" style="width: 8rem;">
                        <i class="bi bi-calendar-event me-1"></i>
                        {{ corsa.data.toLocaleDateString() }}
                      </div>
                      <div class="text-truncate" style="width: 6rem;">
                        <i class="bi bi-clock me-1"></i>
                        {{ corsa.data.toLocaleTimeString() }}
                      </div>
                    </div>

                    <div class="d-flex align-items-center gap-3">
                      <div class="fw-bold text-primary">
                        {{ corsa.stimaKm }} km
                      </div>
                      <div class="fw-bold text-info">
                        €{{ corsa.costoReale.toFixed(2) }}
                      </div>
                      <div class="d-flex">
                        <span v-for="e in corsa.extra" class="badge bg-secondary me-1">
                          {{ e }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Valutazione e commenti -->
                  <div class="col-md-4">
                    <div class="text-end">
                      <div class="mb-1">
                        <span v-for="star in 5" :key="star" class="text-warning">
                          <i :class="star <= corsa.valutazione ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                        </span>
                        <span class="ms-2 fw-bold">{{ corsa.valutazione }}/5</span>
                      </div>
                      <small class="text-muted">{{ corsa.commenti }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </HomeLayout>
</template>
