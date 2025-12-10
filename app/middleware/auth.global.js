import { ROUTE_PATHS, LOGIN_ROUTE_BY_ROLE } from "~/utils/routeNames";
import jwtDecode from 'jwt-decode';

export default defineNuxtRouteMiddleware(async (to, from, next) => { 

  

  //non interrompere bloccare le pagine di login
  if (LOGIN_ROUTE_BY_ROLE.includes(to.path)) {
    return;
  }
  console.log(LOGIN_ROUTE_BY_ROLE.routes.includes("/comune/login"))
console.log(to.path)
console.log("arrivo dopo if")
  
  const token = localStorage.auth_token; 
  const role = jwtDecode(token).role;

  if(!token)
    return navigateTo("/utente/login")

  // if (!to.path.startsWith(`/${role}`)) {
  //   return navigateTo(`/${role}/home`);
  // }
});
