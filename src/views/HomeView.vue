<script setup>
import { VContainer } from 'vuetify/components'
import HeroSection from '@/components/HeroSection.vue'
import Navbar from '../components/Navbar.vue';
</script>

<template>
    <v-container fluid class="pa-0">
        <Navbar />
        <HeroSection />
    </v-container>
</template>
