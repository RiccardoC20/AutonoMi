<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import DashboardCard from '../../components/DashboardCard.vue';

// Dati mock per le statistiche del comune
const stats = {
  abbonamentiAttivi: 245,
  ricaviAbbonamenti: 12250,
  corseEffettuate: 1847,
  costiCorse: 9235,
  chilometraggioRimanente: 1250
};
</script>

<template>
  <HomeLayout role="comune">
    <!-- Statistiche principali -->
    <div class="row mb-4">
      <div class="col-md-4 mb-3">
        <DashboardCard
          title="Abbonamenti Attivi"
          :value="stats.abbonamentiAttivi"
          icon="bi bi-card-text"
        />
      </div>
      <div class="col-md-4 mb-3">
        <DashboardCard
          title="Corse Effettuate"
          :value="stats.corseEffettuate"
          icon="bi bi-car-front"
        />
      </div>
      <div class="col-md-4 mb-3">
        <DashboardCard
          title="Chilometraggio Rimanente"
          :value="stats.chilometraggioRimanente + ' km'"
          icon="bi bi-speedometer2"
        />
      </div>
    </div>

    <!-- Statistiche costi e chilometraggio -->
    <div class="row mb-4">



    </div>

    <!-- Riepilogo finanziario -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Riepilogo Finanziario</h5>
          </div>
          <div class="card-body">
            <div class="row text-center">
              <div class="col-md-4">
                <div class="fs-4 fw-bold text-success mb-1">
                  +{{ (stats.ricaviAbbonamenti - stats.costiCorse).toFixed(2) }}€
                </div>
                <small class="text-muted">Utile Netto</small>
              </div>
              <div class="col-md-4">
                <div class="fs-4 fw-bold text-info mb-1">
                  {{ (stats.ricaviAbbonamenti / stats.abbonamentiAttivi).toFixed(2) }}€
                </div>
                <small class="text-muted">Ricavo Medio per Abbonamento</small>
              </div>
              <div class="col-md-4">
                <div class="fs-4 fw-bold text-warning mb-1">
                  {{ (stats.costiCorse / stats.corseEffettuate).toFixed(2) }}€
                </div>
                <small class="text-muted">Costo Medio per Corsa</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </HomeLayout>
</template>
