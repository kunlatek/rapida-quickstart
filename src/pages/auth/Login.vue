<template>
  <a-form layout="vertical" @submit.prevent="handleLogin">
    <a-form-item label="Email">
      <a-input v-model:value="form.email" type="email" required />
    </a-form-item>
    <a-form-item label="Senha">
      <a-input-password v-model:value="form.password" required />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" block>Entrar</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/services/auth';
import { useAuthStore } from '@/store';

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  email: '',
  password: ''
});

const handleLogin = async () => {
  try {
    const { data } = await login(form);
    auth.setToken(data.token);
    router.push('/dashboard');
  } catch (error) {
    console.error('Erro ao fazer login:', error);
  }
};
</script>
