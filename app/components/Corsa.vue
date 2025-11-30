<template>
  <div class="tuple-corsa" >
    <span class="col start-end"> 
        <span>
          <i class="bi bi-house-door-fill"></i> 
          {{ partenza  }}  
        </span>
        <span>
          <i class="bi bi-flag-fill"></i> 
          {{ arrivo }}
        </span>
    </span>
    <div class="col time-info">
      <span class="item">
        <i class="bi bi-calendar-event"></i>
        {{ data.toLocaleDateString() }}
      </span>

      <span class="item">
        <i class="bi bi-clock"></i>
        {{ data.toLocaleTimeString() }}
      </span>
    </div>
    <span class="col">
      {{ stimaKm }} km 
    </span>
    <span class="col extra-container">
      <span v-for="e in extra">
        {{ e.Number }}
      </span>
    </span>
  </div>
</template>

<style scoped>
.tuple-corsa {
  display: grid;
  grid-template-columns: 25rem 15rem 7rem  auto; 
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  font-size: medium;

  /* rettangolo */
  border: 1.5px solid #ccc;
  background: #e5e5e5; 
  border-radius: 15px;
  width: fit-content;
}

.start-end {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 11rem;
  gap: 1rem;

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

.extra-container {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 5rem;
  gap: 1rem;
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