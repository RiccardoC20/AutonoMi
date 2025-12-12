<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { navigateTo } from '#app';

const vettori = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function loadVettori() {
  loading.value = true;
  error.value = null;

  try {
    const token = localStorage.getItem('auth_token');

    const response = await $fetch<{
      success: boolean;
      data: any[];
      count: number;
    }>('/api/vettore/get', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.success) {
      vettori.value = response.data;
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Errore nel caricamento dei vettori';
    console.error('Errore caricamento vettori:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadVettori();
});
</script>

<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">Lista Vettori</h1>
          <button
            class="btn btn-primary"
            @click="navigateTo('/comune/crea-vettore')"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Crea Nuovo Vettore
          </button>
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

        <!-- Loading -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Caricamento...</span>
          </div>
        </div>

        <!-- Tabella vettori -->
        <div v-else-if="vettori.length > 0" class="card shadow-sm">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Codice Vettore</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefono</th>
                    <th>Sede</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="vettore in vettori" :key="vettore._id">
                    <td>{{ vettore.codiceVettore }}</td>
                    <td>{{ vettore.nome }}</td>
                    <td>{{ vettore.email }}</td>
                    <td>{{ vettore.numeroTelefono }}</td>
                    <td>{{ vettore.sede }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Nessun vettore -->
        <div v-else class="card shadow-sm">
          <div class="card-body text-center py-5">
            <p class="text-muted mb-0">Nessun vettore trovato.</p>
            <button
              class="btn btn-primary mt-3"
              @click="navigateTo('/comune/crea-vettore')"
            >
              Crea il primo vettore
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

