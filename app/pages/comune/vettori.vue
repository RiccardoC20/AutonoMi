<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';
import Vettore from '../../components/Vettore.vue';

// Dati mock per i vettori
const vettori = [
  {
    id: 1,
    codiceVettore: 'V001',
    nome: 'Mario Rossi Trasporti',
    email: 'mario.rossi@email.com'
  },
  {
    id: 2,
    codiceVettore: 'V002',
    nome: 'Laura Bianchi Delivery',
    email: 'laura.bianchi@email.com'
  },
  {
    id: 3,
    codiceVettore: 'V003',
    nome: 'Giuseppe Verdi Logistics',
    email: 'giuseppe.verdi@email.com'
  },
  {
    id: 4,
    codiceVettore: 'V004',
    nome: 'Anna Neri Transport',
    email: 'anna.neri@email.com'
  },
  {
    id: 5,
    codiceVettore: 'V005',
    nome: 'Luca Gallo Express',
    email: 'luca.gallo@email.com'
  }
];

// Barra di ricerca
const searchTerm = ref('');

// Lista vettori filtrata
const vettoriFiltrati = computed(() => {
  if (!searchTerm.value) return vettori;

  return vettori.filter(vettore =>
    vettore.nome.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    vettore.codiceVettore.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Funzione mock per eliminare vettore
function eliminaVettore(vettoreId: number) {
  // In produzione qui chiameresti l'API
  console.log('Eliminazione vettore:', vettoreId);
  // Per demo, potresti rimuovere dalla lista locale
  // vettori.value = vettori.value.filter(v => v.id !== vettoreId);
}
</script>

<template>
  <HomeLayout role="comune">
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1>Gestione Vettori</h1>
          <!-- Barra di ricerca -->
          <div class="card mb-4">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <input
                    v-model="searchTerm"
                    type="text"
                    class="form-control"
                    placeholder="Cerca per nome o codice vettore..."
                  >
                </div>
              </div>
            </div>
          </div>

    <!-- Lista vettori usando il componente Vettore -->
    <div class="mb-4">
      <div class="card h-100">
        <div class="card-header">
          <h5 class="card-title mb-0">
            <i class="bi bi-truck me-2"></i>
            Lista Vettori ({{ vettoriFiltrati.length }})
          </h5>
        </div>
        <div class="card-body">
          <div v-if="vettoriFiltrati.length === 0" class="text-center py-4">
            <i class="bi bi-truck text-muted fs-1 mb-2"></i>
            <p class="text-muted">Nessun vettore trovato con la ricerca effettuata</p>
          </div>
          <div v-else class="d-flex flex-column gap-3">
            <Vettore
              v-for="vettore in vettoriFiltrati"
              :key="vettore.id"
              :codiceVettore="vettore.codiceVettore"
              :nome="vettore.nome"
              :email="vettore.email"
              @elimina="eliminaVettore(vettore.id)"
            />
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
