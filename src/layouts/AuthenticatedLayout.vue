<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider collapsible>
      <div class="logo">Rápida</div>
      <a-menu theme="dark" mode="inline" :selectedKeys="[activeRoute]">
        <a-menu-item
          v-for="mod in modules"
          :key="mod.id"
          @click="navigate(mod.path)"
        >
          {{ mod.title }}
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <div class="header-right">
          <a-button type="link" @click="logout">Sair</a-button>
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 16px">
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const activeRoute = route.name?.toString() || '';

const modules = [
  { id: 'dashboard', title: 'Dashboard', path: '/dashboard' },
  { id: 'usuarios', title: 'Usuários', path: '/usuarios' }
  // 🚧 Em breve: isso virá do objeto base!
];

const navigate = (path: string) => {
  router.push(path);
};

const logout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<style scoped>
.logo {
  height: 32px;
  margin: 16px;
  color: white;
  font-weight: bold;
}
.header-right {
  text-align: right;
  padding-right: 20px;
}
</style>
