<script setup lang="ts">
import { ref } from 'vue'
import FormInput from '~/components/FormInput.vue'

const password = ref<{ inputRef: HTMLInputElement | null } | null>(null)
const showPassword = ref(false)

function togglePassword() {
  const input = password.value?.inputRef
  if (!input) return
  input.type = showPassword.value ? 'password' : 'text'
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="container min-vh-100 d-flex align-items-center justify-content-center">
    <form class="form-floating">
      <FormInput class="mb-2" type="text" id="username" label="Nome Utente" />
      
      <div class="input-group">
        <FormInput ref="password" type="password" id="password" label="Password" />
        <button type="button" class="btn btn-secondary" @click="togglePassword">
          <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
        </button>
      </div>
    </form>
  </div>
</template>
