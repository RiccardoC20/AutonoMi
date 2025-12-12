<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';

// Vettori disponibili mock
const vettoriDisponibili = [
  { id: 1, nome: 'Mario Rossi Trasporti' },
  { id: 2, nome: 'Laura Bianchi Delivery' },
  { id: 3, nome: 'Giuseppe Verdi Logistics' },
  { id: 4, nome: 'Anna Neri Transport' },
  { id: 5, nome: 'Luca Gallo Express' }
];

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

// Funzione per prenotare una corsa
const prenotaCorsa = async () => {
  // Validazione base
  if (!formData.value.vettore || !formData.value.partenza || !formData.value.arrivo || !formData.value.data || !formData.value.ora) {
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

    message.value = 'Prenotazione effettuata con successo!';

    // Reset form
    formData.value = {
      vettore: '',
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
                  Vettore *
                </label>
                <select
                  id="vettore"
                  v-model="formData.vettore"
                  class="form-select form-select-lg"
                  required
                >
                  <option value="" disabled>Seleziona un vettore</option>
                  <option
                    v-for="vettore in vettoriDisponibili"
                    :key="vettore.id"
                    :value="vettore.id"
                  >
                    {{ vettore.nome }}
                  </option>
                </select>
                <div class="form-text">
                  Scegli il vettore per la tua corsa
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
