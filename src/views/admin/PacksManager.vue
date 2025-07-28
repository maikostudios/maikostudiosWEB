<template>
    <section class="p-6 bg-night/80 rounded-lg shadow-lg text-light">
        <h2 class="text-2xl font-bold mb-4">Gestión de Packs</h2>
        <v-btn color="primary" @click="abrirModal()">Agregar Pack</v-btn>

        <v-data-table :headers="headers" :items="packs" :loading="loading" class="mt-4" item-value="id" dense
            disable-sort>
            <template #item.actions="{ item }">
                <v-btn icon color="primary" @click="abrirModal(item)">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon color="error" @click="eliminarPack(item.id)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </v-data-table>

        <v-dialog v-model="modalVisible" max-width="600px">
            <v-card>
                <v-card-title>{{ isEdit ? 'Editar Pack' : 'Nuevo Pack' }}</v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="formValid">
                        <v-text-field v-model="form.name" label="Nombre" :rules="[rules.required]" required />
                        <v-text-field v-model.number="form.price" label="Precio" type="number"
                            :rules="[rules.required, rules.positive]" required />
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
                    <v-btn color="primary" :disabled="!formValid" @click="guardarPack">{{ isEdit ? 'Guardar' : 'Crear'
                    }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { pricingService } from '@/firebase/services.js';

const packs = ref<any[]>([]);
const loading = ref(false);
const modalVisible = ref(false);
const isEdit = ref(false);
const formValid = ref(false);
const form = reactive({
    id: '',
    name: '',
    price: 0,
    featuresText: '',
    highlight: false,
    imageFile: null,
    imageUrl: '',
});

const headers = [
    { title: 'Nombre', key: 'name' },
    { title: 'Precio', key: 'price' },
    { title: 'Destacar', key: 'highlight' },
    { title: 'Acciones', key: 'actions', sortable: false },
];

const abrirModal = (pack: any = null) => {
    if (pack) {
        isEdit.value = true;
        form.id = pack.id;
        form.name = pack.name;
        form.price = pack.price;
        form.featuresText = pack.features.join('\n');
        form.highlight = pack.highlight || false;
        form.imageUrl = pack.imageUrl || '';
    } else {
        isEdit.value = false;
        form.id = '';
        form.name = '';
        form.price = 0;
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

const cargarPacks = async () => {
    loading.value = true;
    const res = await pricingService.fetchAll();
    if (res.success) {
        packs.value = res.data.filter((item: any) => item.type === 'pack');
    }
    loading.value = false;
};

const guardarPack = async () => {
    if (!form.name || form.price <= 0 || !form.featuresText.trim()) return;

    loading.value = true;

    let imageUrl = form.imageUrl;
    if (form.imageFile) {
        const uploadRes = await pricingService.uploadImage(form.imageFile, `packs/${form.imageFile.name}`);
        if (uploadRes.success) {
            imageUrl = uploadRes.url;
        }
    }

    const packData = {
        name: form.name,
        price: form.price,
        features: form.featuresText.split('\n').map((f: string) => f.trim()).filter((f: string) => f),
        highlight: form.highlight,
        imageUrl,
        type: 'pack',
    };

    let res;
    if (isEdit.value) {
        res = await pricingService.update(form.id, packData);
    } else {
        res = await pricingService.create(packData);
    }

    if (res.success) {
        await cargarPacks();
        cerrarModal();
    } else {
        alert('Error al guardar pack: ' + res.error);
    }

    loading.value = false;
};

const eliminarPack = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este pack?')) return;
    loading.value = true;
    const res = await pricingService.delete(id);
    if (res.success) {
        await cargarPacks();
    } else {
        alert('Error al eliminar pack: ' + res.error);
    }
    loading.value = false;
};

onMounted(() => {
    cargarPacks();
});
</script>
</create_file>
