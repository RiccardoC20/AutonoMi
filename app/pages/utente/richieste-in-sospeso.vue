<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Corsa from '../../components/CorsaPrenotataVettore.vue';
import { ref, computed, onMounted } from 'vue';
import type { RichiestaCorsaType } from '~~/composables/dataType';

// Stato delle corse
const corse = ref<RichiestaCorsaType[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Filtri di ricerca e ordinamento
const sortBy = ref('data-desc'); // 'data-desc', 'data-asc'
const dateFrom = ref('');
const dateTo = ref('');

// Funzione per caricare le corse dal backend
const caricaCorse = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Ottieni token JWT da localStorage
    const token = localStorage.getItem('auth_token');
    if (!token) {
      error.value = 'Devi effettuare il login per visualizzare le corse';
      loading.value = false;
      return;
    }

    // Chiamata API per ottenere le corse
    const response = await $fetch<{
      success: boolean;
      data: RichiestaCorsaType[];
      count: number;
    }>('/api/richieste-corsa/utente/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.success) {
      corse.value = response.data;
    } else {
      error.value = 'Errore nel caricamento delle corse';
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Errore durante il caricamento delle corse';
    console.error('Errore caricamento corse:', err);
  } finally {
    loading.value = false;
  }
};


// Carica le corse al mount del componente
onMounted(() => {
  caricaCorse();
});
</script>

<template>
  <HomeLayout role="utente">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1>Richieste corse</h1>

        <!-- Messaggio di errore -->
        <div
          v-if="error"
          class="alert alert-danger alert-dismissible fade show mb-4"
          role="alert"
        >
          {{ error }}
          <button
            type="button"
            class="btn-close"
            @click="error = null"
            aria-label="Close"
          ></button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Caricamento...</span>
          </div>
          <p class="mt-3 text-muted">Caricamento corse...</p>
        </div>

        <!-- Informazioni aggiuntive -->
        <div class="card mt-3 mb-3 p-3 color-background">
            <div >
              <p class="mb-0 small text-center text-muted" style="padding: 0;">
                In questa pagina visualizzi tutte le richieste di corsa, da te create, ancora in sospeso. Starà al vettore approvarle o no.
              </p>
            </div>
        </div>

        <!-- Lista richieste corse -->
        <div v-if="!loading" class="mb-4">
          <div class="card h-100">
            <div class="card-header">
              <h5 class="card-title mb-0">
                <i class="bi bi-calendar-check me-2"></i>
                Richieste in sospeso ({{ corse.length }})
              </h5>
            </div>
            <div class="card-body">
              <div v-if="corse.length === 0" class="text-center py-4">
                <i class="bi bi-calendar-x text-muted fs-1 mb-2"></i>
                <p class="text-muted">Nessuna corsa prenotata</p>
              </div>
              <div v-else class="d-flex flex-column gap-3">
                <RichiestaCorsa
                  v-for="corsa in corse"
                  :key="corsa._id"
                  :partenza="corsa.partenza"
                  :arrivo="corsa.arrivo"
                  :data="corsa.data"
                  :km="corsa.km"
                  :nomeVettore="corsa.codiceVettore"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   
  </HomeLayout>
</template>

