<script setup lang="ts"></script>

<template>
<div class="tuple-utente">
  <span class="col nome">{{ nome }}</span>
  <span class="col cognome">{{ cognome }}</span>
  <span class="col codice">{{ codiceUtente }}</span>

  <span class="col right-icon">
    <a href="./infoUtente.vue">
      <i class="bi bi-info-circle"></i>
    </a>
    <a href="./modificaUtente.vue">
      <i class="bi bi-pencil-square"></i>
    </a>
    <i :class=" statoAbbonamento === 'active'
          ? 'bi bi-check-circle icon-green'
          : 'bi bi-ban icon-red' "></i>
  </span>
</div>

</template>

<style scoped>
.tuple-utente {
  display: grid;
  grid-template-columns: 10rem 10rem 8rem auto;  
  align-items: center;
  gap: 1rem;

  /* rettangolo */
  padding: 1rem;
  border: 1.5px solid #ccc;
  background-color: #e5e5e5;
  border-radius: 15px;
  width: fit-content;
}

.right-icon {
  display: flex;
  gap: 1rem;
  font-size: 1.3rem;
}

.icon-green {
  color: #28a745;
}

.icon-red {
  color: #d9534f;
}

</style>

<script>
  export default {
    name: "Utente",
    props:{
      nome: String,
      cognome: String,
      codiceUtente: String,
      statoAbbonamento: String
    }
  }
</script>
