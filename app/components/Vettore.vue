<script setup lang="ts"></script>

<template>
<div class="d-flex align-items-center gap-3 p-3 bg-light border rounded-3 w-auto">
  <div class="text-truncate fw-bold" style="width: 8rem;">{{ codiceVettore }}</div>
  <div class="text-truncate" style="width: 12rem;">{{ nome }}</div>
  <div class="text-truncate" style="width: 17rem;">{{ email }}</div>

  <div class="d-flex align-items-center gap-3 ms-auto">
    <a href="./infoVettore.vue" class="text-decoration-none">
      <i class="bi bi-info-circle fs-5"></i>
    </a>
    <a href="./modificaVettore.vue" class="text-decoration-none">
      <i class="bi bi-pencil-square fs-5"></i>
    </a>
    <button 
      type="button" 
      class="btn btn-outline-danger btn-sm"
      data-bs-toggle="modal" 
      data-bs-target="#removeVettoreBackdrop"
    >
      <i class="bi bi-trash"></i>
    </button>
  </div>
</div>

<!-- Modal Logout -->
<div class="modal fade" id="removeVettoreBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Elimina Vettore</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Vuoi eliminare questo vettore?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="$emit('elimina')">Conferma</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: "Vettore",
    props:{
      codiceVettore: String,
      nome: String,
      email: String
    },
    emits: ['elimina']
  }
</script>
