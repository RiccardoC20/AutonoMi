<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import { useAuth, type UtenteType , type CorsaType} from '../../../composables/useAuth';


const error = ref<string | null>(null);
const user = ref<UtenteType | null>(null);
const corsePrenotate = ref<CorsaType[]>([]);
const corseEffettuate = ref<CorsaType[]>([]);
const loading = ref(false);

// Dati chilometri (default, verranno aggiornati con i dati reali)
const chilometriTotali = ref(1000);
const chilometriRimanenti = computed(() => chilometriTotali.value - chilometriUsati.value);

// Funzione per convertire stringa data in Date object
const parseDate = (date: Date | string): Date => {
  if (date instanceof Date) return date;
  return new Date(date);
};

// Carica corse prenotate
const getCorsePrenotate = async (token: string) => {
  try {
    const response = await $fetch<{
      success: boolean;
      corse: CorsaType[];
    }>('/api/corsa', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      // Converti le date da stringhe a Date objects
      corsePrenotate.value = response.corse.map(corsa => ({
        ...corsa,
        data: parseDate(corsa.data)
      }));
    } else {
      error.value = "Errore durante il caricamento delle corse prenotate";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento delle corse prenotate";
    console.error('Errore getCorsePrenotate:', err);
  }
};

// Carica corse effettuate
const getCorseEffettuate = async (token: string) => {
  try {
    const response = await $fetch<{
      success: boolean;
      corse: CorsaType[];
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
      user: UtenteType;
    }>('/api/utente/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      user.value = response.user;
      
      // Carica corse prenotate ed effettuate
      await Promise.all([
        getCorsePrenotate(token),
        getCorseEffettuate(token)
      ]);
      
      // TODO: Aggiorna chilometriTotali e chilometriUtilizzati dai dati utente
      // quando disponibili dall'API
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

// Calcola chilometri utilizzati dalle corse effettuate
const chilometriUsati = computed(() => {
  return corseEffettuate.value.reduce((total, corsa) => total + (corsa.kmEffettivi || corsa.stimaKm), 0);
});

// Carica dati al mount
onMounted(() => {
  getUser();
});
</script>

<template>
  <HomeLayout role="utente">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
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
    <div v-else class="row">

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
              <div class="fs-4 fw-bold text-primary">{{ chilometriUsati}} km</div>
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
                  :style="{ width: (chilometriUsati / chilometriTotali * 100) + '%' }"
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
                  <div class="fs-4 fw-bold text-success">{{ chilometriUsati.toFixed(1) }}</div>
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
                  <div class="fs-4 fw-bold text-primary">{{ ((chilometriUsati / chilometriTotali) * 100).toFixed(1) }}%</div>
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
                :codiceVettore="corsa.codiceVettore"
                :nomeVettore="corsa.nomeVettore"
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

