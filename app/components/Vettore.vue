<script setup lang="ts"></script>

<template>
<div class="d-flex align-items-center  p-3 bg-light border rounded-3 w-auto">
  <div class="text-truncate" style="width: 12rem;">{{ nome }}</div>
  <div class="text-truncate" style="width: 17rem;">{{ email }}</div>
  <div class="text-truncate" style="width: 8rem;">#{{ codiceVettore }}</div>
  
  <div class="d-flex align-items-center gap-3 ms-auto">
    <button
      class="btn btn-outline-danger btn-sm"
      data-bs-toggle="modal"
      data-bs-target="#removeUtenteBackdrop"
      @click="elimina"
    >
      <i class="bi bi-trash"></i>
    </button>
  </div>
</div>


</template>

<script>
  export default {
    name: "Vettore",
    props:{
      _id: {
      type: String,
      required: true
    },
      codiceVettore: String,
      nome: String,
      email: String
    },
    emits: ['elimina'],
    methods: {
      elimina() {
        this.$emit('elimina', this._id);
      }
    }
  }
</script>
