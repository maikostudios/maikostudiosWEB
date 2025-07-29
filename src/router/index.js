import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { authService } from "@/services/authService";
import NotFoundView from "@/views/NotFoundView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "home" */ "@/views/HomeView.vue"),
  },
  {
    path: "/sobre-mi",
    name: "SobreMi",
    component: () => import("@/views/SobreMiView.vue"),
  },
  {
    path: "/portafolio",
    name: "Portafolio",
    component: () => import("@/views/PortafolioView.vue"),
  },
  { path: "/cv", name: "CV", component: () => import("@/views/CvView.vue") },
  {
    path: "/servicios",
    name: "Servicios",
    component: () => import("@/views/ServiciosView.vue"),
  },
  {
    path: "/precios",
    name: "Precios",
    component: () => import("@/views/PreciosView.vue"),
  },
  {
    path: "/contacto",
    name: "Contacto",
    component: () => import("@/views/ContactoView.vue"),
  },
  // Formulario interactivo y seguimiento
  {
    path: "/form-interactivo",
    name: "FormInteractivo",
    component: () => import("@/views/FormInteractivoView.vue"),
  },
  {
    path: "/seguimiento",
    name: "Seguimiento",
    component: () => import("@/views/SeguimientoView.vue"),
  },
  // Rutas de autenticación y administración
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/loginview.vue"), // Apunta a la vista de Login existente
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("@/views/AdminView.vue"),
    meta: { requiresAuth: true },
  },
  // Ruta catch-all para 404 Not Found
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Helper para obtener el estado de autenticación actual de forma asíncrona y segura.
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    // onAuthStateChanged devuelve una función para desuscribirse del observador.
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe(); // Nos desuscribimos inmediatamente para evitar memory leaks.
        resolve(user); // Resolvemos la promesa con el usuario (o null).
      },
      reject // Rechazamos la promesa si hay un error.
    );
  });
};

// Guard de navegación para rutas protegidas
router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth) {
    const user = await getCurrentUser();

    // Verificar si hay usuario y si es admin autorizado
    if (
      !user ||
      user.isAnonymous ||
      !authService.isAuthorizedEmail(user.email)
    ) {
      console.log("🚫 Acceso denegado a ruta protegida. Redirigiendo a /login");
      next({ name: "Login" });
      return;
    }

    console.log("✅ Usuario admin autorizado:", user.email);
  }

  // Permitir navegación
  next();
});

export default router;
