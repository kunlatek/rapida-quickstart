<template>
  <a-select v-model:value="profile" style="width: 100%" placeholder="Tipo de perfil">
    <a-select-option value="person">Pessoa</a-select-option>
    <a-select-option value="company">Empresa</a-select-option>
  </a-select>

  <a-button type="primary" @click="submitProfile">
    Continuar
  </a-button>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const profile = ref<string>('');
    const router = useRouter();
    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    const submitProfile = () => {
      try {
        console.log(profile.value); // Agora funcionará corretamente
        if (profile.value === 'person') {
          sessionStorage.setItem('user', JSON.stringify({ ...user, isPerson: true }));
          router.push('/person-profile-form');
        } else if (profile.value === 'company') {
          sessionStorage.setItem('user', JSON.stringify({ ...user, isCompany: true }));
          router.push('/company-profile-form');
        }
      } catch (error) {
        console.error(error);
      }
    };

    return {
      profile,
      submitProfile
    };
  }
});
</script>
