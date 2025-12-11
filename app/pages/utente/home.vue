<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Corsa from '../../components/Corsa.vue';

// Dati dell'utente
const chilometriTotali = 1000;
const chilometriUtilizzati = 750;
const chilometriRimanenti = chilometriTotali - chilometriUtilizzati;

// Dati mock per corse prenotate
const corsePrenotate = [
  {
    id: 1,
    partenza: 'Via Roma 123',
    arrivo: 'Corso Italia 45',
    data: new Date('2024-12-15T10:30:00'),
    stimaKm: 8.5,
    extra: [ 'Vettore1' ]
  },
  {
    id: 2,
    partenza: 'Piazza Duomo',
    arrivo: 'Via Garibaldi 78',
    data: new Date('2024-12-16T14:20:00'),
    stimaKm: 6.8,
    extra: [ 'Vettore2' ]
  }
];

// Dati mock per corse effettuate
const corseEffettuate = [
  {
    id: 1,
    partenza: 'Via Dante 22',
    arrivo: 'Corso Como 15',
    data: new Date('2024-12-10T09:15:00'),
    stimaKm: 12.3,
    extra: [ 'Vettore1' ]
  },
  {
    id: 2,
    partenza: 'Via Milano 5',
    arrivo: 'Piazza della Scala',
    data: new Date('2024-12-09T16:45:00'),
    stimaKm: 9.2,
    extra: [ 'Vettore3' ]
  },
  {
    id: 3,
    partenza: 'Corso Buenos Aires 20',
    arrivo: 'Via Paolo Sarpi 8',
    data: new Date('2024-12-08T11:30:00'),
    stimaKm: 15.7,
    extra: [ 'Vettore2' ]
  }
];

// Calcola chilometri utilizzati dalle corse effettuate
const chilometriDaCorseEffettuate = corseEffettuate.reduce((total, corsa) => total + corsa.stimaKm, 0);
</script>

<template>
  <HomeLayout role="utente">
    <div class="row">

    <!-- Sezione chilometri e grafico -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
              <i class="bi bi-speedometer2 me-2"></i>
              Chilometraggio
            </h5>
            <div class="text-end">
              <div class="fs-4 fw-bold text-primary">{{ chilometriRimanenti}} km</div>
              <small class="text-muted">Rimanenti su {{ chilometriTotali }} km totali</small>
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
                  :style="{ width: (chilometriUtilizzati / chilometriTotali * 100) + '%' }"
                >
                </div>
                <div
                  class="progress-bar bg-light text-dark"
                  :style="{ width: (chilometriRimanenti / chilometriTotali * 100) + '%' }"
                >
                </div>
              </div>
            </div>

            <!-- Statistiche aggiuntive -->
            <div class="row text-center mt-4">
              <div class="col-md-3">
                <div class="border rounded p-3">
                  <div class="fs-4 fw-bold text-success">{{ chilometriDaCorseEffettuate.toFixed(1) }}</div>
                  <small class="text-muted">Km da corse effettuate</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="border rounded p-3">
                  <div class="fs-4 fw-bold text-info">{{ corseEffettuate.length }}</div>
                  <small class="text-muted">Corse completate</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="border rounded p-3">
                  <div class="fs-4 fw-bold text-warning">{{ corsePrenotate.length }}</div>
                  <small class="text-muted">Corse prenotate</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="border rounded p-3">
                  <div class="fs-4 fw-bold text-primary">{{ ((chilometriUtilizzati / chilometriTotali) * 100).toFixed(1) }}%</div>
                  <small class="text-muted">Utilizzo chilometri</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <!-- Lista corse prenotate -->
      <div class="col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="bi bi-calendar-check me-2"></i>
              Corse Prenotate ({{ corsePrenotate.length }})
            </h5>
          </div>
          <div class="card-body">
            <div v-if="corsePrenotate.length === 0" class="text-center py-4">
              <i class="bi bi-calendar-x text-muted fs-1 mb-2"></i>
              <p class="text-muted">Nessuna corsa prenotata</p>
            </div>
            <div v-else class="d-flex flex-column gap-3">
              <Corsa
                v-for="corsa in corsePrenotate"
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

      <!-- Lista corse effettuate -->
      <div class="col-md-6 mb-4">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="bi bi-check-circle me-2"></i>
              Corse Effettuate ({{ corseEffettuate.length }})
            </h5>
          </div>
          <div class="card-body">
            <div v-if="corseEffettuate.length === 0" class="text-center py-4">
              <i class="bi bi-car-front text-muted fs-1 mb-2"></i>
              <p class="text-muted">Nessuna corsa effettuata</p>
            </div>
            <div v-else class="d-flex flex-column gap-3">
              <Corsa
                v-for="corsa in corseEffettuate"
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


  </HomeLayout>
</template>

