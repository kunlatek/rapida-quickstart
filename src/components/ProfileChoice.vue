<template>
  <div class="background-theme"></div>
  <div class="container-div" style="padding: 20px 5px;">
    <div style="text-align: left; margin-bottom: 30px; width: 80%;">
      <a-typography-title :level="4" style="margin-bottom: 0px; margin-top: 10px;">Perfil</a-typography-title>
      <a-typography-text type="secondary">Escolha o tipo de perfil</a-typography-text>
    </div>

    <a-form layout="vertical" style="width: 80%;">
      <a-form-item label="Tipo de perfil">
        <a-select v-model:value="profile" style="width: 100%" placeholder="Tipo de perfil">
          <a-select-option value="">Escolha...</a-select-option>
          <a-select-option value="person">Pessoa</a-select-option>
          <a-select-option value="company">Empresa</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item>
        <a-button style="width: 100%;" type="primary" @click="submitProfile">
          Continuar
        </a-button>
      </a-form-item>
    </a-form>
  </div>
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
