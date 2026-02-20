<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Candidatura from '~/components/Candidatura.vue';
import type { UtenteType, CandidaturaType} from '~~/composables/dataType';


const candidature = ref<CandidaturaType[]>([]);
const candidatura = ref<CandidaturaType>();
const data = ref<string>();
const loading = ref(false);
const error = ref<string | null>(null);
const deletingId = ref<string | null>(null);


async function getCandidature() {
  loading.value = true;
  error.value = null;

  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await $fetch<{
      success: boolean;
      data: CandidaturaType[];
      count: number;
    }>('/api/candidatura/get', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.success) {
      candidature.value = response.data;
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Errore nel caricamento delle candidature';
    console.error('Errore caricamento candidature:', err);
  } finally {
    loading.value = false;
  }
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

function dataRichiesta(data: string) {
        if (!data) return ''
        const d = new Date(data)

        return new Intl.DateTimeFormat('it-IT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(new Date(d))
}

function getCandidatura(candidaturaId: string){
  const cand = candidature.value.find(c => c._id === candidaturaId);
  if (cand && cand.utente) {
    candidatura.value = cand;
  }
  data.value = dataRichiesta(candidatura.value?.utente.dataNascita || "0");
}

function handleRifiuta(candidaturaId: string) {
  getCandidatura(candidaturaId);
}

function handleAccetta(candidaturaId: string) {
  getCandidatura(candidaturaId);
}

function handleInfoUtente(candidaturaId: string) {
  getCandidatura(candidaturaId);
}

function handlePdf(candidaturaId: string) {
  const candidatura = candidature.value.find(c => c._id === candidaturaId);
  if (candidatura && candidatura.pdfUrl) {
    window.open(candidatura.pdfUrl, '_blank');
  } else {
    error.value = 'PDF non disponibile per questa candidatura';
  }
}



onMounted(() => {
  getCandidature();
});
</script>

<template>
  <HomeLayout role="comune">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
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
        <div v-else-if="candidature.length > 0" id="accordion">
          <div
            v-for="candidatura in candidature"
            :key="candidatura._id"
            class="mb-3"
          >
          <Candidatura 
            :_id="candidatura._id"
            :nome="candidatura.utente.nome"
            :cognome="candidatura.utente.cognome"
            @visualizza="handleInfoUtente"
            @apriPdf="handlePdf"
            @approva="handleAccetta"
            @rifiuta="handleRifiuta"


            />
          </div>

        </div>

        <!-- Nessuna candidatura -->
        <div v-else class="card shadow-sm">
          <div class="card-body text-center py-5">
            <p class="text-muted mb-0">Nessuna candidatura trovata.</p>
          </div>
        </div>
      </div>
    </div>
<!-- Modal per eliminare la candidatura -->
<div class="modal fade" id="rifiutaCandidaturaBackdrop" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Rifiuta Candidatura</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        Conferma il rifiuto della candidatura di:
        {{ candidatura?.utente.nome }}
        {{ candidatura?.utente.cognome }}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
        <button
          class="btn btn-danger"
          data-bs-dismiss="modal"
          @click="executeRifiuta(candidatura?._id || '0')"
        >
          Conferma
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Modal per accettare la candidatura -->
<div class="modal fade" id="accettaCandidaturaBackdrop" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Accetta Candidatura</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        Conferma l'accettazione della candidatura di:
        {{ candidatura?.utente.nome }}
        {{ candidatura?.utente.cognome }}
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
        <button
          class="btn btn-success"
          data-bs-dismiss="modal"
          @click="executeAccetta(candidatura?._id || '0')"
        >
          Conferma
        </button>
      </div>
    </div>
  </div>
</div>
<!-- Modal per info utente -->
<div class="modal fade" id="infoUtenteBackdrop" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Info Utente</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <dl class="row mb-0">
          <dt class="col-sm-4">Email:</dt>
          <dd class="col-sm-8">{{ candidatura?.utente.email }}</dd>

          <dt class="col-sm-4">Data di Nascita:</dt>
          <dd class="col-sm-8">{{ data}}</dd>

          <dt class="col-sm-4">Cellulare:</dt>
          <dd class="col-sm-8">{{ candidatura?.utente.cellulare }}</dd>

          <dt class="col-sm-4">Codice Fiscale:</dt>
          <dd class="col-sm-8">{{ candidatura?.utente.codiceFiscale }}</dd>
        </dl>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
      </div>
    </div>
  </div>
</div>

  </HomeLayout>
</template>

<style scoped>

</style>
