<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Utente from '../../components/Utente.vue';

// Dati mock per gli utenti (solo le proprietà necessarie per il componente Utente)
const utenti = [
  {
    id: 1,
    codiceUtente: '01',
    nome: 'Mario',
    cognome: 'Rossi',
    statoAbbonamento: 'active'
  },
  {
    id: 2,
    codiceUtente: '02',
    nome: 'Laura',
    cognome: 'Bianchi',
    statoAbbonamento: 'active'
  },
  {
    id: 3,
    codiceUtente: '03',
    nome: 'Giuseppe',
    cognome: 'Verdi',
    statoAbbonamento: 'active'
  },
  {
    id: 4,
    codiceUtente: '04',
    nome: 'Anna',
    cognome: 'Neri',
    statoAbbonamento: 'inactive'
  },
  {
    id: 5,
    codiceUtente: '05',
    nome: 'Luca',
    cognome: 'Gallo',
    statoAbbonamento: 'active'
  }
];

// Barra di ricerca
const searchTerm = ref('');

// Lista utenti filtrata
const utentiFiltrati = computed(() => {
  if (!searchTerm.value) return utenti;

  return utenti.filter(utente =>
    utente.nome.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    utente.codiceUtente.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});
</script>

<template>
  <HomeLayout role="comune" page-title="Gestione Utenti">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
          <!-- Barra di ricerca -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <input
                    v-model="searchTerm"
                    type="text"
                    class="form-control"
                    placeholder="Cerca per nome o codice utente..."
                  >
                </div>
              </div>
            </div>
          </div>

    <!-- Lista utenti usando il componente Utente -->
    <div class="mb-4">
      <h5 class="mb-3">Lista Utenti ({{ utentiFiltrati.length }})</h5>
      <div style="width: fit-content;">
        <div class="d-flex flex-column gap-3">
          <Utente
            v-for="utente in utentiFiltrati"
            :key="utente.id"
            :nome="utente.nome"
            :cognome="utente.cognome"
            :codiceUtente="utente.codiceUtente"
            :statoAbbonamento="utente.statoAbbonamento"
          />
          <div v-if="utentiFiltrati.length === 0" class="text-center py-5">
            <i class="bi bi-search text-muted fs-1 mb-2"></i>
            <p class="text-muted">Nessun utente trovato con la ricerca effettuata</p>
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
