<script setup lang="ts">
import HomeLayout from '../../components/HomeLayout.vue';

// Numero del comune
const numeroComune = '+39 02 1234 5678';

// Dati mock per i vettori
const vettori = [
  {
    id: 1,
    nome: 'Mario Rossi Trasporti',
    telefono: '+39 333 111 2222'
  },
  {
    id: 2,
    nome: 'Laura Bianchi Delivery',
    telefono: '+39 334 222 3333'
  },
  {
    id: 3,
    nome: 'Giuseppe Verdi Logistics',
    telefono: '+39 335 333 4444'
  },
  {
    id: 4,
    nome: 'Anna Neri Transport',
    telefono: '+39 336 444 5555'
  },
  {
    id: 5,
    nome: 'Luca Gallo Express',
    telefono: '+39 337 555 6666'
  }
];
</script>

<template>
  <HomeLayout role="utente" >
    <div class="d-flex justify-content-center">
      <div class="content-wrapper p-4">
        <h1 class="mb-4">Contatti</h1>

        <!-- Numero Comune -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <i class="bi bi-building text-primary fs-3 me-3"></i>
              <div>
                <h5 class="mb-1">Comune</h5>
                <a :href="`tel:${numeroComune.replace(/\s/g, '')}`" class="text-decoration-none fs-5 fw-bold">
                  <i class="bi bi-telephone-fill me-2"></i>
                  {{ numeroComune }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Separatore -->
        <hr class="my-4">

        <!-- Lista Vettori -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="bi bi-truck me-2"></i>
              Vettori Disponibili
            </h5>
          </div>
          <div class="card-body">
            <div class="list-group list-group-flush">
              <div
                v-for="vettore in vettori"
                :key="vettore.id"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 class="mb-1">{{ vettore.nome }}</h6>
                  <a :href="`tel:${vettore.telefono.replace(/\s/g, '')}`" class="text-decoration-none">
                    <i class="bi bi-telephone-fill me-2 text-primary"></i>
                    {{ vettore.telefono }}
                  </a>
                </div>
                <button class="btn btn-outline-primary btn-sm">
                  <i class="bi bi-telephone me-1"></i>
                  Chiama
                </button>
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
