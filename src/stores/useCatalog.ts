import { defineStore } from 'pinia';
import { pricingService } from '@/services/pricingService';

interface Pack {
  id: string;
  name: string;
  price: number;
  features: string[];
  order?: number;
  highlight?: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  periodicity: 'monthly' | 'annual';
  features: string[];
  order?: number;
  highlight?: boolean;
}

export const useCatalog = defineStore('catalog', {
  state: () => ({
    packs: [] as Pack[],
    plans: [] as Plan[],
  }),
  actions: {
    async fetchAll() {
      try {
        const [packsResponse, plansResponse] = await Promise.all([
          pricingService.getAllPacks(),
          pricingService.getAllPlans()
        ]);
        this.packs = packsResponse || [];
        this.plans = plansResponse || [];
        // Sort by order if available
        this.packs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        this.plans.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      } catch (error) {
        console.error('Error en fetchAll Catalog:', error);
      }
    },
  },
});
