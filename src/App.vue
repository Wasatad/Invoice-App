<template>
  <div
    class="app-content"
    :style="
      this.darkMode
        ? { 'background-color': xiketic }
        : { 'background-color': cultured }
    "
  >
    <DeleteModal v-if="deleteModalActive" />

    <InvoiceForm v-if="invoiceForm" />

    <control-panel></control-panel>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import ControlPanel from "./components/ControlPanel.vue";
import InvoiceForm from "./components/InvoicesForm.vue";
import DeleteModal from "./components/DeleteModal.vue";

export default {
  components: { ControlPanel, InvoiceForm, DeleteModal },

  computed: {
    ...mapState(["invoiceForm", "deleteModalActive", "darkMode"]),
    ...mapGetters(["xiketic", "cultured"]),
  },
};
</script>

<style lang="scss">
* {
  @import url("https://fonts.googleapis.com/css2?family=League+Spartan:wght@500;700&display=swap");
  font-family: "League Spartan", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

img {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
  outline: none;
  border: none;
}

ul[class],
ol[class] {
  list-style: none;
}

a:not([class]) {
  text-decoration-skip-ink: auto;
}

#app {
  min-height: 100vh;
}

.app-content {
  display: flex;
  flex-direction: row;

  min-height: 100vh;
  .content {
    max-width: 760px;
    width: 100%;
    margin: 72px auto 0;
    padding: 0 15px 60px;
  }
}
</style>
