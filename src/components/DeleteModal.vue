<template>
  <div @click.self="cancelDelete" class="modal-wrap">
    <transition name="delete-modal">
      <div v-if="animationIsReady" class="modal-card">
        <h2>Confirm Deletion</h2>

        <div class="description">
          Are you sure you want to delete invoice #{{
            currentInvoice.invoiceId
          }}? This action cannot be undone.
        </div>
        <div class="buttons">
          <button @click="cancelDelete">Cancel</button>
          <button @click="confirmDelete">
            <div class="lds-ring">
              Delete
              <div v-if="btnAnimation"></div>
            </div>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import router from "../router/router.js";
export default {
  data() {
    return {
      animationIsReady: false,
      btnAnimation: false,
    };
  },
  methods: {
    ...mapActions(["DELETE_INVOICE"]),
    ...mapMutations(["TOGGLE_MODAL", "SET_DELETION_RULE"]),
    async confirmDelete() {
      //Check if user allowed to delete invoice
      if (localStorage.getItem(this.currentInvoice.invoiceId)) {
        this.btnAnimation = true;
        await this.DELETE_INVOICE();
        this.btnAnimation = false;
        this.animationIsReady = false;
        setTimeout(() => {
          this.TOGGLE_MODAL();
          router.push({ name: "InvoicesList" });
        }, 600);
      } else {
        alert("Sorry! You can delete invoice only if you add it ;)");
      }
    },
    cancelDelete() {
      this.animationIsReady = false;
      setTimeout(() => {
        this.TOGGLE_MODAL();
      }, 600);
    },
  },
  computed: {
    ...mapState(["currentInvoice"]),
    ...mapGetters([
      "white",
      "xiketic",
      "cultured",
      "lightCoral",
      "redSalsa",
      "richBlack",
      "glaucous",
      "coolGrey",
      "lavenderWeb",
      "spaceCadetLight",
      "spaceCadetDark",
      "mediumPurple",
      "mediumSlateBlue",
      "autofillTextColor",
      "editBtnBg",
      "editBtnText",
      "editBtnBgHover",
    ]),
  },
  mounted() {
    window.scrollTo(0, 0);
    this.animationIsReady = true;
  },
};
</script>

<style lang="scss">
.modal-wrap {
  z-index: 1000;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0 15px;
  background-color: rgba(0, 0, 0, 0.6);

  .modal-card {
    background-color: v-bind(spaceCadetDark);

    max-width: 480px;
    padding: 46px;
    border-radius: 12px;
    color: #fff;
    @media (max-width: 800px) {
      padding: 24px;
    }

    h2 {
      font-weight: 700;
      font-size: 30px;
      margin-bottom: 16px;
      color: v-bind(autofillTextColor);
    }

    .description {
      font-weight: 400;
      font-size: 15px;
      line-height: 22px;
      color: v-bind(lavenderWeb);
      margin-bottom: 16px;
    }
    .buttons {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      @media (max-width: 400px) {
        flex-direction: column;
      }
      button {
        cursor: pointer;
        padding: 17px 24px;
        border-radius: 24px;
        font-weight: 700;
        font-size: 15px;
        color: v-bind(editBtnText);
        transition: 0.3s ease;
        &:nth-child(1) {
          background-color: v-bind(editBtnBg);
          &:hover {
            background-color: v-bind(editBtnBgHover);
          }
        }
        &:nth-child(2) {
          background-color: v-bind(redSalsa);
          &:hover {
            background-color: v-bind(lightCoral);
          }
        }
      }
    }
  }
  // Form transition
  .delete-modal-enter-active,
  .delete-modal-leave-active {
    transition: 0.6s ease all;
  }

  .delete-modal-enter-from,
  .delete-modal-leave-to {
    transform: translateY(1500px);
  }

  //Btn animation
  .lds-ring {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row-reverse;
    gap: 8px;
    color: #fff;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    width: 16px;
    height: 16px;
    border: 2px solid #fff;
    border-radius: 50%;
    animation: lds-ring 0.3s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
