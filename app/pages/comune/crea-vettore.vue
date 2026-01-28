<script setup lang="ts">
import { ref } from 'vue';
import { navigateTo } from '#app';

const nome = ref('');
const email = ref('');
const numeroTelefono = ref('');
const sede = ref('');
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

async function handleSubmit() {
  error.value = null;
  success.value = false;
  loading.value = true;

  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await $fetch<{
      success: boolean;
      vettore: any;
    }>('/api/vettore/crea', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        nome: nome.value.trim(),
        email: email.value.trim(),
        numeroTelefono: numeroTelefono.value.trim(),
        sede: sede.value.trim()
      }
    });

    if (response.success) {
      success.value = true;
      // Reset form
      nome.value = '';
      email.value = '';
      numeroTelefono.value = '';
      sede.value = '';
      navigateTo("/comune/vettori");
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Errore durante la creazione del vettore';
    console.error('Errore creazione vettore:', err);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <HomeLayout role="comune">
    <div class="d-flex justify-content-center ">
      <div class="content-wrapper p-4 ">
        <h1>Crea vettore</h1>


          <div class="card-body card shadow-sm">
            <!-- Messaggio di successo -->
            <div
              v-if="success"
              class="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              Vettore creato con successo! Reindirizzamento in corso...
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
              <div class="mb-3">
                <label for="nome" class="form-label">
                  Nome <span class="text-danger">*</span>
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
                <label for="numeroTelefono" class="form-label">
                  Numero di Telefono <span class="text-danger">*</span>
                </label>
                <input
                  id="numeroTelefono"
                  v-model="numeroTelefono"
                  type="tel"
                  class="form-control"
                  placeholder="Inserisci il numero di telefono"
                  required
                  :disabled="loading"
                />
              </div>

              <div class="mb-4">
                <label for="sede" class="form-label">
                  Sede <span class="text-danger">*</span>
                </label>
                <input
                  id="sede"
                  v-model="sede"
                  type="text"
                  class="form-control"
                  placeholder="Inserisci la sede"
                  required
                  :disabled="loading"
                />
              </div>

              <div class="d-grid gap-2">
                <button
                  type="submit"
                  class="button-color"
                  :disabled="loading || !nome.trim() || !email.trim() || !numeroTelefono.trim() || !sede.trim()"
                >
                  <span v-if="loading">
                    <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Creazione in corso...
                  </span>
                  <span v-else>
                    Crea Vettore
                  </span>
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="navigateTo('/comune/vettori')"
                  :disabled="loading"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  </HomeLayout>
</template>

<style scoped>
.content-wrapper {
  max-width: 1200px;
  width: 50%;
}
.button-color{
  background-color: var(--color-comune-sideBar);
}
</style>