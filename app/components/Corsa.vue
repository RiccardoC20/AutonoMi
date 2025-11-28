<template>
  <div class="tuple-card">
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
      {{ e.label }}:  {{ e.Number }}
    </span>
  </div>
</template>

<style scoped>
.tuple-card {
  width: 100%;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  border: 1.5px solid #ccc;
  background: #e5e5e5; 
  border-radius: 15px;
  display: flex;
  padding: 1rem;
}

.location {
  font-weight: bold;
  font-size: 1.1rem;
}

.time-info {
  display: flex;
  gap: 12px;
}

.item {
  display: flex;
  align-items: center;
  gap: 6px;
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
  
</script>