<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import { type Corsa, type User } from '../../../composables/useAuth';

// Interfaccia per Corsa temporanea


const error = ref<string | null>(null);
const user = ref<User | null>(null);
const corseEffettuate = ref<Corsa[]>([]);
const loading = ref(false);

// Filtri di ricerca
const searchTerm = ref('');
const sortBy = ref('data'); // 'data', 'costo', 'valutazione', 'km'

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

// Carica dati utente
const getUser = async () => {
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
      user: User;
    }>('/api/utente/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      user.value = response.user;
      
      // Carica corse effettuate
      await getCorseEffettuate(token);
    } else {
      error.value = "Errore durante il caricamento dei dati dell'utente";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento dei dati dell'utente";
    console.error('Errore getUser:', err);
  } finally {
    loading.value = false;
  }
};

const corseFiltrate = computed(() => {
  let filtered = corseEffettuate.value.filter(corsa => {
    const searchLower = searchTerm.value.toLowerCase();
    const matchesSearch = corsa.partenza.toLowerCase().includes(searchLower) ||
                         corsa.arrivo.toLowerCase().includes(searchLower) ||
                         (corsa.codiceVettore && corsa.codiceVettore.toLowerCase().includes(searchLower)) ||
                         (corsa.nomeVettore && corsa.nomeVettore.toLowerCase().includes(searchLower)) ||
                         (corsa.prezzo && corsa.prezzo.toString().includes(searchLower));

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
    chilometriTotali: corse.reduce((sum, corsa) => sum + (corsa.kmEffettivi || corsa.stimaKm), 0),
    costoTotale: corse.reduce((sum, corsa) => sum + (corsa.prezzo || 0), 0)
  };
});

// Carica dati al mount
onMounted(() => {
  getUser();
});
</script>

<template>
  <HomeLayout role="utente" >
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-3 p-md-4">
          <h1>Corse Effettuate</h1>

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
          <!-- Statistiche riepilogative -->
          <div class="row mb-3 mb-md-4">
            <div class="col-12 col-sm-6 col-md-3 mb-3">
              <div class="card text-center h-100">
                <div class="card-body">
                  <div class="fs-2 fw-bold text-primary mb-2">{{ statistiche.totaleCorse }}</div>
                  <div class="text-muted small">Corse Totali</div>
                </div>
              </div>
            </div>  
            <div class="col-12 col-sm-6 col-md-3 mb-3">
              <div class="card text-center h-100">
                <div class="card-body">
                  <div class="fs-2 fw-bold text-success mb-2">{{ statistiche.chilometriTotali.toFixed(1) }}</div>
                  <div class="text-muted small">Km Percorsi</div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6 col-md-3 mb-3">
              <div class="card text-center h-100">
                <div class="card-body">
                  <div class="fs-2 fw-bold text-info mb-2">€{{ statistiche.costoTotale.toFixed(2) }}</div>
                  <div class="text-muted small">Costo Totale</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Controlli di ricerca e ordinamento -->
          <div class="card mb-3 mb-md-4">
            <div class="card-body">
              <div class="row g-3">
                <div class="col-12 col-md-8">
                  <input
                    v-model="searchTerm"
                    type="text"
                    class="form-control"
                    placeholder="Cerca per partenza, arrivo o vettore..."
                  >
                </div>
                <div class="col-12 col-md-4">
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
          <div class="mb-3 mb-md-4">
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
                  :kmEffettivi="corsa.kmEffettivi"
                  :prezzo="corsa.prezzo"
                  :codiceVettore="corsa.codiceVettore"
                  :nomeVettore="corsa.nomeVettore"
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
    max-width: 1500px;
    width: 100%;
  }
  </style>
  