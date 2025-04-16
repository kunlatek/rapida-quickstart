<template>
  <a-form layout="vertical" @submit.prevent="handleRegister">
    <a-form-item label="Nome">
      <a-input v-model:value="form.name" required />
    </a-form-item>
    <a-form-item label="Email">
      <a-input v-model:value="form.email" type="email" required />
    </a-form-item>
    <a-form-item label="Senha">
      <a-input-password v-model:value="form.password" required />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit" block>Cadastrar</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/services/auth';

const router = useRouter();

const form = reactive({
  name: '',
  email: '',
  password: ''
});

const handleRegister = async () => {
  try {
    await register(form);
    router.push('/login');
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
  }
};
</script>
