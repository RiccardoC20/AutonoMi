<script setup>
import SideBar from '~/components/SideBar.vue';

const links = [
  { label: "Home", to: "/utente/home", icon: "bi bi-house" },
  { label: "Corse effettuate", to: "/utente/corse-effettuate", icon: "bi bi-check-circle" },
  { label: "Corse prenotate", to: "/utente/corse-prenotate", icon: "bi bi-calendar-check" },
  { label: "Prenotazione", to: "/utente/prenotazione", icon: "bi bi-inbox" },
  { label: "Invio Candidatura", to: "/utente/invio-candidatura", icon: "bi bi-file-earmark-arrow-up" },
]
</script>

<template>
  <div class="d-flex">
    <SideBar color="#00AAFF" :links="links" />

  </div>
</template>

<style scoped></style>
