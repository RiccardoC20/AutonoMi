<script setup lang="ts">
  import FormInput from './components/FormInput.vue';
</script>

<template>
  <div>
    <form>
      <FormInput class="mb-3" type="text" id="name" label="Nome"></FormInput>
      <FormInput type="email" id="email" label="Indirizzo email"></FormInput>
      <input type="submit"></input>
    </form>
  </div>
</template>
