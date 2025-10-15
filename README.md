# ArenaFit v3

Versión final con:
- Login validado contra Firestore (colección `admins` con campo `passwordHash`)
- Página de validación de DNI (ruta `/`)
- Middleware que protege `/` y redirige a `/login` si no hay sesión
- Escucha en tiempo real (onSnapshot) que cierra sesión si `activo` cambia a false o `passwordHash` cambia
- Animate.css integrado para animaciones discretas

## Instrucciones
1. Reemplazar `lib/firebase.js` con tu firebaseConfig.
2. Poner imágenes en `public/` (fondo-gym.png, icon-bars.png, logo-arenafit.png).
3. Instalar dependencias: `npm install`.
4. Correr en modo desarrollo: `npm run dev`.

## Notas
- En este prototipo `passwordHash` se compara directamente con el texto ingresado. En producción usar hashing (bcrypt) o Firebase Auth.
- La sesión se marca con la cookie `adminLogged=true` y con `localStorage` para identificar el adminDocId.
