<template>
  <div class="row justify-content-center py-5">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow-sm border-danger">
        <div class="card-body p-4">
          <h1 class="h3 mb-3 text-center text-danger">Login Provincia</h1>
          <p class="text-muted text-center mb-4">
            Accesso riservato alla provincia / ente regolatore.
          </p>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input
                id="username"
                v-model="username"
                type="text"
                class="form-control"
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

            <button type="submit" class="btn btn-outline-danger w-100 mt-2">
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

const username = ref('');
const password = ref('');

const handleLogin = () => {
  // TODO: integrare autenticazione reale
  navigateTo('/provincia/home');
};
</script>


