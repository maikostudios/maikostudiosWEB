import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase/config";

const PACKS_COLLECTION = "pricing_packs";
const PLANS_COLLECTION = "pricing_plans";

export const pricingService = {
  // ========== PACKS (Pago único) ==========

  // Obtener todos los packs de precios activos
  async getAllPacks() {
    try {
      // Intentar con índice compuesto primero
      const q = query(
        collection(db, PACKS_COLLECTION),
        where("active", "==", true),
        orderBy("order", "asc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.warn(
        "Error con índice compuesto, usando fallback:",
        error.message
      );

      // Fallback: obtener todos y filtrar/ordenar en memoria
      try {
        const allDocsSnapshot = await getDocs(collection(db, PACKS_COLLECTION));
        const packs = allDocsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((pack) => pack.active === true)
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        console.log("✅ Packs obtenidos con fallback:", packs.length);
        return packs;
      } catch (fallbackError) {
        console.error("Error en fallback:", fallbackError);
        throw fallbackError;
      }
    }
  },

  // Obtener todos los packs (para admin)
  async getAllPacksAdmin() {
    try {
      const q = query(
        collection(db, PACKS_COLLECTION),
        orderBy("order", "asc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error obteniendo packs para admin:", error);
      throw error;
    }
  },

  // ========== PLANES (Suscripción) ==========

  // Obtener todos los planes de suscripción activos
  async getAllPlans() {
    try {
      // Intentar con índice compuesto primero
      const q = query(
        collection(db, PLANS_COLLECTION),
        where("active", "==", true),
        orderBy("order", "asc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.warn(
        "Error con índice compuesto, usando fallback:",
        error.message
      );

      // Fallback: obtener todos y filtrar/ordenar en memoria
      try {
        const allDocsSnapshot = await getDocs(collection(db, PLANS_COLLECTION));
        const plans = allDocsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((plan) => plan.active === true)
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        console.log("✅ Planes obtenidos con fallback:", plans.length);
        return plans;
      } catch (fallbackError) {
        console.error("Error en fallback:", fallbackError);
        throw fallbackError;
      }
    }
  },

  // Obtener todos los planes (para admin)
  async getAllPlansAdmin() {
    try {
      const q = query(
        collection(db, PLANS_COLLECTION),
        orderBy("order", "asc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error obteniendo planes para admin:", error);
      throw error;
    }
  },

  // ========== FUNCIONES PARA PACKS ==========

  // Crear nuevo pack con validación
  async createPack(packData) {
    try {
      // Validar datos requeridos
      if (!packData.name || !packData.price?.monthly) {
        throw new Error("Nombre y precio mensual son requeridos");
      }

      // Obtener el siguiente orden si no se especifica
      if (!packData.order) {
        const maxOrderPack = await this.getMaxOrderPack();
        packData.order = (maxOrderPack?.order || 0) + 1;
      }

      const newPack = {
        ...packData,
        type: "pack",
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      };

      const docRef = await addDoc(collection(db, PACKS_COLLECTION), newPack);
      console.log(`✅ Pack "${packData.name}" creado con ID: ${docRef.id}`);
      return { id: docRef.id, ...newPack };
    } catch (error) {
      console.error("Error creando pack:", error);
      throw error;
    }
  },

  // Obtener pack con mayor orden
  async getMaxOrderPack() {
    try {
      // Primero verificar si hay documentos en la colección
      const allDocsSnapshot = await getDocs(collection(db, PACKS_COLLECTION));

      if (allDocsSnapshot.empty) {
        return null;
      }

      // Si hay documentos, buscar el de mayor orden
      const q = query(
        collection(db, PACKS_COLLECTION),
        orderBy("order", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs[0]?.data() || null;
    } catch (error) {
      console.error("Error obteniendo pack con mayor orden:", error);
      // Si falla el orderBy, obtener todos y buscar manualmente
      try {
        const allDocsSnapshot = await getDocs(collection(db, PACKS_COLLECTION));
        let maxOrder = 0;
        let maxOrderPack = null;

        allDocsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.order && data.order > maxOrder) {
            maxOrder = data.order;
            maxOrderPack = data;
          }
        });

        return maxOrderPack;
      } catch (fallbackError) {
        console.error("Error en fallback de getMaxOrderPack:", fallbackError);
        return null;
      }
    }
  },

  // Actualizar pack
  async updatePack(packId, packData) {
    try {
      const packRef = doc(db, PACKS_COLLECTION, packId);
      const updatedData = {
        ...packData,
        updatedAt: new Date(),
      };
      await updateDoc(packRef, updatedData);
      return { id: packId, ...updatedData };
    } catch (error) {
      console.error("Error actualizando pack:", error);
      throw error;
    }
  },

  // Eliminar pack
  async deletePack(packId) {
    try {
      await deleteDoc(doc(db, PACKS_COLLECTION, packId));
      return true;
    } catch (error) {
      console.error("Error eliminando pack:", error);
      throw error;
    }
  },

  // ========== FUNCIONES PARA PLANES ==========

  // Crear nuevo plan de suscripción
  async createPlan(planData) {
    try {
      // Validar datos requeridos
      if (!planData.name || !planData.monthlyPrice) {
        throw new Error("Nombre y precio mensual son requeridos");
      }

      // Obtener el siguiente orden si no se especifica
      if (!planData.order) {
        const maxOrderPlan = await this.getMaxOrderPlan();
        planData.order = (maxOrderPlan?.order || 0) + 1;
      }

      const newPlan = {
        ...planData,
        type: "plan",
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
      };

      const docRef = await addDoc(collection(db, PLANS_COLLECTION), newPlan);
      console.log(`✅ Plan "${planData.name}" creado con ID: ${docRef.id}`);
      return { id: docRef.id, ...newPlan };
    } catch (error) {
      console.error("Error creando plan:", error);
      throw error;
    }
  },

  // Obtener plan con mayor orden
  async getMaxOrderPlan() {
    try {
      // Primero verificar si hay documentos en la colección
      const allDocsSnapshot = await getDocs(collection(db, PLANS_COLLECTION));

      if (allDocsSnapshot.empty) {
        return null;
      }

      // Si hay documentos, buscar el de mayor orden
      const q = query(
        collection(db, PLANS_COLLECTION),
        orderBy("order", "desc"),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs[0]?.data() || null;
    } catch (error) {
      console.error("Error obteniendo plan con mayor orden:", error);
      // Si falla el orderBy, obtener todos y buscar manualmente
      try {
        const allDocsSnapshot = await getDocs(collection(db, PLANS_COLLECTION));
        let maxOrder = 0;
        let maxOrderPlan = null;

        allDocsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.order && data.order > maxOrder) {
            maxOrder = data.order;
            maxOrderPlan = data;
          }
        });

        return maxOrderPlan;
      } catch (fallbackError) {
        console.error("Error en fallback de getMaxOrderPlan:", fallbackError);
        return null;
      }
    }
  },

  // Actualizar plan
  async updatePlan(planId, planData) {
    try {
      const planRef = doc(db, PLANS_COLLECTION, planId);
      const updatedData = {
        ...planData,
        updatedAt: new Date(),
      };
      await updateDoc(planRef, updatedData);
      return { id: planId, ...updatedData };
    } catch (error) {
      console.error("Error actualizando plan:", error);
      throw error;
    }
  },

  // Eliminar plan
  async deletePlan(planId) {
    try {
      await deleteDoc(doc(db, PLANS_COLLECTION, planId));
      return true;
    } catch (error) {
      console.error("Error eliminando plan:", error);
      throw error;
    }
  },

  // ========== ESTRUCTURAS DE DATOS ==========

  // Estructura de datos para nuevo pack
  getEmptyPack() {
    return {
      name: "",
      subtitle: "",
      price: {
        monthly: 0,
        annual: 0,
        currency: "CLP",
      },
      badge: {
        text: "",
        color: "primary",
        show: false,
      },
      features: [],
      cta: {
        text: "Contactar",
        action: "contact",
        whatsapp: true,
      },
      styling: {
        borderColor: "primary",
        highlighted: false,
        gradient: false,
      },
      active: true,
      order: 0,
      category: "web", // web, ecommerce, enterprise, custom
    };
  },

  // Estructura de datos para nuevo plan
  getEmptyPlan() {
    return {
      name: "",
      description: "",
      monthlyPrice: 0,
      annualPrice: 0,
      currency: "CLP",
      highlighted: false,
      features: [],
      active: true,
      order: 0,
    };
  },

  // Métodos para analytics y métricas
  async getPacksAnalytics() {
    try {
      const packs = await this.getAllPacksAdmin();
      const analytics = {
        totalPacks: packs.length,
        activePacks: packs.filter((p) => p.active).length,
        inactivePacks: packs.filter((p) => !p.active).length,
        categories: {},
        priceRanges: {
          low: 0, // < 500k CLP
          medium: 0, // 500k - 1M CLP
          high: 0, // > 1M CLP
        },
        averagePrice: 0,
        highlightedPacks: packs.filter((p) => p.styling?.highlighted).length,
      };

      // Análisis por categorías
      packs.forEach((pack) => {
        const category = pack.category || "other";
        analytics.categories[category] =
          (analytics.categories[category] || 0) + 1;

        // Análisis de rangos de precio
        const price = pack.price?.monthly || 0;
        if (price < 500000) analytics.priceRanges.low++;
        else if (price <= 1000000) analytics.priceRanges.medium++;
        else analytics.priceRanges.high++;
      });

      // Precio promedio
      const totalPrice = packs.reduce(
        (sum, pack) => sum + (pack.price?.monthly || 0),
        0
      );
      analytics.averagePrice =
        packs.length > 0 ? Math.round(totalPrice / packs.length) : 0;

      return analytics;
    } catch (error) {
      console.error("Error obteniendo analytics de packs:", error);
      throw error;
    }
  },

  // Registrar interacción con pack (para métricas)
  async trackPackInteraction(packId, action = "view") {
    try {
      const interactionData = {
        packId,
        action, // 'view', 'click_cta', 'contact'
        timestamp: new Date(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      };

      await addDoc(collection(db, "pack_interactions"), interactionData);
    } catch (error) {
      console.error("Error registrando interacción:", error);
      // No lanzar error para no afectar UX
    }
  },
};

// Estructura de ejemplo para referencia
export const samplePricingData = [
  {
    name: "Pack Básico",
    subtitle: "Perfecto para empezar",
    price: {
      monthly: 299,
      annual: 2990,
      currency: "USD",
    },
    badge: {
      text: "Más Popular",
      color: "success",
      show: true,
    },
    features: [
      "Sitio web responsive",
      "Hasta 5 páginas",
      "Diseño personalizado",
      "Optimización SEO básica",
      "Formulario de contacto",
      "Hosting incluido (1 año)",
      "SSL certificado",
      "Soporte técnico 24/7",
    ],
    cta: {
      text: "Comenzar Ahora",
      action: "contact",
      whatsapp: true,
    },
    styling: {
      borderColor: "success",
      highlighted: true,
      gradient: true,
    },
    active: true,
    order: 1,
    category: "web",
  },
  {
    name: "Pack Estándar",
    subtitle: "Para negocios en crecimiento",
    price: {
      monthly: 599,
      annual: 5990,
      currency: "USD",
    },
    badge: {
      text: "Recomendado",
      color: "primary",
      show: true,
    },
    features: [
      "Todo del Pack Básico",
      "Hasta 10 páginas",
      "Blog integrado",
      "Panel de administración",
      "Integración redes sociales",
      "Analytics avanzado",
      "Backup automático",
      "Optimización de velocidad",
    ],
    cta: {
      text: "Elegir Plan",
      action: "contact",
      whatsapp: true,
    },
    styling: {
      borderColor: "primary",
      highlighted: false,
      gradient: false,
    },
    active: true,
    order: 2,
    category: "web",
  },
];
