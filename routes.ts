/**
 * Rutas y configuraciones de autenticación
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
export const DEFAULT_AUTH_REDIRECT = "/sign-in";

// Rutas públicas (accesibles sin autenticación)
export const publicRoutes = [
    "/sign-in",
    "/api/auth/*"  
];


// Rutas de autenticación (para manejo de redirecciones)
export const authRoutes = [
    "/sign-in",
    "/error"
];

// Prefijos para rutas API
export const apiAuthPrefix = "/api/auth";
export const apiPrefix = "/api";