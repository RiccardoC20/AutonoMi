/**
 * File centralizzato con tutti gli endpoint dell'API
 * Utilizzare questo file per evitare di hardcodare i path degli endpoint
 */

// Endpoint per Utente
export const UTENTE_ENDPOINTS = {
  LOGIN: "/api/utente/login"
};

// Endpoint per Vettore
export const VETTORE_ENDPOINTS = {
  LOGIN: "/api/vettore/login",
  CREA: "/api/vettore/crea",
  GET: "/api/vettore/get"
};

// Endpoint per Comune
export const COMUNE_ENDPOINTS = {
  LOGIN: "/api/comune/login"
};

// Tutti gli endpoint raggruppati
export const ENDPOINTS = {
  UTENTE: UTENTE_ENDPOINTS,
  VETTORE: VETTORE_ENDPOINTS,
  COMUNE: COMUNE_ENDPOINTS
};

// Array di endpoint pubblici (non richiedono autenticazione JWT)
export const publicEndpoints = [
  UTENTE_ENDPOINTS.LOGIN,
  VETTORE_ENDPOINTS.LOGIN,
  COMUNE_ENDPOINTS.LOGIN
];

// Funzione helper per verificare se un endpoint è pubblico
export function isPublicEndpoint(path) {
  return publicEndpoints.includes(path);
}

