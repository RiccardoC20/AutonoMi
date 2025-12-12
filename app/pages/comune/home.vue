<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import DashboardCard from '../../components/DashboardCard.vue';
import { type Corsa , type User } from '../../../composables/useAuth';

// Interfaccia per Utente


const error = ref<string | null>(null);
const loading = ref(false);
const utenti = ref<User[]>([]);
const corseEffettuate = ref<Corsa[]>([]);

// Statistiche calcolate
const stats = computed(() => {
  const abbonamentiAttivi = utenti.value.length * 40;

  // Chilometraggio usato = somma dei budget degli utenti
  const chilometraggioUsato = utenti.value.reduce((sum, utente) => sum + (utente.budget || 0), 0);
  
  return {
    abbonamentiAttivi,
    corseEffettuate: corseEffettuate.value.length,
    chilometraggioUsato
  };
});

// Carica utenti
const getUtenti = async (token: string) => {
  try {
    const response = await $fetch<{
      success: boolean;
      data: User[];
      count: number;
    }>('/api/utente/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      utenti.value = response.data;
    } else {
      error.value = "Errore durante il caricamento degli utenti";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento degli utenti";
    console.error('Errore getUtenti:', err);
  }
};

// Carica corse effettuate
const getCorseEffettuate = async (token: string) => {
  try {
    const response = await $fetch<{
      success: boolean;
      corse: Corsa[];
    }>('/api/corsa', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      corseEffettuate.value = response.corse;
    } else {
      error.value = "Errore durante il caricamento delle corse effettuate";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento delle corse effettuate";
    console.error('Errore getCorseEffettuate:', err);
  }
};

// Carica dati iniziali
const loadData = async () => {
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
    // Carica utenti e corse effettuate in parallelo
    await Promise.all([
      getUtenti(token),
      getCorseEffettuate(token)
    ]);
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento dei dati";
    console.error('Errore loadData:', err);
  } finally {
    loading.value = false;
  }
};

// Carica dati al mount
onMounted(() => {
  loadData();
});
</script>

<template>
  <HomeLayout role="comune">
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
      <p class="mt-2 text-muted">Caricamento statistiche...</p>
    </div>

    <!-- Contenuto principale -->
    <div v-else>
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
            title="Chilometraggio Usato"
            :value="stats.chilometraggioUsato + ' km'"
            icon="bi bi-speedometer2"
          />
        </div>
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
                <div class="col-md-6">
                  <div class="fs-4 fw-bold text-success mb-1">
                    {{ stats.abbonamentiAttivi }}€
                  </div>
                  <small class="text-muted">Ricavi Abbonamenti</small>
                </div>
                <div class="col-md-6">
                  <div class="fs-4 fw-bold text-info mb-1">
                    40€
                  </div>
                  <small class="text-muted">Ricavo per Abbonamento</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </HomeLayout>
</template>
  