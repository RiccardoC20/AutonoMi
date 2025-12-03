<template>
  <div class="tuple-corsa d-flex align-items-center gap-4">
    <div class="d-grid" style="grid-auto-flow: column; grid-auto-columns: 11rem; gap: 1rem;">
      <span>
        <i class="bi bi-house-door-fill"></i>
        {{ partenza }}
      </span>
      <span>
        <i class="bi bi-flag-fill"></i>
        {{ arrivo }}
      </span>
    </div>
    <div class="d-flex gap-3">
      <span class="d-flex align-items-center gap-2">
        <i class="bi bi-calendar-event"></i>
        {{ data.toLocaleDateString() }}
      </span>

      <span class="d-flex align-items-center gap-2">
        <i class="bi bi-clock"></i>
        {{ data.toLocaleTimeString() }}
      </span>
    </div>
    <div>
      {{ stimaKm }} km
    </div>
    <div class="d-grid" style="grid-auto-flow: column; grid-auto-columns: 5rem; gap: 1rem;">
      <span v-for="e in extra" class="text-center">
        {{ e.Number }}
      </span>
    </div>

  </div>
</template>

<style scoped>
.tuple-corsa {
  padding: 1rem;
  font-size: medium;
  border: 1.5px solid #ccc;
  background: #e5e5e5;
  border-radius: 15px;
  width: fit-content;
}
</style>

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
  //----USE EXAMPLE------
  /*
  //tutti di dati che si vogliono aggiungere oltre a quelli già prestabiliti
  const extra1 =[
    { Number: "12345"},  //ID utente
    { Number: "54321"}   //ID vettore
  ]

  <div>
    <Corsa 
      partenza="Via Rosmini"
      arrivo="Via Francoforte" 
      :data="new Date('2025-03-12T15:00')" 
      :stimaKm="12.5"  
      :extra="extra1" />
  </div>

  */
</script>