<template>
  <div class="tuple-corsa" :style="{ width: 55 + extra.length * 5 + 'rem' }">
    <span class="location"> 
        <i class="bi bi-house-door-fill"></i> 
          {{ partenza }}  
      <i class="bi bi-arrow-right"></i>
        <i class="bi bi-flag-fill"></i> 
          {{ arrivo }}
    </span>
    <div class="time-info">
      <span class="item">
        <i class="bi bi-calendar-event"></i>
        {{ data.toLocaleDateString() }}
      </span>

      <span class="item">
        <i class="bi bi-clock"></i>
        {{ data.toLocaleTimeString() }}
      </span>
    </div>
    <span>
      {{ stimaKm }} km 
    </span>
    <span v-for="e in extra">
      {{ e.Number }}
    </span>
  </div>
</template>

<style scoped>
.tuple-corsa {
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 1rem;
  font-size: medium;
  border: 1.5px solid #ccc;
  background: #e5e5e5; 
  border-radius: 15px;
}

.location {
  font-weight: bold;
  font-size: 1.1rem;
}

.time-info {
  display: flex;
  gap: 1rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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