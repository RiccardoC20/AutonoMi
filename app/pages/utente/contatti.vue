<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import { type VettoreType , type ComuneType} from '~~/composables/dataType';

const error = ref<string | null>(null);
const vettori = ref<VettoreType[]>([]);


// Carica dati iniziali
const getVettori = async () => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    error.value = "Token non trovato. Effettua il login.";
    return;
  }

  error.value = null;

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
// Carica dati 
onMounted(() => {
  getVettori();
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

        
        <!-- Lista Vettori -->
        <div class="card mt-3">
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
                class="list-group-item d-flex justify-content-between align-items-center m-1"
              >
                <div class="col">
                  <h6 class="mb-1">
                    {{ vettore.nome }}
                  </h6>
                </div>
                <div class="col">
                  <a  class="text-decoration-none" >
                    <i class="bi bi-telephone-fill me-2 text-primary"></i>
                    {{ vettore.numeroTelefono }}
                  </a>
                </div>
                <div class="col-3">
                  <a  class="text-decoration-none" >
                    <i class="bi bi-envelope-fill me-2 "></i>
                    {{ vettore.email }}
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
