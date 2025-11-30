<script setup>
import SideBar from '~/components/SideBar.vue';

const links = [
  { label: "Home", to: "/comune/home", icon: "bi bi-house" },
  { label: "Abbonamenti", to: "/comune/Abbonamenti", icon: "bi bi-check-circle" },
  { label: "Utenti", to: "/comune/utenti", icon: "bi bi-calendar-check" },
  { label: "Vettori", to: "/comune/vettori", icon: "bi bi-inbox" },
  { label: "Corse", to: "/comune/corse", icon: "bi bi-car-front-fill" },
  { label: "Candidature", to: "/comune/candidature", icon: "bi bi-file-earmark-arrow-down" },
]
</script>

<template>
  <div class="d-flex">
    <SideBar color="#00C383" :links="links" title="Comune" />

  </div>
</template>

<style scoped></style>
