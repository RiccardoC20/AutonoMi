import { LOGIN_BY_ROLE } from "../utils/routeNames"
import { jwtDecode } from "jwt-decode";

export default defineNuxtPlugin(() => {
  const router = useRouter();
  
  // Questo viene eseguito OGNI volta che cambi pagina
  router.beforeEach((to) => {
    console.log("middleware frontend - SOLO CLIENT");
    
    // Se sto andando in uno dei path di login non avvengono controlli
    if (Object.values(LOGIN_BY_ROLE).includes(to.path)) {
      return;
    }
    
    const token = localStorage.auth_token;
    const pathRole = to.path.split('/')[1];

    if (!token) {
      return navigateTo(`/${pathRole}/login`);
    }
    
    const tokenRole = jwtDecode(token).role;
    
    if (tokenRole != pathRole) {
      return navigateTo(`/${tokenRole}/login`);
    }
  });
});