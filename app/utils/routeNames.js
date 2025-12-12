/**
 * Elenco centralizzato dei route names generati da Nuxt.
 * Questo evita di dover hardcodare stringhe sparse nel progetto.
 */
export const ROUTE_NAMES = {
  INDEX: "/",
  INVIO_CANDIDATURA: "/invio-candidatura",
  COMUNE: {
    HOME: "/comune/home",
    LOGIN: "/comune/login",
    ABBONAMENTI: "/comune/abbonamenti",
    CANDIDATURE: "/comune/candidature",
    CORSE: "/comune/corse",
    CREA_VETTORE: "/comune/crea/vettore",
    UTENTI: "/comune/utenti",
    VETTORI: "/comune/vettori",
  },
  UTENTE: {
    HOME: "/utente/home",
    LOGIN: "/utente/login",
    CORSE_EFFETTUATE: "/utente/corse/effettuate",
    CORSE_PRENOTATE: "/utente/corse/prenotate",
    INVIO_CANDIDATURA: "/utente/invio/candidatura",
    PRENOTAZIONE: "/utente/prenotazione",
  },
  VETTORE: {
    HOME: "/vettore/home",
    LOGIN: "/vettore/login",
    CORSE_EFFETTUATE: "/vettore/corse/effettuate",
    CORSE_PRENOTATE: "/vettore/corse/prenotate",
    RICHIESTE: "/vettore/richieste",
  },
};

// Mappatura di convenienza per recuperare velocemente il login per ruolo.
export const LOGIN_BY_ROLE = {
  COMUNE: ROUTE_NAMES.COMUNE.LOGIN,
  UTENTE: ROUTE_NAMES.UTENTE.LOGIN,
  VETTORE: ROUTE_NAMES.VETTORE.LOGIN,
  INDEX: ROUTE_NAMES.INDEX,
  INVIO_CANDIDATURA: ROUTE_NAMES.INVIO_CANDIDATURA
};
