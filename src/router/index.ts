import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import ProfileChoiceView from "@/modules/ProfileChoiceView.vue";
import CompanyProfileFormView from "@/modules/CompanyProfileFormView.vue";
import PersonProfileFormView from "@/modules/PersonProfileFormView.vue";

// Manually defined core routes of the quickstart
const baseRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/profile-choice",
  },
  {
    path: "/profile-choice",
    name: "ProfileChoice",
    component: ProfileChoiceView,
  },
  {
    path: "/company-profile",
    name: "CompanyProfileForm",
    component: CompanyProfileFormView,
  },
  {
    path: "/person-profile",
    name: "PersonProfileForm",
    component: PersonProfileFormView,
  },
];

// ⬇️ Rapida Vibe: hook for dynamically generated routes
// Generated routes will be automatically injected here
const generatedRoutes: RouteRecordRaw[] = [
  // ⚠️ DO NOT REMOVE — populated dynamically by Rapida Vibe
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...baseRoutes, ...generatedRoutes],
});

export default router;
