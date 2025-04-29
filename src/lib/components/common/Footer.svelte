<script>
  import { Footer, FooterBrand, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte';
</script>

<Footer class="rounded-none">
  <div class="w-full max-w-7xl mx-auto">
    <div class="grid w-full sm:flex md:grid-cols-2 gap-8 sm:gap-6">
      <div class="md:col-span-1">
        <FooterBrand
          href="/"
          src="/images/logo.svg"
          alt="Logo"
          name="Rapida Quickstart"
        />
        <p class="my-4 text-sm text-gray-600 dark:text-gray-400">
          Plataforma de gerenciamento de perfis com controle de acesso e autenticação segura.
        </p>
      </div>
      <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:mt-0 mt-8">
        <div>
          <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Recursos</h2>
          <FooterLinkGroup>
            <FooterLink href="/dashboard">Dashboard</FooterLink>
            <FooterLink href="/profile/person">Perfil Pessoa</FooterLink>
            <FooterLink href="/profile/company">Perfil Empresa</FooterLink>
          </FooterLinkGroup>
        </div>
        <div>
          <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
          <FooterLinkGroup>
            <FooterLink href="/privacy-policy">Política de Privacidade</FooterLink>
            <FooterLink href="/terms-of-service">Termos de Serviço</FooterLink>
          </FooterLinkGroup>
        </div>
      </div>
    </div>
    <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
    <FooterCopyright 
      href="/"
      by="Rapida Quickstart™"
      year={new Date().getFullYear()}
    />
  </div>
</Footer>