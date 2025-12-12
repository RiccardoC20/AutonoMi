<script setup lang="ts"></script>

<template>
<div class="d-flex align-items-center gap-3 p-3 bg-light border rounded-3 w-auto">
  <div class="text-truncate fw-bold" style="width: 8rem;">{{ codiceCandidatura }}</div>
  <div class="text-truncate" style="width: 12rem;">{{ nome }} {{ cognome }}</div>
  <div class="text-truncate" style="width: 15rem;">{{ email }}</div>
  <div class="text-truncate" style="width: 8rem;">
  </div>

  <div class="d-flex align-items-center gap-3 ms-auto">
    <button class="btn btn-outline-info btn-sm" @click="$emit('visualizza')">
      <i class="bi bi-eye me-1"></i>
      Dettagli
    </button>
    <button
      v-if="documentazionePdf"
      class="btn btn-outline-primary btn-sm"
      @click="$emit('scarica-pdf', documentazionePdf)"
    >
      <i class="bi bi-download me-1"></i>
      PDF
    </button>
    <button class="btn btn-outline-success btn-sm" @click="$emit('approva')">
      <i class="bi bi-check-circle me-1"></i>
      Approva
    </button>
    <button class="btn btn-outline-danger btn-sm" @click="$emit('rifiuta')">
      <i class="bi bi-x-circle me-1"></i>
      Rifiuta
    </button>
  </div>
</div>
</template>

<script>
  export default {
    name: "Candidatura",
    props:{
      codiceCandidatura: String,
      nome: String,
      cognome: String,
      email: String,
      tipoInvalidita: String,
      stato: {
        type: String,
        default: 'In Attesa'
      },
      documentazionePdf: String
    },
    emits: ['visualizza', 'scarica-pdf', 'approva', 'rifiuta']
  }
</script>
