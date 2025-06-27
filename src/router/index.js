import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const routes = [
  { path: "/", name: "Home", component: HomeView },
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
  if (to.meta.requiresAuth) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next();
      } else {
        next("/admin/login");
      }
    });
  } else {
    next();
  }
});

export default router;
