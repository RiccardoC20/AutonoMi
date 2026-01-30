<script setup lang="ts"></script>

<template>
<!-- <div class="d-flex align-items-center gap-3 p-3 bg-light border rounded-2 w-auto pending ">
  <div class="text-truncate fw-bold" style="width: 10rem;">
    <i class="bi bi-house-door-fill me-1"></i>
    {{ partenza }}
  </div>
  <div class="text-truncate fw-bold" style="width: 15rem;">
    <i class="bi bi-flag-fill me-1"></i>
    {{ arrivo }}
  </div>
  <div class="text-truncate" style="width: 8rem;">
    <i class="bi bi-calendar-event me-1"></i>
    {{ dataRichiesta }}
  </div>
  <div class="text-truncate" style="width: 8rem;">
    <i class="bi bi-clock me-1"></i>
    {{ oraRichiesta }}
  </div>
  
   Campi opzionali -->
  <!-- <div v-if="km" class="text-truncate" style="width: 8rem;">
    {{ km }} km
  </div>
  <div v-if="codiceUtente" class="text-truncate text-muted" style="width: 7rem;">
    <i class="bi bi-person me-1"></i>
    {{ codiceUtente }}
  </div>
    <div v-if="codiceVettore" class="text-truncate text-muted" style="width: 7rem;">
    <i class="bi bi-car-front-fill"></i>
    {{ codiceVettore }}
  </div>


</div> --> 


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
    <strong>Data e ora</strong>
  </div>
  <div class="col-2">
    {{ oraRichiesta }} - {{dataRichiesta}}
  </div>

  <div class="col-1">
    <div class="row-top">
      <strong>Utente </strong>
    </div>
    <div class="row-bottom">
      <strong>Vettore </strong>
    </div>
  </div>

  <div class="col-2">
    <div class="row-top text-truncate">
      #{{ codiceUtente }}
    </div>
    <div class="row-bottom text-truncate">
      #{{ codiceVettore}}
    </div>
  </div>
  
  <div v-if="status" class="col-1 pending">
    <strong>Richiesta  </strong>
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