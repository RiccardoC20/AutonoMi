import { ref, computed } from 'vue';

export interface User {
  _id: string;
  codiceUtente: string;
  nome: string;
  cognome: string;
  email: string;
  dataNascita: string;
  cellulare: string;
  indirizzo: string;
}

// Stato globale dell'autenticazione
const user = ref<User | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const isAuthenticated = computed(() => user.value !== null);

/**
 * Composable per gestire l'autenticazione dell'utente
 * 
 * Funziona così:
 * 1. Legge il token JWT dal localStorage
 * 2. Chiama l'API /api/utente/me con il token nell'header Authorization
 * 3. L'API verifica il token e restituisce i dati utente dal database
 * 4. Se valido: salva i dati utente nello stato
 * 5. Se non valido: rimuove il token e mostra errore
 */
export const useAuth = () => {
  /**
   * Verifica se l'utente è autenticato e carica i suoi dati
   * Questa funzione deve essere chiamata in ogni pagina che richiede autenticazione
   */
  const checkAuth = async () => {
    loading.value = true;
    error.value = null;

    try {
      // 1. Legge il token dal localStorage
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Token non trovato. Effettua il login.');
      }

      // 2. Chiama l'API per verificare il token e ottenere i dati utente
      // L'API /api/utente/me:
      //   - Verifica il token JWT
      //   - Se valido, cerca l'utente nel database usando l'ID dal token
      //   - Restituisce i dati utente (senza password)
      const response = await $fetch<{
        success: boolean;
        user: User;
      }>('/api/utente/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // 3. Se la risposta è positiva, salva i dati utente
      if (response.success) {
        user.value = response.user;
        // Salva anche in localStorage per accesso rapido (opzionale)
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }
    } catch (err: any) {
      // 4. Se c'è un errore, rimuove il token e i dati
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      user.value = null;
      
      error.value = err.data?.message || 'Errore di autenticazione. Effettua nuovamente il login.';
      console.error('Errore autenticazione:', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Logout: rimuove token e dati utente
   */
  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    user.value = null;
    error.value = null;
  };

  /**
   * Carica i dati utente dal localStorage (se presenti)
   * Utile per mostrare dati immediatamente mentre si verifica il token
   */
  const loadUserFromStorage = () => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        user.value = JSON.parse(userData);
      } catch (e) {
        console.error('Errore nel parsing user_data:', e);
      }
    }
  };

  return {
    // Stato
    user: computed(() => user.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    isAuthenticated,
    
    // Metodi
    checkAuth,
    logout,
    loadUserFromStorage
  };
};

