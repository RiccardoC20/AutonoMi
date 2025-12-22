<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Candidatura from '../../components/Candidatura.vue';

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

// Filtri di ricerca
const searchTerm = ref('');

const candidatureFiltrate = computed(() => {
  return candidature.value.filter(candidatura => {
    const matchesSearch = candidatura.nome.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         candidatura.cognome.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         candidatura.codiceCandidatura.toLowerCase().includes(searchTerm.value.toLowerCase());

    return matchesSearch;
  });
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
  <HomeLayout role="comune">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1>Gestione Candidature</h1>
          <!-- Barra di ricerca -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <input
                    v-model="searchTerm"
                    type="text"
                    class="form-control"
                    placeholder="Cerca per nome, cognome o codice..."
                  >
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
  </div>
  </HomeLayout>
</template>

<style scoped>
  .content-wrapper {
    max-width: 1200px;
    width: 100%;
  }
  </style>