import { createRouter, createWebHistory } from "vue-router";
import InvoicesList from "../components/InvoicesList.vue";
import InvoiceDetails from "../components/InvoiceDetails.vue";

const routes = [
  {
    path: "/",
    name: "InvoicesList",
    component: InvoicesList,
  },
  {
    path: "/invoice/:invoiceId",
    name: "InvoiceDetails",
    component: InvoiceDetails,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
