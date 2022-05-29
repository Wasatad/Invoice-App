<template>
  <div class="app-content">
    <DeleteModal v-if="deleteModalActive" />

    <InvoiceForm v-if="invoiceForm" />

    <control-panel></control-panel>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ControlPanel from "./components/ControlPanel.vue";
import InvoiceForm from "./components/InvoicesForm.vue";
import DeleteModal from "./components/DeleteModal.vue";

export default {
  components: { ControlPanel, InvoiceForm, DeleteModal },
  computed: {
    ...mapState(["invoiceForm", "deleteModalActive"]),
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
  background-color: $xiketic;
  min-height: 100vh;
}

.app-content {
  display: flex;
  flex-direction: row;

  .content {
    max-width: 760px;
    width: 100%;
    margin: 72px auto 0;
    padding: 0 15px 60px;
  }
}
</style>
