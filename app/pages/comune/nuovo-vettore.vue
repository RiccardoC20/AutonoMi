<script setup>
const nome = ref("");
const mail = ref("");
const numeroTelefono = ref("");
const indirizzo = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

async function creaVettore() {
  errorMessage.value = "";
  successMessage.value = "";
  loading.value = true;

  try {
    const { data, error } = await useFetch("/api/vettore", {
      method: "POST",
      body: {
        nome: nome.value.trim(),
        mail: mail.value.trim(),
        numeroTelefono: numeroTelefono.value.trim(),
        indirizzo: indirizzo.value.trim(),
      }
    });

    if (error.value) {
      errorMessage.value = error.value.message || "Errore nel salvataggio del vettore";
    } else {
      successMessage.value = "Vettore creato con successo!";
      // Reset form
      nome.value = "";
      mail.value = "";
      numeroTelefono.value = "";
      indirizzo.value = "";
      
      // Rimuovi il messaggio di successo dopo 5 secondi
      setTimeout(() => {
        successMessage.value = "";
      }, 5000);
    }
  } catch (err) {
    errorMessage.value = "Errore imprevisto durante il salvataggio";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h2 class="card-title mb-0">
              <i class="bi bi-plus-circle me-2"></i>
              Nuovo Vettore
            </h2>
          </div>
          <div class="card-body p-4">
            <!-- Messaggio di successo -->
            <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
              <i class="bi bi-check-circle me-2"></i>
              {{ successMessage }}
              <button type="button" class="btn-close" @click="successMessage = ''" aria-label="Close"></button>
            </div>

            <!-- Messaggio di errore -->
            <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ errorMessage }}
              <button type="button" class="btn-close" @click="errorMessage = ''" aria-label="Close"></button>
            </div>

            <form @submit.prevent="creaVettore">
              <!-- Campo Nome -->
              <div class="mb-3">
                <label for="nome" class="form-label fw-bold">
                  Nome Vettore <span class="text-danger">*</span>
                </label>
                <input
                  id="nome"
                  v-model="nome"
                  type="text"
                  class="form-control"
                  placeholder="Inserisci il nome del vettore"
                  required
                  :disabled="loading"
                />
                <div class="form-text">Nome completo del vettore di trasporto</div>
              </div>

              <!-- Campo Email -->
              <div class="mb-3">
                <label for="mail" class="form-label fw-bold">
                  Email <span class="text-danger">*</span>
                </label>
                <input
                  id="mail"
                  v-model="mail"
                  type="email"
                  class="form-control"
                  placeholder="vettore@example.com"
                  required
                  :disabled="loading"
                />
                <div class="form-text">Indirizzo email di contatto del vettore</div>
              </div>

              <!-- Campo Numero di Telefono -->
              <div class="mb-3">
                <label for="numeroTelefono" class="form-label fw-bold">
                  Numero di Telefono <span class="text-danger">*</span>
                </label>
                <input
                  id="numeroTelefono"
                  v-model="numeroTelefono"
                  type="tel"
                  class="form-control"
                  placeholder="+39 123 456 7890"
                  required
                  :disabled="loading"
                />
                <div class="form-text">Numero di telefono principale per i contatti</div>
              </div>

              <!-- Campo Indirizzo -->
              <div class="mb-4">
                <label for="indirizzo" class="form-label fw-bold">
                  Indirizzo <span class="text-danger">*</span>
                </label>
                <textarea
                  id="indirizzo"
                  v-model="indirizzo"
                  class="form-control"
                  rows="3"
                  placeholder="Via, numero civico, città, CAP"
                  required
                  :disabled="loading"
                ></textarea>
                <div class="form-text">Indirizzo completo della sede del vettore</div>
              </div>

              <!-- Bottoni -->
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="nome = ''; mail = ''; numeroTelefono = ''; indirizzo = ''; errorMessage = ''; successMessage = '';"
                  :disabled="loading"
                >
                  <i class="bi bi-x-circle me-2"></i>
                  Annulla
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading || !nome.trim() || !mail.trim() || !numeroTelefono.trim() || !indirizzo.trim()"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  <i v-else class="bi bi-check-circle me-2"></i>
                  {{ loading ? 'Salvataggio...' : 'Crea Vettore' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: none;
  border-radius: 0.5rem;
}

.card-header {
  border-radius: 0.5rem 0.5rem 0 0 !important;
}

.form-label {
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  min-width: 150px;
}

.alert {
  border-radius: 0.5rem;
}
</style>
