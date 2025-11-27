<template>
  <div class="row justify-content-center py-5">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h1 class="h3 mb-3 text-center">Login Utente</h1>
          <p class="text-muted text-center mb-4">
            Inserisci le tue credenziali per accedere all'area Utente.
          </p>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                v-model="email"
                type="email"
                class="form-control"
                placeholder="utente@example.com"
                required
              />
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                v-model="password"
                type="password"
                class="form-control"
                required
              />
            </div>

            <button type="submit" class="btn btn-primary w-100 mt-2">
              Accedi
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { navigateTo } from '#app';

const email = ref('');
const password = ref('');

const handleLogin = () => {
  // TODO: integrare autenticazione reale
  // Per ora simula login e manda alla SPA utente
  navigateTo('/utente/home');
};
</script>


