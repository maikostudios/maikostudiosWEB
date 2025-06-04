<template>
    <v-app-bar app color="primary" dark flat>
        <v-container class="d-flex justify-space-between align-center">
            <!-- Logo -->
            <RouterLink to="/" class="d-flex align-center text-decoration-none">
                <img src="/logo/logo_maikostudio.png" alt="Maiko Studios Logo" height="40" class="mr-2" />
                <span class="text-h6 font-weight-bold">Maiko Studios</span>
            </RouterLink>

            <!-- Navegación -->
            <v-row class="d-none d-md-flex" align="center">
                <v-btn to="/" text>Inicio</v-btn>
                <v-btn to="/portafolio" text>Portafolio</v-btn>
                <RouterLink to="/cv" class="ml-2">
                    <span class="text-h6 font-weight-bold">Mi CV</span>
                </RouterLink>

                <v-btn to="/contacto" text>Contacto</v-btn>
            </v-row>

            <!-- Botón flotante WhatsApp (solo visible en mobile) -->
            <v-btn icon class="d-md-none" href="https://wa.me/56949475207" target="_blank" color="success">
                <v-icon>mdi-whatsapp</v-icon>
            </v-btn>
        </v-container>
    </v-app-bar>
</template>

<script setup>
</script>

<style scoped>
img {
    max-height: 40px;
}
</style>