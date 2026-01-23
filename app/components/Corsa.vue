<script setup lang="ts"></script>

<template>
<div class="d-flex align-items-center gap-3 p-3 bg-light border rounded-3 w-auto">
  <div class="text-truncate fw-bold" style="width: 15rem;">
    <i class="bi bi-house-door-fill me-1"></i>
    {{ partenza }}
  </div>
  <div class="text-truncate fw-bold" style="width: 15rem;">
    <i class="bi bi-flag-fill me-1"></i>
    {{ arrivo }}
  </div>
  <div class="text-truncate" style="width: 8rem;">
    <i class="bi bi-calendar-event me-1"></i>
    {{ dataOggi }}
  </div>
  <div class="text-truncate" style="width: 8rem;">
    <i class="bi bi-clock me-1"></i>
    {{ oraAttuale }}
  </div>
  
  <!-- Campi opzionali -->
  <div v-if="stimaKm" class="text-truncate fw-bold " style="width: 5rem;">
    {{ stimaKm }} km
  </div>
  <div v-if="kmEffettivi" class="text-truncate fw-bold text-success" style="width: 5rem;">
    {{ kmEffettivi }} km
  </div>
  <div v-if="prezzo" class="text-truncate fw-bold text-info" style="width: 7rem;">
    <i class="bi bi-currency-euro me-1"></i>
    {{ prezzo }}€
  </div>
  <div v-if="codiceUtente" class="text-truncate text-muted" style="width: 7rem;">
    <i class="bi bi-person me-1"></i>
    {{ codiceUtente }}
  </div>
  <div v-if="nomeVettore" class="text-truncate text-muted" style="width: 17.5rem;">
    <i class="bi bi-truck me-1"></i>
    {{ nomeVettore }}
  </div>

  <!-- Bottone per completare la corsa -->
  <div v-if="!effettuata" class="ms-auto">
    <button 
      type="button" 
      class="btn btn-success btn-sm"
      data-bs-toggle="modal" 
      data-bs-target="#corsaEffettuataBackdrop"
    >
    Effettua
    <i class="bi bi-check-circle me-1"></i>
    </button>
  </div>
</div>

<!-- Modal Logout -->
<div class="modal fade" id="corsaEffettuataBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Corsa Effettua?</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        Questa corsa è stata effettuata?
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Chiudi</button>
        <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="$emit('corsaEffettuata')">Conferma</button>
      </div>
    </div>
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
      stimaKm: Number,
      effettuata : {
        type: Boolean,
        default: null
      },
      kmEffettivi: {
        type: Number,
        default: null
      },
      prezzo: {
        type: [Number, String],
        default: null
      },
      codiceUtente: {
        type: String,
        default: null
      },
      nomeVettore: {
        type: String,
        default: null
      }
    },
    emits: ['corsaEffettuata'],

    computed: {
      dataOggi() {
        return new Intl.DateTimeFormat('it-IT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).format(new Date())
      },

      oraAttuale() {
        return new Intl.DateTimeFormat('it-IT', {
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date())
      }
    }
  }

</script>