<script setup lang="ts">
import { ref } from 'vue';

const nome = ref('');
const cognome = ref('');
const email = ref('');
const dataNascita = ref('');
const cellulare = ref('');
const codiceFiscale = ref('');
const pdfFile = ref<File | null>(null);
const pdfFileName = ref('');
const isDragging = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

// Gestione drag and drop
function handleDragOver(event: DragEvent) {
  event.preventDefault();
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0 && files[0]) {
    handleFileSelect(files[0]);
  }
}

function handleFileSelect(file: File) {
  if (file.type !== 'application/pdf') {
    error.value = 'Il file deve essere un PDF';
    return;
  }

  pdfFile.value = file;
  pdfFileName.value = file.name;
  error.value = null;
}

function handleFileInput(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0 && target.files[0]) {
    handleFileSelect(target.files[0]);
  }
}

function removeFile() {
  pdfFile.value = null;
  pdfFileName.value = '';
}

async function handleSubmit() {
  error.value = null;
  success.value = false;

  // Validazione
  if (!nome.value.trim() || !cognome.value.trim() || !email.value.trim() || 
      !dataNascita.value || !cellulare.value.trim() || !codiceFiscale.value.trim()) {
    error.value = 'Tutti i campi sono obbligatori';
    return;
  }

  if (!pdfFile.value) {
    error.value = 'Il file PDF è obbligatorio';
    return;
  }

  loading.value = true;

  try {
    // Crea FormData per multipart/form-data
    const formData = new FormData();
    formData.append('nome', nome.value.trim());
    formData.append('cognome', cognome.value.trim());
    formData.append('email', email.value.trim());
    formData.append('dataNascita', dataNascita.value);
    formData.append('cellulare', cellulare.value.trim());
    formData.append('codiceFiscale', codiceFiscale.value.trim());
    formData.append('pdf', pdfFile.value);

    const response = await fetch('/api/candidatura/invia', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Errore durante l\'invio della candidatura');
    }

    if (data.success) {
      success.value = true;
      // Reset form
      nome.value = '';
      cognome.value = '';
      email.value = '';
      dataNascita.value = '';
      cellulare.value = '';
      codiceFiscale.value = '';
      pdfFile.value = null;
      pdfFileName.value = '';
    }
  } catch (err: any) {
    error.value = err.message || 'Errore durante l\'invio della candidatura';
    console.error('Errore invio candidatura:', err);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <!-- Alert di successo -->
  <div
    v-if="success"
    class="alert alert-success alert-dismissible fade show fixed-alert"
    role="alert"
  >
    <i class="bi bi-check-circle-fill me-2"></i>
    <strong>Successo!</strong> Candidatura inviata con successo!
    <button
      type="button"
      class="btn-close"
      @click="success = false"
      aria-label="Close"
    ></button>
  </div>

  <!-- Alert di errore -->
  <div
    v-if="error"
    class="alert alert-danger alert-dismissible fade show fixed-alert"
    role="alert"
  >
    <i class="bi bi-exclamation-triangle-fill me-2"></i>
    <strong>Errore!</strong> {{ error }}
    <button
      type="button"
      class="btn-close"
      @click="error = null"
      aria-label="Close"
    ></button>
  </div>

  <div class="container my-5 page-background">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card shadow-sm">
          <div class="form-element card-header text-white text-center">
            <h2 class="h4 mb-0">Invio Candidatura</h2>
          </div>

          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <div class="form-floating">
                    <input
                      id="nome"
                      v-model="nome"
                      type="text"
                      class="form-control"
                      placeholder="Inserisci il nome"
                      required
                      :disabled="loading"
                    />
                    <label for="nome">
                      Nome <span class="text-danger">*</span>
                    </label>
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <div class="form-floating">
                    <input
                      id="cognome"
                      v-model="cognome"
                      type="text"
                      class="form-control"
                      placeholder="Inserisci il cognome"
                      required
                      :disabled="loading"
                    />
                    <label for="cognome">
                      Cognome <span class="text-danger">*</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <div class="form-floating">
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    class="form-control"
                    placeholder="Inserisci l'email"
                    required
                    :disabled="loading"
                  />
                  <label for="email">
                    Email <span class="text-danger">*</span>
                  </label>
                </div>
              </div>

              <div class="row">
                <div class="col-4 mb-3">
                  <div class="form-floating">
                    <input
                      id="dataNascita"
                      v-model="dataNascita"
                      type="date"
                      class="form-control"
                      placeholder="Data di Nascita"
                      required
                      :disabled="loading"
                      :max="new Date().toISOString().split('T')[0]"
                    />
                    <label for="dataNascita">
                      Data di Nascita <span class="text-danger">*</span>
                    </label>
                  </div>
                </div>

                <div class="col-8 mb-3">
                  <div class="form-floating">
                    <input
                      id="cellulare"
                      v-model="cellulare"
                      type="tel"
                      class="form-control"
                      placeholder="Inserisci il numero di cellulare"
                      required
                      :disabled="loading"
                      maxlength="10"
                    />
                    <label for="cellulare">
                      Cellulare <span class="text-danger">*</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <div class="form-floating">
                  <input
                    id="codiceFiscale"
                    v-model="codiceFiscale"
                    type="text"
                    class="form-control"
                    placeholder="Inserisci il codice fiscale"
                    required
                    :disabled="loading"
                    style="text-transform: uppercase;"
                    maxlength="16"
                  />
                  <label for="codiceFiscale">
                    Codice Fiscale <span class="text-danger">*</span>
                  </label>
                </div>
              </div>

              <!-- Drag and Drop PDF -->
              <div class="mb-4">
                <label class="form-label">
                  PDF Candidatura <span class="text-danger">*</span>
                </label>
                <div
                  @dragover.prevent="handleDragOver"
                  @dragleave.prevent="handleDragLeave"
                  @drop.prevent="handleDrop"
                  :class="[
                    'border rounded p-4 text-center',
                    isDragging ? 'border-primary bg-light' : 'border-secondary',
                    pdfFile ? 'border-success' : ''
                  ]"
                  style="cursor: pointer; min-height: 150px; display: flex; flex-direction: column; justify-content: center; align-items: center;"
                >
                  <input
                    type="file"
                    accept=".pdf"
                    @change="handleFileInput"
                    class="d-none"
                    id="pdfInput"
                    :disabled="loading"
                  />
                  
                  <div v-if="!pdfFile">
                    <i class="bi bi-cloud-upload fs-1 text-muted mb-2"></i>
                    <p class="mb-1">
                      <label for="pdfInput" class="text-danger" style="cursor: pointer;">
                        Clicca per selezionare
                      </label>
                      o trascina il file qui
                    </p>
                    <p class="text-muted small mb-0">Solo file PDF</p>
                  </div>
                  
                  <div v-else class="w-100">
                    <i class="bi bi-file-pdf fs-1 text-danger mb-2"></i>
                    <p class="mb-1 fw-bold">{{ pdfFileName }}</p>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger"
                      @click.prevent="removeFile"
                      :disabled="loading"
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
              </div>

              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="btn form-element btn-lg text-white"
                  :disabled="loading || !nome.trim() || !cognome.trim() || !email.trim() || !dataNascita || !cellulare.trim() || !codiceFiscale.trim() || !pdfFile"
                >
                  <span v-if="loading">
                    <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Invio in corso...
                  </span>
                  <span v-else>
                    INVIO
                  </span>
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
.page-background {
  position: relative;
  min-height: 100vh;
  padding: 2rem 0;
}

.page-background::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/img/piazza-duomo.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(2px);
  z-index: -1;
  transform: scale(1.1);
}

.page-background::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, .4);
  z-index: -1;
}

.border {
  transition: all 0.3s ease;
}

.border:hover {
  border-color: #0d6efd;
}

.form-element {
  background-color: rgb(74, 110, 132);
}

.fixed-alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1050;
  min-width: 300px;
  max-width: 90%;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style>

