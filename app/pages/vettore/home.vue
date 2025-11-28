<script setup>
import SideBar from '~/components/SideBar.vue';

const links = [
  { label: "Home", to: "/vettore/home", icon: "bi bi-house" },
  { label: "Corse effettuate", to: "/vettore/corse-effettuate", icon: "bi bi-check-circle" },
  { label: "Corse prenotate", to: "/vettore/corse-prenotate", icon: "bi bi-calendar-check" },
  { label: "Richieste", to: "/vettore/richieste", icon: "bi bi-inbox" },
]
</script>

<template>
  <div class="d-flex">
    <SideBar color="#FFC277" :links="links" title="Vettore" />


  </div>
</template>

<style scoped></style>
