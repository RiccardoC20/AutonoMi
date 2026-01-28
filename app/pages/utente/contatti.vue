<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import { type VettoreType , type ComuneType} from '~~/composables/dataType';

const error = ref<string | null>(null);
const vettori = ref<VettoreType[]>([]);
const comune = ref<ComuneType>();
const loading = ref(false);
/*
const getComune = async (token: string) => {
  try {
    const response = await $fetch<{
      success: boolean;
      data: ComuneType;
      count: number;
    }>('/api/comune/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      comune.value = response.data;
    } else {
      error.value = "Errore durante il caricamento del comune";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento del comune";
    console.error('Errore getComune:', err);
  }
};
*/

//Carica vettori
const getVettori = async (token: string) => {
  try {
    const response = await $fetch<{
      success: boolean;
      data: VettoreType[];
      count: number;
    }>('/api/vettore/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      vettori.value = response.data;
    } else {
      error.value = "Errore durante il caricamento dei vettori";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento dei vettori";
    console.error('Errore getVettori:', err);
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
      await getVettori(token);
     // await getComune(token);

  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento dei dati";
    console.error('Errore loadData:', err);
  } finally {
    loading.value = false;
  }
};
// Carica dati 
onMounted(() => {
  loadData();
});
</script>

<template>
  <HomeLayout role="utente" >
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1>Contatti</h1>

        <!-- Messaggio di errore -->
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>

    <!-- Numero Comune 
        <div class="card mb-4">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <i class="bi bi-building text-primary fs-3 me-3"></i>
              <div>
                <h5 class="mb-1">Comune</h5>
                <a :href="`tel:${comune?.numeroTelefono?.replace(/\s/g, '')}`" class="text-decoration-none fs-5 fw-bold">
                  <i class="bi bi-telephone-fill me-2"></i>
                  {{ comune?.numeroTelefono }}
                </a>
              </div>
            </div>
          </div>
        </div>
      -->
        <!-- Separatore 
        <hr class="my-4">
        -->
        
        <!-- Lista Vettori -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="bi bi-truck me-2"></i>
              Vettori Disponibili
            </h5>
          </div>
          <div class="card-body">
            <div class="list-group list-group-flush">
              <div
                v-for="vettore in vettori"
                :key="vettore._id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 class="mb-1">{{ vettore.nome }}</h6>
                  <a :href="`tel:${vettore.numeroTelefono?.replace(/\s/g, '')}`" class="text-decoration-none">
                    <i class="bi bi-telephone-fill me-2 text-primary"></i>
                    {{ vettore.numeroTelefono }}
                  </a>
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
  max-width: 1200px;
  width: 100%;
}
</style>
