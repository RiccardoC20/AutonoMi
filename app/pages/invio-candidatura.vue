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
  if (files && files.length > 0) {
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
  if (target.files && target.files.length > 0) {
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
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white text-center">
            <h2 class="h4 mb-0">Invio Candidatura</h2>
          </div>

          <div class="card-body">
            <!-- Messaggio di successo -->
            <div
              v-if="success"
              class="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              Candidatura inviata con successo!
              <button
                type="button"
                class="btn-close"
                @click="success = false"
                aria-label="Close"
              ></button>
            </div>

            <!-- Messaggio di errore -->
            <div
              v-if="error"
              class="alert alert-danger alert-dismissible fade show"
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

            <form @submit.prevent="handleSubmit">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="nome" class="form-label">
                    Nome <span class="text-danger">*</span>
                  </label>
                  <input
                    id="nome"
                    v-model="nome"
                    type="text"
                    class="form-control"
                    placeholder="Inserisci il nome"
                    required
                    :disabled="loading"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label for="cognome" class="form-label">
                    Cognome <span class="text-danger">*</span>
                  </label>
                  <input
                    id="cognome"
                    v-model="cognome"
                    type="text"
                    class="form-control"
                    placeholder="Inserisci il cognome"
                    required
                    :disabled="loading"
                  />
                </div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">
                  Email <span class="text-danger">*</span>
                </label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="Inserisci l'email"
                  required
                  :disabled="loading"
                />
              </div>

              <div class="mb-3">
                <label for="dataNascita" class="form-label">
                  Data di Nascita <span class="text-danger">*</span>
                </label>
                <input
                  id="dataNascita"
                  v-model="dataNascita"
                  type="date"
                  class="form-control"
                  required
                  :disabled="loading"
                  :max="new Date().toISOString().split('T')[0]"
                />
              </div>

              <div class="mb-3">
                <label for="cellulare" class="form-label">
                  Cellulare <span class="text-danger">*</span>
                </label>
                <input
                  id="cellulare"
                  v-model="cellulare"
                  type="tel"
                  class="form-control"
                  placeholder="Inserisci il numero di cellulare"
                  required
                  :disabled="loading"
                />
              </div>

              <div class="mb-3">
                <label for="codiceFiscale" class="form-label">
                  Codice Fiscale <span class="text-danger">*</span>
                </label>
                <input
                  id="codiceFiscale"
                  v-model="codiceFiscale"
                  type="text"
                  class="form-control"
                  placeholder="Inserisci il codice fiscale"
                  required
                  :disabled="loading"
                  style="text-transform: uppercase;"
                />
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
                      <label for="pdfInput" class="text-primary" style="cursor: pointer;">
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
                  class="btn btn-primary btn-lg"
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
.border {
  transition: all 0.3s ease;
}

.border:hover {
  border-color: #0d6efd !important;
}
</style>

