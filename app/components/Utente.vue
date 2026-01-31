<script setup lang="ts"></script>

<template>
<div class="d-flex align-items-center gap-2 gap-md-3 p-2 p-md-3 bg-light border rounded-3 w-100">
  
  <!-- Nome e Cognome - Responsive -->
  <div class="d-flex  min-w-0 col">
    <div class="text-truncate col-3">{{ nome }}</div>
    <div class="text-truncate d-none d-sm-block col-3">{{ cognome }}</div>
  </div>
  <div class="text-truncate col" >{{ email }}</div>

  <!-- Codice Utente -->
    <div class="col-1 text-truncate">
      Utente: 
    </div>
    <div class="col-1">
      #{{ codiceUtente }}
    </div>
  

  <!-- Elimina -->
  <div class="d-flex align-items-center gap-2 gap-md-3 ms-auto flex-shrink-0">
  
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
    name: "Utente",
    props:{
      _id: {
      type: String,
      required: true
    },
      nome: String,
      cognome: String,
      email: String,
      codiceUtente: String
    },
    emits: ['richiedi-eliminazione'],
    methods: {
      elimina() {
        this.$emit('richiedi-eliminazione', this._id);
      }
    }
  }
</script>
