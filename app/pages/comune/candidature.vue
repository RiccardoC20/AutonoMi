<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Interfaccia per Candidatura
interface CandidaturaType {
  id: string;
  codiceCandidatura: string;
  nome: string;
  cognome: string;
  email: string;
  cellulare?: string;
// file pdf?
  dataCreazione?: string;
}

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);
const candidature = ref<CandidaturaType[]>([]);



async function getCandidature() {
  error.value = null;
  success.value = false;
  loading.value = true;

  const token = localStorage.getItem('auth_token');
  
  try {
    const response = await $fetch<{
      success: boolean;
      vettore: any;
    }>('/api/comune/candidature', {
        method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.success) {

      success.value = true;
      // Reset form
      navigateTo("/comune/vettori");
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Errore durante la creazione del vettore';
    console.error('Errore creazione vettore:', err);
  } finally {
    loading.value = false;
  }
}

// Dati mock per le candidature
// const candidature = [
//   {
//     id: 1,
//     codiceCandidatura: 'CAND001',
//     nome: 'Mario',
//     cognome: 'Rossi',
//     email: 'mario.rossi@email.com',
//     documentazionePdf: 'candidatura_mario_rossi.pdf',
//     dataCandidatura: '2024-12-01'
//   },
//   {
//     id: 2,
//     codiceCandidatura: 'CAND002',
//     nome: 'Laura',
//     cognome: 'Bianchi',
//     email: 'laura.bianchi@email.com',
//     documentazionePdf: 'candidatura_laura_bianchi.pdf',
//     dataCandidatura: '2024-11-15'
//   },
//   {
//     id: 3,
//     codiceCandidatura: 'CAND003',
//     nome: 'Giuseppe',
//     cognome: 'Verdi',
//     email: 'giuseppe.verdi@email.com',
//     documentazionePdf: 'candidatura_anna_neri.pdf',
//     dataCandidatura: '2024-11-20'
//   },
//   {
//     id: 4,
//     codiceCandidatura: 'CAND004',
//     nome: 'Anna',
//     cognome: 'Neri',
//     email: 'anna.neri@email.com',
//     documentazionePdf: 'candidatura_anna_neri.pdf',
//     dataCandidatura: '2024-12-05'
//   },
//   {
//     id: 5,
//     codiceCandidatura: 'CAND005',
//     nome: 'Luca',
//     cognome: 'Gallo',
//     email: 'luca.gallo@email.com',
//     documentazionePdf: 'candidatura_luca_gallo.pdf',
//     dataCandidatura: '2024-12-08'
//   }
// ];

function openConfirmModal(action: 'accetta' | 'rifiuta', candidaturaId: string, nome: string) {
  confirmAction.value = action;
  confirmCandidaturaId.value = candidaturaId;
  confirmCandidaturaNome.value = nome;
  showConfirmModal.value = true;
}

const candidatureFiltrate = computed(() => {
  return candidature.value.filter(candidatura => {
    const matchesSearch = candidatura.nome.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         candidatura.cognome.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         candidatura.codiceCandidatura.toLowerCase().includes(searchTerm.value.toLowerCase());

async function confirmActionHandler() {
  if (!confirmCandidaturaId.value || !confirmAction.value) return;

  if (confirmAction.value === 'rifiuta') {
    await executeRifiuta(confirmCandidaturaId.value);
  } else if (confirmAction.value === 'accetta') {
    await executeAccetta(confirmCandidaturaId.value);
  }

  closeConfirmModal();
}

async function executeRifiuta(candidaturaId: string) {
  deletingId.value = candidaturaId;
  error.value = null;

  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await $fetch<{
      success: boolean;
      message: string;
    }>(`/api/candidatura/${candidaturaId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.success) {
      // Rimuove la candidatura dalla lista locale
      candidature.value = candidature.value.filter(c => c._id !== candidaturaId);
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Errore nell\'eliminazione della candidatura';
    console.error('Errore eliminazione candidatura:', err);
  } finally {
    deletingId.value = null;
  }
}

async function executeAccetta(candidaturaId: string) {
  deletingId.value = candidaturaId;
  error.value = null;

  try {
    const token = localStorage.getItem('auth_token');
    
    // Recupera i dati della candidatura dalla lista locale
    const candidatura = candidature.value.find(c => c._id === candidaturaId);
    
    if (!candidatura) {
      throw new Error('Candidatura non trovata');
    }

    // Crea il nuovo utente con i dati della candidatura
    const createUtenteResponse = await $fetch<{
      success: boolean;
      codiceUtente?: string;
    }>('/api/utente/crea', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        nome: candidatura.utente.nome,
        cognome: candidatura.utente.cognome,
        email: candidatura.utente.email,
        dataNascita: candidatura.utente.dataNascita,
        cellulare: candidatura.utente.cellulare,
        codiceFiscale: candidatura.utente.codiceFiscale,
        budget: 200,
        pdfUrl: candidatura.pdfUrl
      }
    });

    if (!createUtenteResponse.success) {
      throw new Error('Errore nella creazione dell\'utente');
    }


   
    // Elimina la candidatura dal db solo se l'utente è stato creato con successo
    // Passa action=accept per non cancellare il PDF
    const deleteResponse = await $fetch<{
      success: boolean;
      message: string;
    }>(`/api/candidatura/${candidaturaId}?action=accept`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (deleteResponse.success) {
      // Rimuove la candidatura dalla lista locale
      candidature.value = candidature.value.filter(c => c._id !== candidaturaId);
      console.log('Candidatura accettata, utente creato ed eliminata con successo');
    }
  } catch (err: any) {
    error.value = err.data?.message || err.message || 'Errore nell\'accettazione della candidatura';
    console.error('Errore accettazione candidatura:', err);
  } finally {
    deletingId.value = null;
  }
}

function handleRifiuta(candidaturaId: string, nome: string) {
  openConfirmModal('rifiuta', candidaturaId, nome);
}

function handleAccetta(candidaturaId: string, nome: string) {
  openConfirmModal('accetta', candidaturaId, nome);
}

function handlePdf(candidaturaId: string) {
  const candidatura = candidature.value.find(c => c._id === candidaturaId);
  if (candidatura && candidatura.pdfUrl) {
    window.open(candidatura.pdfUrl, '_blank');
  } else {
    error.value = 'PDF non disponibile per questa candidatura';
  }
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch {
    return 'N/A';
  }
}

function toggleDetails(candidaturaId: string) {
  if (expandedIds.value.has(candidaturaId)) {
    expandedIds.value.delete(candidaturaId);
  } else {
    expandedIds.value.add(candidaturaId);
  }
  // Trigger reactivity
  expandedIds.value = new Set(expandedIds.value);
}

function isExpanded(candidaturaId: string): boolean {
  return expandedIds.value.has(candidaturaId);
}

onMounted(() => {
  loadCandidature();
});

// Funzioni per gestire le candidature
function visualizzaCandidatura(candidatura: any) {
  console.log('Visualizza candidatura:', candidatura);
  // Qui si potrebbe aprire un modal con i dettagli completi
}

function scaricaPDF(pdfFile: string) {
  console.log('Scarica PDF:', pdfFile);
  // download del PDF
  alert(`Download del file: ${pdfFile}`);
}

function approvaCandidatura(candidatura: any) {
  console.log('Approva candidatura:', candidatura);
  // chiamata API per approvare la candidatura
  alert(`Candidatura ${candidatura.codiceCandidatura} approvata!`);
}

function rifiutaCandidatura(candidatura: any) {
  console.log('Rifiuta candidatura:', candidatura);
  // chiamata API per rifiutare la candidatura.
  alert(`Candidatura ${candidatura.codiceCandidatura} rifiutata.`);
}

</script>

<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <h1 class="h3 mb-4">Lista Candidature</h1>

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

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Caricamento...</span>
          </div>
        </div>

        <!-- Lista candidature -->
        <div v-else-if="candidature.length > 0">
          <div
            v-for="candidatura in candidature"
            :key="candidatura._id"
            class="candidatura-card card shadow-sm mb-2"
            :class="{ 'expanded': isExpanded(candidatura._id) }"
          >
            <div class="card-body">
              <!-- Header compatto -->
              <div 
                class="candidatura-header d-flex justify-content-between align-items-center"
                @click="toggleDetails(candidatura._id)"
                style="cursor: pointer;"
              >
                <div class="d-flex align-items-center">
                  <h6 class="card-title mb-0 me-3">
                    {{ candidatura.utente.nome }} {{ candidatura.utente.cognome }}
                  </h6>
                  <i 
                    class="bi"
                    :class="isExpanded(candidatura._id) ? 'bi-chevron-up' : 'bi-chevron-down'"
                  ></i>
                </div>
                <div class="d-flex align-items-center gap-2" @click.stop>
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm"
                    @click="handlePdf(candidatura._id)"
                    title="Visualizza documenti PDF"
                  >
                    <i class="bi bi-file-pdf me-1"></i>
                    PDF
                  </button>
                  <div class="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      class="btn btn-success btn-sm"
                      @click="handleAccetta(candidatura._id, `${candidatura.utente.nome} ${candidatura.utente.cognome}`)"
                    >
                      <i class="bi bi-check-circle me-1"></i>
                      Accetta
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger btn-sm"
                      @click="handleRifiuta(candidatura._id, `${candidatura.utente.nome} ${candidatura.utente.cognome}`)"
                      :disabled="deletingId === candidatura._id"
                    >
                      <span
                        v-if="deletingId === candidatura._id"
                        class="spinner-border spinner-border-sm me-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      <i v-else class="bi bi-x-circle me-1"></i>
                      Rifiuta
                    </button>
                  </div>
                </div>
              </div>

              <!-- Dettagli espandibili -->
              <div class="candidatura-details" :class="{ 'expanded': isExpanded(candidatura._id) }">
                <hr class="my-3">
                <dl class="row mb-0">
                  <dt class="col-sm-4">Email:</dt>
                  <dd class="col-sm-8">{{ candidatura.utente.email }}</dd>

                  <dt class="col-sm-4">Data di Nascita:</dt>
                  <dd class="col-sm-8">{{ formatDate(candidatura.utente.dataNascita) }}</dd>

                  <dt class="col-sm-4">Cellulare:</dt>
                  <dd class="col-sm-8">{{ candidatura.utente.cellulare }}</dd>

                  <dt class="col-sm-4">Codice Fiscale:</dt>
                  <dd class="col-sm-8">{{ candidatura.utente.codiceFiscale }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

      <!-- Lista candidature usando il componente Candidatura -->
      <div class="mb-4">
        <h5 class="mb-3">Candidature ({{ candidatureFiltrate.length }})</h5>
        <div style="width: fit-content;">
          <div class="d-flex flex-column gap-3">
            <Candidatura
              v-for="candidatura in candidatureFiltrate"
              :key="candidatura.id"
              :codiceCandidatura="candidatura.codiceCandidatura"
              :nome="candidatura.nome"
              :cognome="candidatura.cognome"
              :email="candidatura.email"
              @visualizza="visualizzaCandidatura(candidatura)"
              @scarica-pdf="scaricaPDF"
              @approva="approvaCandidatura(candidatura)"
              @rifiuta="rifiutaCandidatura(candidatura)"
            />
            <div v-if="candidatureFiltrate.length === 0" class="text-center py-5">
              <i class="bi bi-search text-muted fs-1 mb-2"></i>
              <p class="text-muted">Nessuna candidatura trovata con i filtri selezionati</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal di conferma -->
    <div
      class="modal fade"
      :class="{ 'show': showConfirmModal }"
      :style="{ display: showConfirmModal ? 'block' : 'none' }"
      tabindex="-1"
      role="dialog"
      aria-labelledby="confirmModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header" :class="confirmAction === 'accetta' ? 'bg-success text-white' : 'bg-danger text-white'">
            <h5 class="modal-title" id="confirmModalLabel">
              <i 
                class="bi me-2"
                :class="confirmAction === 'accetta' ? 'bi-check-circle' : 'bi-x-circle'"
              ></i>
              Conferma {{ confirmAction === 'accetta' ? 'Accettazione' : 'Rifiuto' }}
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeConfirmModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Sei sicuro di voler 
              <strong>{{ confirmAction === 'accetta' ? 'accettare' : 'rifiutare' }}</strong> 
              la candidatura di <strong>{{ confirmCandidaturaNome }}</strong>?
            </p>
            <p v-if="confirmAction === 'rifiuta'" class="text-danger mb-0">
              <small><i class="bi bi-exclamation-triangle me-1"></i>Questa operazione non può essere annullata.</small>
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeConfirmModal"
            >
              Annulla
            </button>
            <button
              type="button"
              class="btn"
              :class="confirmAction === 'accetta' ? 'btn-success' : 'btn-danger'"
              @click="confirmActionHandler"
              :disabled="deletingId === confirmCandidaturaId"
            >
              <span
                v-if="deletingId === confirmCandidaturaId"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Conferma
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Backdrop del modal -->
    <div
      v-if="showConfirmModal"
      class="modal-backdrop fade show"
      @click="closeConfirmModal"
    ></div>
  </div>
</template>

<style scoped>
.candidatura-card {
  transition: all 0.3s ease;
  overflow: hidden;
}

.candidatura-header {
  padding: 0.5rem 0;
}

.candidatura-details {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, opacity 0.3s ease, margin 0.3s ease;
  margin: 0;
}

.candidatura-details.expanded {
  max-height: 500px;
  opacity: 1;
  margin-top: 0;
}

.candidatura-card.expanded {
  margin-bottom: 1rem;
}

.candidatura-card:hover {
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.15) !important;
}

.modal.show {
  display: block !important;
}
</style>
