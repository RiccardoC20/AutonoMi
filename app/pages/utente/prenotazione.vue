<script setup lang="ts">
import type { VettoreType } from '~~/composables/dataType';
import HomeLayout from '../../components/HomeLayout.vue';

// Dati del form
const formData = ref({
  vettore: '',
  partenza: '',
  arrivo: '',
  data: '',
  ora: ''
});

const isLoading = ref(false);
const message = ref('');
const vettori = ref<VettoreType[]>([]);
const loadingVettori = ref(false);

// Carica i vettori al mount del componente
onMounted(async () => {
  await caricaVettori();
});

// Funzione per caricare i vettori
const caricaVettori = async () => {
  loadingVettori.value = true;
  try {
    const token = localStorage.getItem('auth_token');
    const response = await $fetch<{
      success: boolean;
      data: VettoreType[];
    }>('/api/vettore/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });


    if (response.success) {
      vettori.value = response.data;
    }
  } catch (error) {
    console.error('Errore caricamento vettori:', error);
  } finally {
    loadingVettori.value = false;
  }
};

// Funzione per prenotare una corsa
const prenotaCorsa = async () => {
  // Validazione base
  if (!formData.value.vettore || !formData.value.partenza || !formData.value.arrivo || !formData.value.data || !formData.value.ora) {
    message.value = 'Compila tutti i campi obbligatori';
    return;
  }

  // Ottieni token e userData da localStorage
  const token = localStorage.getItem('auth_token');
  const userDataStr = localStorage.getItem('user_data');
  
  if (!token || !userDataStr) {
    message.value = 'Devi effettuare il login per prenotare una corsa';
    return;
  }

  let userData;
  try {
    userData = JSON.parse(userDataStr);
  } catch (e) {
    message.value = 'Errore nel caricamento dei dati utente. Effettua nuovamente il login.';
    return;
  }

  if (!userData.codiceUtente) {
    message.value = 'Codice utente non trovato. Effettua nuovamente il login.';
    return;
  }

  isLoading.value = true;
  message.value = '';

  try {
    // Chiamata API reale
    const response = await $fetch<{
      success: boolean;
      message: string;
      richiestaCorsa: any;
    }>('/api/richieste-corsa/utente/crea', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        codiceUtente: userData.codiceUtente,
        codiceVettore: parseInt(formData.value.vettore),
        partenza: formData.value.partenza.trim(),
        arrivo: formData.value.arrivo.trim(),
        data: formData.value.data,
        orario: formData.value.ora
      }
    });

    if (response.success) {
      message.value = 'Prenotazione effettuata con successo!';

      // Reset form
      formData.value = {
        vettore: '',
        partenza: '',
        arrivo: '',
        data: '',
        ora: ''
      };
    } else {
      message.value = 'Errore durante la prenotazione. Riprova.';
    }
  } catch (error: any) {
    message.value = error.data?.message || 'Errore durante la prenotazione. Riprova.';
    console.error('Errore prenotazione:', error);
  } finally {
    isLoading.value = false;
  }
};

// Funzione per ottenere la data minima (oggi)
const getMinDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Funzione per ottenere l'ora minima (se oggi, ora attuale)
const getMinTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
</script>

<template>
  <HomeLayout role="utente" >
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <h1>Nuova Prenotazione</h1>
        <div class="card shadow">

          <div class="card-body">
            <!-- Messaggio di stato -->
            <div v-if="message" :class="[
              'alert mb-4',
              message.includes('successo') ? 'alert-success' : 'alert-danger'
            ]" role="alert">
              <i :class="[
                'bi me-2',
                message.includes('successo') ? 'bi-check-circle' : 'bi-exclamation-triangle'
              ]"></i>
              {{ message }}
            </div>

            <form @submit.prevent="prenotaCorsa">
              <!-- Campo Vettore -->
              <div class="mb-3">
                <label for="vettore" class="form-label fw-bold">
                  <i class="bi bi-truck text-primary me-1"></i>
                  Codice Vettore *
                </label>
                <select 
                  id="vettore"
                  v-model="formData.vettore" 
                  class="form-select" 
                  :disabled="loadingVettori"
                  required
                >
                  <option value="">{{ loadingVettori ? 'Caricamento...' : 'Seleziona un vettore' }}</option>
                  <option v-for="vettore in vettori" :key="vettore.codiceVettore" :value="vettore.codiceVettore">
                    {{ vettore.nome }}
                  </option>
                </select>
                <div class="form-text">
                  Inserisci il codice del vettore per la tua corsa
                </div>
              </div>

              <!-- Campo Partenza -->
              <div class="mb-3">
                <label for="partenza" class="form-label fw-bold">
                  <i class="bi bi-house-door text-primary me-1"></i>
                  Partenza *
                </label>
                <input
                  id="partenza"
                  v-model="formData.partenza"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Inserisci l'indirizzo di partenza"
                  required
                >
                <div class="form-text">
                  Es: Via Roma 123, Milano
                </div>
              </div>

              <!-- Campo Arrivo -->
              <div class="mb-3">
                <label for="arrivo" class="form-label fw-bold">
                  <i class="bi bi-flag text-success me-1"></i>
                  Arrivo *
                </label>
                <input
                  id="arrivo"
                  v-model="formData.arrivo"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Inserisci l'indirizzo di arrivo"
                  required
                >
                <div class="form-text">
                  Es: Corso Italia 45, Milano
                </div>
              </div>

              <!-- Campo Data -->
              <div class="mb-3">
                <label for="data" class="form-label fw-bold">
                  <i class="bi bi-calendar-event text-info me-1"></i>
                  Data *
                </label>
                <input
                  id="data"
                  v-model="formData.data"
                  type="date"
                  class="form-control form-control-lg"
                  :min="getMinDate()"
                  required
                >
                <div class="form-text">
                  Seleziona una data futura
                </div>
              </div>

              <!-- Campo Ora -->
              <div class="mb-4">
                <label for="ora" class="form-label fw-bold">
                  <i class="bi bi-clock text-warning me-1"></i>
                  Ora *
                </label>
                <input
                  id="ora"
                  v-model="formData.ora"
                  type="time"
                  class="form-control form-control-lg"
                  :min="formData.data === getMinDate() ? getMinTime() : undefined"
                  required
                >
                <div class="form-text">
                  Orario desiderato per il ritiro
                </div>
              </div>

              <!-- Pulsante di invio -->
              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-primary btn-lg"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  {{ isLoading ? 'Prenotazione in corso...' : 'Prenota Corsa' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Informazioni aggiuntive -->
        <div class="card mt-3 border-info">
          <div class="card-body p-2" data-bs-toggle="collapse" data-bs-target="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
            <small class="text-info fw-bold">
              <i class="bi bi-info-circle me-1"></i>
              Informazioni Importanti
            </small>
          </div>

          <div class="collapse" id="collapseExample">
            <div class="card-footer p-2">
              <ul class="mb-0 small">
                <li>La prenotazione può essere effettuata fino a 24 ore prima</li>
                <li>Riceverai una conferma via email con i dettagli del vettore</li>
                <li>I costi verranno calcolati in base alla distanza effettiva</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  </HomeLayout>
</template>
