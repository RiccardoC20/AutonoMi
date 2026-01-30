import useAuth from "../utils/useAuth";
import { publicEndpoints } from "../utils/endpoints";

export default defineEventHandler(async (event) => {
  
  console.log("middleware backend - evento")
  
  // 1. Lascia passare i file non-API (asset, SSR, ecc.)
  if (!event.path.startsWith("/api/")) {
    return;
  }

  console.log("middleware backend - auth.global - chiamata API")
  

  // 2. Endpoint pubblici: non richiedono login
  if (publicEndpoints.includes(event.path)) {
    return;
  }

  // 3. Controllo JWT
  const { ok } = await useAuth(event);
  
  if (!ok) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized – JWT mancante o non valido: loggati di nuovo"
    });
  }
});
