<script setup lang="ts"></script>

<template>
  <div class="form-floating">
    <input :type="type" class="form-control" :id="id" placeholder="">
    <label for="floatingInput">{{label}}</label>
  </div>
</template>

<script>
  export default {
    name: "FormInput",
    props: {
      type: String,
      id: String,
      label: String
    }
  }
</script>

<style scoped></style>
