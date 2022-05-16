import { createRouter, createWebHistory } from "vue-router";
import InvoicesList from "../components/InvoicesList.vue";

const routes = [
  {
    path: "/",
    name: "InvoicesList",
    component: InvoicesList,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
