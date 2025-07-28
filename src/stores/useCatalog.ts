import { defineStore } from 'pinia';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

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
      this.packs = [];
      this.plans = [];
      const snap = await getDocs(collection(db, 'pricing'));
      snap.forEach((d) => {
        const data = d.data();
        if (data.type === 'pack') {
          this.packs.push({ ...data, id: d.id });
        } else if (data.type === 'plan') {
          this.plans.push({ ...data, id: d.id });
        }
      });
      // Sort by order if available
      this.packs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      this.plans.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    },
  },
});
