import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import SettingsView from "@/views/SettingsView.vue";
import TimelineView from "@/views/TimelineView.vue";
import LoginView from "../views/LoginView.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/settings",
    name: "settings", 
    component: SettingsView,
  },
  {
    path: "/timeline",
    name: "timeline",
    component: TimelineView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,}
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
