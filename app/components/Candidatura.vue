<script setup lang="ts"></script>

<template>
  <div class="card">
    <div class="card-body d-flex align-items-center">
      <h6 class="mb-0 text-truncate fw-bold text-capitalize">
        {{ nome }} {{ cognome }}
      </h6>
      <div class="ms-auto d-flex gap-3">
        <button class="btn btn-outline-primary btn-sm" 
            data-bs-toggle="modal"
            data-bs-target="#infoUtenteBackdrop"
            @click="visualizza"
        >
          info utente
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-outline-secondary btn-sm" 
            data-bs-toggle="modal"
            data-bs-target="#apriPdfBackdrop"
            @click="apriPdf"
        >
          apri pdf
          <i class="bi bi-file-pdf"></i>
        </button>
        <button class="btn btn-outline-success btn-sm" 
            data-bs-toggle="modal"
            data-bs-target="#accettaCandidaturaBackdrop"
            @click="approva"
        >
          accetta
          <i class="bi bi-check-lg"></i>
        </button>
        <button class="btn btn-outline-danger btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#rifiutaCandidaturaBackdrop"
            @click="rifiuta"
        >
          rifiuta
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Candidatura",
    props:{
      _id: {
        type: String,
        required: true
      },
      nome: String,
      cognome: String,
    },
    methods: {
      visualizza() {
        this.$emit('visualizza', this._id);
      },
      apriPdf() {
        this.$emit('apriPdf', this._id);
      },
      approva() {
        this.$emit('approva', this._id);
      },
      rifiuta() {
        this.$emit('rifiuta', this._id);
      }
    }
  }
</script>
