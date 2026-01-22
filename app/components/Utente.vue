<script setup lang="ts"></script>

<template>
<div class="d-flex align-items-center gap-2 gap-md-3 p-2 p-md-3 bg-light border rounded-3 w-100">
  <!-- Codice Utente - Priorità alta, sempre visibile -->
  <div class="text-truncate fw-bold flex-shrink-0" style="min-width: 6rem; max-width:12rem;">{{ codiceUtente }}</div>

  <!-- Nome e Cognome - Responsive -->
  <div class="d-flex gap-2 flex-grow-1 min-w-0">
    <div class="text-truncate" style="min-width: 10rem;">{{ nome }}</div>
    <div class="text-truncate d-none d-sm-block" style="min-width: 10rem;">{{ cognome }}</div>
  </div>

  <!-- Azioni - Sempre a destra -->
  <div class="d-flex align-items-center gap-2 gap-md-3 ms-auto flex-shrink-0">
    <a href="./infoUtente.vue" class="text-decoration-none">
      <i class="bi bi-info-circle fs-6 fs-md-5"></i>
    </a>
    <a href="./modificaUtente.vue" class="text-decoration-none">
      <i class="bi bi-pencil-square fs-6 fs-md-5"></i>
    </a>
    <button 
      type="button" 
      class="btn btn-outline-danger btn-sm"
      data-bs-toggle="modal" 
      data-bs-target="#removeUtenteBackdrop"
    >
      <i class="bi bi-trash"></i>
    </button>
  </div>
</div>


<!-- Modal Logout -->
<div class="modal fade" id="removeUtenteBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Elimina Utente</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Vuoi eliminare questo utente?
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
    name: "Utente",
    props:{
      nome: String,
      cognome: String,
      codiceUtente: String,
    },
    emits: ['elimina']
  }
</script>
