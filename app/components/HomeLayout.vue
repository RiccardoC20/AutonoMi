<template>
  <div class="d-flex min-vh-100">
    <SideBar
      :links="navigationLinks"
      :role="role"
    />

    <div class="flex-grow-1 p-3" style="background-color:  var(--color-background)">
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
        <div v-if="role === 'utente' && utenteInfo" class="d-flex">
          <h1 class="mb-0 fw-bold">{{ utenteInfo.nome || 'Utente' }}</h1>
          <span v-if="utenteInfo.codiceUtente" class="text-muted">#{{ utenteInfo.codiceUtente }}</span>
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
      this.loadUserFromStorage();
  },
  computed: {
    // Nome comune (mock, in produzione verrà da API)
    nomeComune() {
      return this.user?.nome;
    },
    nomeVettore() {
      return this.user?.nome;
    },
    // Informazioni utente
    utenteInfo() {
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
            { to: '/utente/prenotazione', label: 'Nuova corsa', icon: 'bi bi-plus' },
            { to: '/utente/richieste-in-sospeso', label: 'Richieste', icon: 'bi bi-clock' },
            { to: '/utente/contatti', label: 'Contatti', icon: 'bi bi-telephone' },
            //{ to: '/invio-candidatura', label: 'Invia Candidatura', icon: 'bi bi-send' },
          ];

        case 'vettore':
          return [
            { to: '/vettore/corse', label: 'Corse', icon: 'bi bi-car-front' },
            { to: '/vettore/richieste', label: 'Richieste', icon: 'bi bi-bell' },
            { to: '/vettore/inserisci-corsa', label: 'Nuova corsa', icon: 'bi bi-plus-circle' },
          ];

        case 'comune':
          return [
            ...baseLinks,
            { to: '/comune/utenti', label: 'Utenti', icon: 'bi bi-people' },
            { to: '/comune/vettori', label: 'Vettori', icon: 'bi bi-truck' },
            { to: '/comune/corse', label: 'Corse', icon: 'bi bi-car-front' },
            { to: '/comune/candidature', label: 'Candidature', icon: 'bi bi-file-text' },
            { to: '/comune/crea-vettore', label: 'Crea vettore', icon: 'bi bi-car-front' }
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
