<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Corsa from '../../components/CorsaPrenotataVettore.vue';
import { type CorsaType, type RichiestaCorsaType } from '~~/composables/dataType';

const error = ref<string | null>(null);
const corse = ref<CorsaType[]>([]);
const richiesteCorsa = ref<RichiestaCorsaType[]>([]);
const loading = ref(false);


//carica corse
const loadData = async () =>{

  const token = localStorage.getItem('auth_token');
  if (!token) {
    error.value = "Token non trovato. Effettua il login.";
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    //carica corse
    const response = await $fetch<{
      success: boolean;
      data: CorsaType[];
    }>('/api/corse/comune/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      corse.value = response.data;
    } else {
      error.value = "Errore durante il caricamento delle corse";
    }

  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento dei dati";
    console.error('Errore loadData:', err);
  } finally {
    loading.value = false; 
  }

  loading.value = true;

  try {
    const response = await $fetch<{
      success: boolean;
      data: CorsaType[];
    }>('/api/richieste-corsa/comune/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.success) {
      richiesteCorsa.value = response.data;
    } else {
      error.value = "Errore durante il caricamento delle richieste";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante il caricamento dei dati";
    console.error('Errore loadRichiesteCorsa:', err);
  } finally {
    loading.value = false;
  }
  

  
};

const corseFiltrate = computed(() => {
  return {
    effettuate: corse.value.filter(c => c.effettuata === true),
    prenotate: corse.value.filter(c => c.effettuata === false)
  }
})

const corsaEffettuata = async (vettoreId: string) => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    error.value = "Token non trovato. Effettua il login.";
    return;
  }

  try {
    const response = await $fetch<{
      success: boolean;
      message: string;
    }>(`/api/utente/${vettoreId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.success) {
      // Ricarica la lista dei vettori
      await loadData();
    } else {
      error.value = "Errore durante l'eliminazione dell'utente";
    }
  } catch (err: any) {
    error.value = err.data?.message || "Errore durante l'eliminazione dell'utente";
    console.error('Errore eliminaUtente:', err);
  }
};
// Carica dati al mount
onMounted(() => {
  loadData();
});
</script>

<template>
  <HomeLayout role="comune">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1>Monitoraggio</h1>

        <!-- Messaggio di errore -->
        <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>


        <!-- Informazioni aggiuntive -->
        <div class="card mt-4 mb-3 p-3" style="background-color:  var(--color-background)">
            <div >
              <p class="mb-0 small text-center text-muted" style="padding: 0;">
                In questa pagina visualizzi tutte le richiese corse, corse prenotate e corse effettuate.
              </p>
            </div>
        </div> 

        <!-- Lista corse-->
        <div class="mb-4 mt-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-calendar-check me-2"></i>
                Tutte le corse ({{ corse.length + richiesteCorsa.length }})
              </h5>
            </div>
            <div class="card-body">
              <div v-if="corseFiltrate.effettuate.length === 0" class="text-center py-4">
                <i class="bi bi-calendar-x text-muted fs-1 mb-2"></i>
                <p class="text-muted">Nessuna corsa prenotata</p>
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <RichiestaCorsa
                  v-for="richiesta in richiesteCorsa"
                  :key="richiesta._id"
                  :partenza="richiesta.partenza"
                  :arrivo="richiesta.arrivo"
                  :data="richiesta.data"
                  :km="richiesta.km"
                  :codiceUtente="richiesta.codiceUtente"
                  :codiceVettore="richiesta.codiceVettore"
                  :status="true"
                />
                <CorsaPrenotata
                  v-for="corsa in corseFiltrate.prenotate"
                  :key="corsa._id"
                  :partenza="corsa.partenza"
                  :arrivo="corsa.arrivo"
                  :data="corsa.data"
                  :km="corsa.km"
                  :codiceUtente="corsa.codiceUtente"
                  :codiceVettore="corsa.codiceVettore"
                  :status="true"
                />
                <CorsaEffettuata
                  v-for="corsa in corseFiltrate.effettuate"
                  :key="corsa._id"
                  :partenza="corsa.partenza"
                  :arrivo="corsa.arrivo"
                  :data="corsa.data"
                  :km="corsa.km"
                  :codiceUtente="corsa.codiceUtente"
                  :codiceVettore="corsa.codiceVettore"
                  :status="true"
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
