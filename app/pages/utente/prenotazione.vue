<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';

// Dati del form
const formData = ref({
  partenza: '',
  arrivo: '',
  data: '',
  ora: ''
});

const isLoading = ref(false);
const message = ref('');

// Funzione per prenotare una corsa
const prenotaCorsa = async () => {
  // Validazione base
  if (!formData.value.partenza || !formData.value.arrivo || !formData.value.data || !formData.value.ora) {
    message.value = 'Compila tutti i campi obbligatori';
    return;
  }

  isLoading.value = true;
  message.value = '';

  try {
    // Simula chiamata API
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In produzione qui chiameresti l'API
    console.log('Prenotazione corsa:', formData.value);

    message.value = 'Prenotazione effettuata con successo! Riceverai una conferma via email.';

    // Reset form
    formData.value = {
      partenza: '',
      arrivo: '',
      data: '',
      ora: ''
    };

  } catch (error) {
    message.value = 'Errore durante la prenotazione. Riprova.';
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
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="card-title mb-0">
              <i class="bi bi-car-front me-2"></i>
              Nuova Prenotazione
            </h4>
          </div>

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

          <!-- Footer con informazioni -->
          <div class="card-footer bg-light">
            <div class="row text-center">
              <div class="col-4">
                <i class="bi bi-clock-history text-muted fs-4 mb-1"></i>
                <small class="d-block text-muted">Conferma</small>
                <small class="d-block text-muted">Immediata</small>
              </div>
              <div class="col-4">
                <i class="bi bi-shield-check text-muted fs-4 mb-1"></i>
                <small class="d-block text-muted">Vettori</small>
                <small class="d-block text-muted">Certificati</small>
              </div>
              <div class="col-4">
                <i class="bi bi-telephone text-muted fs-4 mb-1"></i>
                <small class="d-block text-muted">Supporto</small>
                <small class="d-block text-muted">24/7</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Informazioni aggiuntive -->
        <div class="card mt-4 border-info">
          <div class="card-body">
            <h6 class="card-title text-info">
              <i class="bi bi-info-circle me-2"></i>
              Informazioni Importanti
            </h6>
            <ul class="mb-0 small">
              <li>La prenotazione può essere effettuata fino a 24 ore prima</li>
              <li>Riceverai una conferma via email con i dettagli del vettore</li>
              <li>Puoi modificare o cancellare la prenotazione fino a 2 ore prima</li>
              <li>I costi verranno calcolati in base alla distanza effettiva</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </HomeLayout>
</template>
