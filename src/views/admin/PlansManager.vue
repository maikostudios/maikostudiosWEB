<template>
    <section class="p-6 bg-night/80 rounded-lg shadow-lg text-light">
        <h2 class="text-2xl font-bold mb-4">Gestión de Planes</h2>
        <v-btn color="primary" @click="abrirModal()">Agregar Plan</v-btn>

        <v-data-table :headers="headers" :items="plans" :loading="loading" class="mt-4" item-value="id" dense
            disable-sort>
            <template #item.actions="{ item }">
                <v-btn icon color="primary" @click="abrirModal(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="error" @click="eliminarPlan(item.id)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>

        <v-dialog v-model="modalVisible" max-width="600px">
            <v-card>
                <v-card-title>{{ isEdit ? 'Editar Plan' : 'Nuevo Plan' }}</v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="formValid">
                        <v-text-field v-model="form.name" label="Nombre" :rules="[rules.required]" required />
                        <v-text-field v-model.number="form.price" label="Precio" type="number"
                            :rules="[rules.required, rules.positive]" required />
                        <v-select v-model="form.periodicity" :items="periodicities" label="Periodicidad"
                            :rules="[rules.required]" required />
                        <v-textarea v-model="form.featuresText" label="Características (una por línea)"
                            :rules="[rules.required]" required rows="4" />
                        <v-checkbox v-model="form.highlight" label="Destacar" />
                        <v-file-input v-model="form.imageFile" label="Imagen" accept="image/*" prepend-icon="mdi-image"
                            show-size clearable />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="cerrarModal">Cancelar</v-btn>
                    <v-btn color="primary" :disabled="!formValid" @click="guardarPlan">{{ isEdit ? 'Guardar' : 'Crear'
                    }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { pricingService } from '@/firebase/services';

const plans = ref<any[]>([]);
const loading = ref(false);
const modalVisible = ref(false);
const isEdit = ref(false);
const formValid = ref(false);
const form = reactive({
    id: '',
    name: '',
    price: 0,
    periodicity: '',
    featuresText: '',
    highlight: false,
    imageFile: null as File | null,
    imageUrl: '',
});

const headers = [
    { title: 'Nombre', key: 'name' },
    { title: 'Precio', key: 'price' },
    { title: 'Periodicidad', key: 'periodicity' },
    { title: 'Destacar', key: 'highlight' },
    { title: 'Acciones', key: 'actions', sortable: false },
];

const periodicities = ['monthly', 'annual'];

const abrirModal = (plan: any = null) => {
    if (plan) {
        isEdit.value = true;
        form.id = plan.id;
        form.name = plan.name;
        form.price = plan.price;
        form.periodicity = plan.periodicity;
        form.featuresText = plan.features.join('\n');
        form.highlight = plan.highlight || false;
        form.imageUrl = plan.imageUrl || '';
    } else {
        isEdit.value = false;
        form.id = '';
        form.name = '';
        form.price = 0;
        form.periodicity = '';
        form.featuresText = '';
        form.highlight = false;
        form.imageFile = null;
        form.imageUrl = '';
    }
    modalVisible.value = true;
};

const cerrarModal = () => {
    modalVisible.value = false;
};

const cargarPlanes = async () => {
    loading.value = true;
    const res = await pricingService.fetchAll();
    if (res.success) {
        plans.value = res.data.filter((item: any) => item.type === 'plan');
    }
    loading.value = false;
};

const guardarPlan = async () => {
    if (!form.name || form.price <= 0 || !form.featuresText.trim() || !form.periodicity) return;

    loading.value = true;

    let imageUrl = form.imageUrl;
    if (form.imageFile) {
        const uploadRes = await pricingService.uploadImage(form.imageFile, `plans/${form.imageFile.name}`);
        if (uploadRes.success) {
            imageUrl = uploadRes.url;
        }
    }

    const planData = {
        name: form.name,
        price: form.price,
        periodicity: form.periodicity,
        features: form.featuresText.split('\n').map((f: string) => f.trim()).filter((f: string) => f),
        highlight: form.highlight,
        imageUrl,
        type: 'plan',
    };

    let res;
    if (isEdit.value) {
        res = await pricingService.update(form.id, planData);
    } else {
        res = await pricingService.create(planData);
    }

    if (res.success) {
        await cargarPlanes();
        cerrarModal();
    } else {
        alert('Error al guardar plan: ' + res.error);
    }

    loading.value = false;
};

const eliminarPlan = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este plan?')) return;
    loading.value = true;
    const res = await pricingService.delete(id);
    if (res.success) {
        await cargarPlanes();
    } else {
        alert('Error al eliminar plan: ' + res.error);
    }
    loading.value = false;
};

onMounted(() => {
    cargarPlanes();
});
</script>
</create_file>
