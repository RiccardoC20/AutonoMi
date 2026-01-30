<script setup lang="ts">
import { ref } from 'vue';
import { navigateTo } from '#app';

const codiceVettore = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

async function handleLogin() {
  error.value = null;
  loading.value = true;

  try {
    const response = await $fetch<{
      success: boolean;
      token: string;
      user: any;
    }>('/api/vettore/login', {
      method: 'POST',
      body: {
        codiceVettore: codiceVettore.value.trim(),
        password: password.value
      }
    });

    if (response.success && response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      navigateTo('/vettore/home');
    } else {
      error.value = 'Credenziali non valide';
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Errore durante il login';
    console.error('Errore login:', err);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card shadow-sm">
          <div class="card-header text-white text-center" style="background-color: #ff8c42;">
            <h2 class="m-2 font-megrim">AutonoMi</h2>
          </div>

          <div class="card-body">
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

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="codiceVettore" class="form-label">
                  Codice Vettore
                </label>
                <input
                  id="codiceVettore"
                  v-model="codiceVettore"
                  type="text"
                  class="form-control"
                  placeholder="Inserisci il tuo codice vettore"
                  :disabled="loading"
                  autocomplete="username"
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">
                  Password
                </label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="Inserisci la password"
                  :disabled="loading"
                  autocomplete="current-password"
                />
              </div>

              <div class="d-grid">
                <button
                  type="submit"
                  class="btn text-white"
                  style="background-color: var(--color-vettore-sideBar)"
                  :disabled="loading || !codiceVettore.trim() || !password"
                >
                  <span v-if="loading">
                    <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Accesso in corso...
                  </span>
                  <span v-else>
                    Accedi
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