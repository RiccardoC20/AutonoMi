export interface UtenteType {
  _id: string;
  codiceUtente: string;
  nome: string;
  cognome: string;
  email: string;
  dataNascita: string;
  cellulare: string;
  budget: number;
}
export interface CandidaturaType {
  _id: string;
  codiceCandidatura: string;
  nome: string;
  cognome: string;
  email: string;
  dataNascita: string;
  cellulare: string;
}
export interface CorsaType {
  _id: string;
  partenza: string;
  arrivo: string;
  data: string;
  effettuata: boolean;
  stimaKm: number;
  kmEffettivi?: number;
  prezzo?: number;
  codiceUtente: string;
  codiceVettore: string;
}
export interface VettoreType {
  _id: string;
  codiceVettore: string;
  nome: string;
  email: string;
  numeroTelefono?: string;
  sede?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface ComuneType {
  name: string;
  numeroTelefono?: string;
}