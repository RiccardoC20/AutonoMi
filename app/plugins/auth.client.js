import { LOGIN_BY_ROLE } from "../utils/routeNames"
import { jwtDecode } from "jwt-decode";

export default defineNuxtPlugin(() => {
  const router = useRouter();
  
  // Questo viene eseguito OGNI volta che cambi pagina
  router.beforeEach((to) => {
    console.log("plugin lato client - controllo dominio in base all'attore");
    
    // Se sto andando in uno dei path di login non avvengono controlli
    if (Object.values(LOGIN_BY_ROLE).includes(to.path)) {
      return;
    }
    
    const token = localStorage.auth_token;
    const pathRole = to.path.split('/')[1] || 'utente';


    if (!token) {
      localStorage.removeItem('user_data');
      return navigateTo(`/${pathRole}/login`);
    }
    
    const tokenRole = jwtDecode(token).role;
    
    if (tokenRole != pathRole) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      return navigateTo(`/${tokenRole}/login`);
    }
  });
});