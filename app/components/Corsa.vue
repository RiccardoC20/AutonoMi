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
    {{ data?.toLocaleDateString() }}
  </div>
  <div class="text-truncate" style="width: 8rem;">
    <i class="bi bi-clock me-1"></i>
    {{ data?.toLocaleTimeString() }}
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
</div>
</template>

<script>
  export default {
    name: "Corsa",
    props: {
      partenza: String,
      arrivo: String,
      data: Date,
      stimaKm: Number,
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
    }
  }
</script>