<template>
  <div class="d-flex min-vh-100">
    <SideBar
      :links="navigationLinks"
      :color="sidebarColor"
    />

    <div class="flex-grow-1 p-3">
      <h4 class="mb-4">{{ pageTitle }}</h4>
      <slot />
    </div>
  </div>
</template>

<script>
import SideBar from './SideBar.vue';

export default {
  name: "HomeLayout",
  components: {
    SideBar
  },
  props: {
    role: {
      type: String,
      required: true,
      validator: (value) => ['utente', 'vettore', 'comune'].includes(value)
    },
    pageTitle: {
      type: String,
      required: true
    }
  },
  computed: {
    navigationLinks() {
      const baseLinks = [
        {
          to: `/${this.role}/home`,
          label: 'Home',
          icon: 'bi bi-house'
        }
      ];

      switch (this.role) {
        case 'utente':
          return [
            ...baseLinks,
            { to: '/utente/prenotazione', label: 'Prenota', icon: 'bi bi-plus' },
            { to: '/utente/corse-prenotate', label: 'Prenotate', icon: 'bi bi-calendar' },
            { to: '/utente/corse-effettuate', label: 'Storico', icon: 'bi bi-clock' },
            { to: '/utente/invio-candidatura', label: 'Candidatura', icon: 'bi bi-send' }
          ];

        case 'vettore':
          return [
            ...baseLinks,
            { to: '/vettore/corse-prenotate', label: 'Corse', icon: 'bi bi-car-front' },
            { to: '/vettore/corse-effettuate', label: 'Completate', icon: 'bi bi-check' },
            { to: '/vettore/richieste', label: 'Richieste', icon: 'bi bi-bell' }
          ];

        case 'comune':
          return [
            ...baseLinks,
            { to: '/comune/utenti', label: 'Utenti', icon: 'bi bi-people' },
            { to: '/comune/vettori', label: 'Vettori', icon: 'bi bi-truck' },
            { to: '/comune/corse', label: 'Corse', icon: 'bi bi-car-front' },
            { to: '/comune/candidature', label: 'Candidature', icon: 'bi bi-file-text' }
          ];

        default:
          return baseLinks;
      }
    },
    sidebarColor() {
      switch (this.role) {
        case 'utente': return '#0066CC';
        case 'vettore': return '#FFC277';
        case 'comune': return '#00C383';
        default: return '#343a40';
      }
    }
  }
}
</script>

<style scoped>
/* Aggiunge margine sinistro per compensare la sidebar fissa */
.flex-grow-1 {
  margin-left: 200px;
}

/* Responsive: riduce il margine su mobile */
@media (max-width: 576px) {
  .flex-grow-1 {
    margin-left: 180px; /* Compensazione per la sidebar più stretta su mobile */
  }
}
</style>
