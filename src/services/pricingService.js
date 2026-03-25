import apiClient from '@/api/apiClient';

export const pricingService = {
  // ========== FUNCIÓN COMPARTIDA ==========
  async _fetchEntities(endpoint) {
    try {
      const response = await apiClient.get(endpoint);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error(`Error obteniendo ${endpoint}:`, error);
      throw error;
    }
  },

  // ========== PACKS (Pago único) ==========

  // Obtener todos los packs de precios (el backend ya los ordena por order/displayOrder)
  async getAllPacks() {
    const packs = await this._fetchEntities('/pricing/packs');
    return packs.filter(p => p.active);
  },

  // Obtener todos los packs (para admin, muestra inactivos también si es necesario)
  async getAllPacksAdmin() {
    return this._fetchEntities('/pricing/packs');
  },

  // Crear nuevo pack
  async createPack(packData) {
    const response = await apiClient.post('/pricing/packs', packData);
    return response.data?.data || response.data;
  },

  // Actualizar pack
  async updatePack(packId, packData) {
    const response = await apiClient.put(`/pricing/packs/${packId}`, packData);
    return response.data?.data || response.data;
  },

  // Eliminar pack
  async deletePack(packId) {
    await apiClient.delete(`/pricing/packs/${packId}`);
    return true;
  },

  // ========== PLANES (Suscripción) ==========

  // Obtener todos los planes de suscripción
  async getAllPlans() {
    const plans = await this._fetchEntities('/pricing/plans');
    return plans.filter(p => p.active);
  },

  // Obtener todos los planes (para admin)
  async getAllPlansAdmin() {
    return this._fetchEntities('/pricing/plans');
  },

  // Crear nuevo plan
  async createPlan(planData) {
    const response = await apiClient.post('/pricing/plans', planData);
    return response.data?.data || response.data;
  },

  // Actualizar plan
  async updatePlan(planId, planData) {
    const response = await apiClient.put(`/pricing/plans/${planId}`, planData);
    return response.data?.data || response.data;
  },

  // Eliminar plan
  async deletePlan(planId) {
    await apiClient.delete(`/pricing/plans/${planId}`);
    return true;
  },

  // ========== ESTRUCTURAS DE DATOS BASE ==========

  getEmptyPack() {
    return {
      name: "",
      subtitle: "",
      price: { monthly: 0, annual: 0, currency: "CLP" },
      badge: { text: "", color: "primary", show: false },
      features: [],
      cta: { text: "Contactar", action: "contact", whatsapp: true },
      styling: { borderColor: "primary", highlighted: false, gradient: false },
      active: true,
      displayOrder: 0,
      category: "web", 
    };
  },

  getEmptyPlan() {
    return {
      name: "",
      subtitle: "",
      price: { monthly: 0, annual: 0, currency: "CLP" },
      features: [],
      active: true,
      displayOrder: 1, 
    };
  },

  async validateAndFixOrders() {
    // Almacenado como stub de compaibilidad
    console.log("Las correcciones de órdenes ahora se manejan idealmente en backend.");
    return false;
  },

  async getPacksAnalytics() {
    const packs = await this.getAllPacksAdmin();
    // Stub local analytics 
    return { totalPacks: packs.length };
  },

  async trackPackInteraction(packId, action = "view") {
    try {
      await apiClient.post('/stats/visit', { page: `pricing_interaction_${packId}_${action}` });
    } catch (e) {
      // ignore tracker err
    }
  }
};
