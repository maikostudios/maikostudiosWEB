import { createRouter, createWebHistory } from "vue-router";
<<<<<<< Updated upstream
import HomeView from "@/views/HomeView.vue";
=======
// HomeView se carga perezosamente para mejorar LCP
// import HomeView from "@/views/HomeView.vue";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

import NotFoundView from '@/views/NotFoundView.vue'
>>>>>>> Stashed changes

const routes = [
  { path: "/", name: "Home", component: () => import(/* webpackChunkName: "home" */ "@/views/HomeView.vue") },
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
  // Rutas de administración
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: () => import("@/views/AdminLoginView.vue"),
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("@/views/AdminView.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    // Aquí verificarías si el usuario está autenticado
    // Por ahora, simplificamos la verificación
    const isAuthenticated =
      localStorage.getItem("admin_authenticated") === "true";

    if (!isAuthenticated) {
      // Redirigir al login si no está autenticado
      next("/admin/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
