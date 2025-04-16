<template>
  <div>
    <h1>Dashboard</h1>
    <p>Bem-vindo, {{ user?.name || 'usuário' }}!</p>

    <a-divider />

    <a-card title="Módulos disponíveis">
      <ul>
        <li v-for="mod in modules" :key="mod.id">
          {{ mod.title || mod.id }}
        </li>
      </ul>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/store';

const auth = useAuthStore();

const user = computed(() => auth.user);

// Em breve: carregar dinamicamente do objeto Rápida
const modules = [
  { id: 'usuarios', title: 'Usuários' },
  { id: 'relatorios', title: 'Relatórios' }
];
</script>
