<template>
  <a-form-item>
    <a-select v-model:value="profile" style="width: 100%" placeholder="Tipo de perfil">
      <a-select-option value="person">Pessoa</a-select-option>
      <a-select-option value="company">Empresa</a-select-option>
    </a-select>
  </a-form-item>

  <a-form-item>
    <a-button type="primary" @click="submitProfile">
      Continuar
    </a-button>
  </a-form-item>
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

          location.reload();
        } else if (profile.value === 'company') {
          sessionStorage.setItem('user', JSON.stringify({ ...user, isCompany: true }));

          location.reload();
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
