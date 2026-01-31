<script setup lang="ts"></script>

<template>
<div class="d-flex align-items-center gap-3 p-3 bg-pending border rounded-2 w-auto ">

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
    <strong>Data e ora:</strong>
  </div>
  <div class="col-2">
    {{ oraRichiesta }} - {{dataRichiesta}}
  </div>

  <div class="col text-truncate fw-bold " style="width: 5rem;">
    {{ km }} km
  </div>


  <div v-if="codiceUtente && codiceVettore" class="col-1">
    <div class="row-top">
      <strong>Utente </strong>
    </div>
    <div class="row-bottom">
      <strong>Vettore </strong>
    </div>
  </div>
  <div v-else-if="codiceUtente" class="col-1">
      <strong>Utente </strong>
  </div>
  <div v-else class="col-1">
      <strong>Vettore </strong>
  </div>

  <div v-if="codiceUtente && codiceVettore" class="col-2">
    <div class="row-top text-truncate">
      #{{ codiceUtente }}
    </div>
    <div class="row-bottom text-truncate">
      #{{ codiceVettore}}
    </div>
  </div>
  <div v-else-if="codiceUtente" class="col-2">
      #{{ codiceUtente }}
  </div>
    <div v-else class="col-2">
      #{{ codiceVettore }}
  </div>
  
  <div v-if="status" class="col-1 pending">
    Richiesta  
    <span class="bi bi-circle-fill"></span>
  </div>

</div> 

</template>

<script>
  export default {
    name: "Corsa",
    props: { 
      partenza: String,
      arrivo: String,
      data: String,
      km: Number,
      status: Boolean,
      codiceUtente: {
        type: String,
        default: null
      },
      codiceVettore: {
        type: String,
        default: null
      }
    },
    emits: ['corsaEffettuata'],

    computed: {
      dataRichiesta() {
        if (!this.data) return ''
        const d = new Date(this.data)

        return new Intl.DateTimeFormat('it-IT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(new Date(d))
      },

      oraRichiesta() {
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