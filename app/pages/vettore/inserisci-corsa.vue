<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';

// Dati del form
const formData = ref({
  codiceUtente: '',
  partenza: '',
  arrivo: '',
  data: '',
  ora: ''
});

const isLoading = ref(false);
const message = ref('');

// Funzione per prenotare una corsa per conto dell'utente
const prenotaPerUtente = async () => {
  // Validazione base
  if (!formData.value.codiceUtente || !formData.value.partenza || !formData.value.arrivo || !formData.value.data || !formData.value.ora) {
    message.value = 'Compila tutti i campi obbligatori';
    return;
  }

  // Ottieni token e dati vettore da localStorage
  const token = localStorage.getItem('auth_token');
  const userDataStr = localStorage.getItem('user_data');
  
  if (!token || !userDataStr) {
    message.value = "Devi effettuare il login come vettore per prenotare a nome di un utente";
    return;
  }

  let userData;
  try {
    userData = JSON.parse(userDataStr);
  } catch (e) {
    message.value = 'Errore nel caricamento dei dati vettore. Effettua nuovamente il login.';
    return;
  }

  if (!userData.codiceVettore) {
    message.value = 'Codice vettore non trovato. Effettua nuovamente il login.';
    return;
  }

  isLoading.value = true;
  message.value = '';

  try {
    // Chiamata API
    const km = (Math.random() * 11 + 5).toFixed(1)
    const fullDate = new Date(`${formData.value.data}T${formData.value.ora}`)
    console.log("FULL DATE: ", fullDate)
    const response = await $fetch<{
      success: boolean;
      message: string;
      richiestaCorsa: any;
    }>('/api/corse/vettore/crea', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        codiceUtente: formData.value.codiceUtente.trim(),
        codiceVettore: userData.codiceVettore,
        partenza: formData.value.partenza.trim(),
        arrivo: formData.value.arrivo.trim(),
        data: fullDate,
        km: km
      }
    });

    if (response.success) {
      message.value = 'Prenotazione creata con successo!';

      // Reset form
      formData.value = {
        codiceUtente: '',
        partenza: '',
        arrivo: '',
        data: '',
        ora: ''
      };
    } else {
      message.value = response.message || 'Errore durante la creazione della prenotazione. Riprova.';
    }
  } catch (error: any) {
    message.value = error.data?.message || 'Errore durante la creazione della prenotazione. Riprova.';
    console.error('Errore prenotazione per utente:', error);
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
  <HomeLayout role="vettore">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <h1>Prenota per utente</h1>
        <!-- Informazioni aggiuntive -->
        <div class="card mt-3 mb-3 p-3" style="background-color:  var(--color-background)">
            <div >
              <p class="mb-0 small text-center text-muted" style="padding: 0;">
                Prenotazione in chiamata della corsa di un utente. 
              </p>
            </div>
        </div>
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

            <form @submit.prevent="prenotaPerUtente">
              <!-- Campo Codice Utente -->
              <div class="mb-3">
                <label for="codiceUtente" class="form-label fw-bold">
                  <i class="bi bi-person-lines-fill text-warning me-1"></i>
                  Codice Utente *
                </label>
                <input
                  id="codiceUtente"
                  v-model="formData.codiceUtente"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Inserisci il codice utente"
                  required
                >
                <div class="form-text">
                  Inserisci il codice dell'utente per cui prenoti
                </div>
              </div>

              <!-- Campo Partenza -->
              <div class="mb-3">
                <label for="partenza" class="form-label fw-bold">
                  <i class="bi bi-house-door text-warning me-1"></i>
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
                  <i class="bi bi-flag text-warning me-1"></i>
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
                  <i class="bi bi-calendar-event text-warning me-1"></i>
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
                  class="btn btn-vettore btn-lg"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  {{ isLoading ? 'Creazione in corso...' : 'Prenota per Utente' }}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </HomeLayout>
</template>

<style>
.btn-vettore{
  --bs-btn-bg: var(--color-vettore-button);

  --bs-btn-hover-bg: var(--color-vettore-button-hover);
}

</style>