<template>
  <div class="d-flex min-vh-100">
    <SideBar
      :links="navigationLinks"
      :role="role"
    />

    <div class="flex-grow-1 p-3">
      <!-- Header con informazioni utente/vettore/comune -->
      <div class="mb-4">
        <!-- Comune -->
        <div v-if="role === 'comune'" class="d-flex align-items-center">
          <h1 class="mb-0 fw-bold">{{ nomeComune }}</h1>
        </div>

        <!-- Vettore -->
        <div v-if="role === 'vettore'" class="d-flex align-items-center">
          <h1 class="mb-0 fw-bold">{{ nomeVettore }}</h1>
        </div>

        <!-- Utente -->
        <div v-if="role === 'utente' && userInfo" class="d-flex flex-column">
          <h1 class="mb-0 fw-bold">{{ userInfo.nome || 'Utente' }}</h1>
          <span v-if="userInfo.codiceUtente" class="text-muted">#{{ userInfo.codiceUtente }}</span>
        </div>
      </div>

      <slot />
    </div>
  </div>
</template>

<script>
import SideBar from './SideBar.vue';
import { useAuth } from '../../composables/useAuth';

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
  },
  setup(props) {
    // Per utente, carica i dati dall'autenticazione
    const { user, loadUserFromStorage } = useAuth();

    return {
      user,
      loadUserFromStorage,

    };
  },
  mounted() {
    // Carica dati utente dopo il mount
    if (this.role === 'utente') {
      this.loadUserFromStorage();
      // Verifica anche il token e carica i dati dall'API

    }
  },
  computed: {
    // Nome comune (mock, in produzione verrà da API)
    nomeComune() {
      return this.user?.nomeComune || 'Comune ';
    },
    nomeVettore() {
      return this.user?.nomeVettore || 'Agenzia di Trasporti';
    },
    // Informazioni utente
    userInfo() {
        const currentUser = this.user;
        if (currentUser) {
          return {
            nome: `${currentUser.nome || ''} ${currentUser.cognome || ''}`.trim() || 'Utente',
            cognome: currentUser.cognome || '',
            codiceUtente: currentUser.codiceUtente || ''
          };
        }
        return {
          nome: 'Utente',
          cognome: '',
          codiceUtente: ''
      }
    },
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
            { to: '/utente/contatti', label: 'Contatti', icon: 'bi bi-telephone' },
            { to: '/utente/invio-candidatura', label: 'Invio-Candidatura', icon: 'bi bi-send' },
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
    }
  }
}
</script>

<style scoped>
/* Aggiunge margine sinistro per compensare la sidebar fissa */
.flex-grow-1 {
  margin-left: 200px;
}
</style>
