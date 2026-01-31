<script setup lang="ts"></script>

<template>
<div class="d-flex align-items-center gap-3 p-3 bg-light border rounded-3 w-auto">

  <div class="col-1">
    <div class="row-top">
      <strong>Partenza </strong>
    </div>
    <div class="row-bottom">
      <strong>Arrivo </strong>
    </div>
  </div>

  <div class="col-2">
    <div class="row-top text-truncate">
      {{ partenza }}
    </div>
    <div class="row-bottom text-truncate">
      {{ arrivo }}
    </div>
  </div>

  <div class="col-1">
    <strong>Ora e data:</strong>
  </div>
  <div class="col-2">
    {{ oraCorsa }} - {{dataCorsa}}
  </div>

  <div class="col text-truncate fw-bold " style="width: 5rem;">
    {{ km }} km
  </div>
  <!-- Campi opzionali -->
  <div v-if="codiceUtente" class="col-1">
      <strong>Utente </strong>
  </div>
  <div v-if="codiceUtente" class="col-2">
      #{{ codiceUtente }}
  </div>

  <!-- Bottone per completare la corsa -->
  <div class="ms-auto">
    <button 
      type="button" 
      class="btn btn-success btn-sm"
      data-bs-toggle="modal" 
      data-bs-target="#corsaEffettuataBackdrop"
      @click="effettuaCorsa"
    >
    Effettua
    <i class="bi bi-check-circle me-1"></i>
    </button>
  </div>
</div>

</template>

<script>
  export default {
    name: "Corsa",
    props: { 
      id: String,
      partenza: String,
      arrivo: String,
      data: String,
      km: Number,
      codiceUtente: {
        type: String,
        default: null
      },
      nomeVettore: {
        type: String,
        default: null
      }
    },
    emits: ['effettuaCorsa'],
    methods: {
      effettuaCorsa() {
        this.$emit('effettuaCorsa', this.id);
      }
    },
    computed: {
      dataCorsa() {
        if (!this.data) return ''
        const d = new Date(this.data)

        return new Intl.DateTimeFormat('it-IT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(new Date(d))
      },
      oraCorsa() {
        if (!this.data) return ''
        const d = new Date(this.data)

        return new Intl.DateTimeFormat('it-IT', {
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date(d))
      }
    }
  }

</script>