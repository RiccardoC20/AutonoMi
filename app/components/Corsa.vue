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
  <div class="text-truncate" style="width: 12rem;">
    <i class="bi bi-calendar-event me-1"></i>
    {{ data?.toLocaleDateString() }}
  </div>
  <div class="text-truncate" style="width: 10rem;">
    <i class="bi bi-clock me-1"></i>
    {{ data?.toLocaleTimeString() }}
  </div>
  <div class="text-truncate fw-bold " style="width: 4rem;">
    {{ stimaKm }} km
  </div>

  <div class="d-flex align-items-center gap-2 ms-auto">
    <span v-for="(e ) in extra" style="min-width: 4.2rem;">
      {{ e }}
    </span>
  </div>
</div>
</template>

<script>
  export default {
    name: "Corsa",
    props:{
      partenza: String,
      arrivo: String,
      data: Date,
      stimaKm: Number,
      extra: Array
    }
  }
</script>