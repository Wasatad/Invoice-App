<template>
  <div
    @click.self="closeForm"
    ref="formWrapper"
    :class="[loading ? noScroll : '', formWrapper]"
  >
    <transition name="form">
      <form
        v-if="animationIsReady"
        @submit.prevent="submitForm"
        class="invoice-content"
        :style="
          this.darkMode
            ? { 'background-color': xiketic }
            : { 'background-color': white }
        "
      >
        <loading-animation v-if="loading"></loading-animation>
        <div @click="closeForm" class="go-back">
          <img src="../assets/icon-arrow-left.svg" alt="" />
          <span :style="this.darkMode ? { color: white } : { color: richBlack }"
            >Go Back</span
          >
        </div>
        <h1
          v-if="!editingMode"
          class="form-title"
          :style="this.darkMode ? { color: white } : { color: richBlack }"
        >
          New Invoice
        </h1>
        <h1
          v-else
          class="form-title"
          :style="this.darkMode ? { color: white } : { color: richBlack }"
        >
          Edit Invoice
        </h1>
        <!-- Bill from -->

        <div class="bill-from">
          <div class="bill-from-title">Bill From</div>
          <div class="input-block">
            <label for="senderStreet">Street Adress</label>
            <input
              required
              type="text"
              id="senderStreet"
              v-model="senderAddress.street"
            />
          </div>
          <div class="location input-block">
            <div class="input-container">
              <label for="senderCity">City</label>
              <input
                required
                type="text"
                id="senderCity"
                v-model="senderAddress.city"
              />
            </div>
            <div class="input-container">
              <label for="senderPost">Post Code</label>
              <input
                required
                type="text"
                id="senderPost"
                v-model="senderAddress.postCode"
              />
            </div>
            <div class="input-container">
              <label for="senderCountry">Country</label>
              <input
                required
                type="text"
                id="senderCountry"
                v-model="senderAddress.country"
              />
            </div>
          </div>
        </div>
        <!-- Bill to -->
        <div class="bill-to">
          <div class="bill-to-title">Bill To</div>
          <div class="input-block">
            <label for="clientName">Client’s Name</label>
            <input required type="text" id="clientName" v-model="clientName" />
          </div>
          <div class="input-block">
            <label for="clientEmail">Client’s Email</label>
            <input
              required
              type="text"
              id="clientEmail"
              v-model="clientEmail"
            />
          </div>
          <div class="input-block">
            <label for="clientAddress">Street Address</label>
            <input
              required
              type="text"
              id="clientAddress"
              v-model="clientAddress.street"
            />
          </div>
          <div class="location input-block">
            <div class="input-container">
              <label for="clientCity">City</label>
              <input
                required
                type="text"
                id="clientCity"
                v-model="clientAddress.city"
              />
            </div>
            <div class="input-container">
              <label for="clientPost">Post Code</label>
              <input
                required
                type="text"
                id="clientPost"
                v-model="clientAddress.postCode"
              />
            </div>
            <div class="input-container">
              <label for="clientCountry">Country</label>
              <input
                required
                type="text"
                id="clientCountry"
                v-model="clientAddress.country"
              />
            </div>
          </div>
        </div>
        <!-- Invoice Date -->

        <div class="date input-block">
          <div class="input-container">
            <label @click="dateFormatter" for="createdAt">Invoice Date</label>
            <Datepicker
              v-model="datePicked"
              :dark="darkMode"
              autoApply
              :clearable="false"
              :autoPosition="true"
              :enableTimePicker="false"
              :format="dateFormatter"
              :readonly="this.$store.state.editingMode"
            >
            </Datepicker>
          </div>
          <div class="input-container">
            <div class="select-title">
              <span>Payment Terms</span>
            </div>
            <div
              class="payment-terms"
              :style="this.darkMode ? { color: white } : { color: richBlack }"
            >
              <div
                v-show="isSelectOpened"
                class="select-options"
                :style="
                  this.darkMode
                    ? { 'background-color': spaceCadetLight, color: white }
                    : {
                        'background-color': white,
                        color: '#1E2139',
                        'box-shadow': '0px 10px 20px rgba(72, 84, 159, 0.25)',
                      }
                "
              >
                <div @click="setPaymentTerm" data-term="1" class="option">
                  Net 1 Day
                </div>
                <div @click="setPaymentTerm" data-term="7" class="option">
                  Net 7 Days
                </div>
                <div @click="setPaymentTerm" data-term="14" class="option">
                  Net 14 Days
                </div>
                <div @click="setPaymentTerm" data-term="30" class="option">
                  Net 30 Days
                </div>
              </div>
              <div class="custom-select">
                <div @click="toggleSelect" class="custom-select-title">
                  <span class="custom-select-dropdown">{{
                    paymentTermTitle
                  }}</span>
                  <img
                    class="arrow-select"
                    src="../assets/icon-arrow-down.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="input-block">
          <label for="description">Project Description</label>
          <input required type="text" id="description" v-model="description" />
        </div>
        <div class="form-item-list">
          <h2 class="list-title">Item List</h2>
          <div
            v-for="(item, index) in items"
            :key="index"
            class="item-row input-block"
          >
            <div class="item-name">
              <label for="itemName">Item Name</label>
              <input required type="text" id="itemName" v-model="item.name" />
            </div>
            <div class="qty">
              <label for="qty">Qty.</label>
              <input
                @input="validate"
                required
                type="number"
                id="qty"
                v-model="item.qty"
              />
            </div>
            <div class="price">
              <label for="price">Price</label>
              <input
                required
                @input="validate"
                type="number"
                min="1"
                id="price"
                v-model="item.price"
              />
            </div>
            <div class="total">
              <label class="total-label">Total</label>
              <div
                class="total-price"
                :style="this.darkMode ? { color: white } : { color: richBlack }"
              >
                ${{
                  (item.total = validated(item.qty) * validated(item.price))
                }}
              </div>
            </div>
            <div @click="deleteItem(item.id)" class="icon-delete">
              <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
                  fill="#888EB0"
                  fill-rule="nonzero"
                />
              </svg>
            </div>
          </div>
        </div>
        <button @click.prevent="addItem" class="add-item">
          + Add New Item
        </button>
        <div v-if="emptyItems" class="alert">- An item must be added</div>
        <div class="bottom-buttons">
          <div class="left-side">
            <button
              v-show="!editingMode"
              type="button"
              @click="closeForm"
              class="discard"
            >
              Discard
            </button>
          </div>
          <div class="right-side">
            <button
              v-if="!editingMode"
              type="submit"
              @click="saveDraft"
              class="draft"
            >
              Save as Draft
            </button>
            <button
              v-if="editingMode"
              type="button"
              @click="closeForm"
              class="cancel-btn"
            >
              Cancel
            </button>
            <button type="submit" @click="sendInvoice" class="send">
              {{ !editingMode ? "Save & Send" : "Save Changes" }}
            </button>
          </div>
        </div>
      </form>
    </transition>
  </div>
</template>

<script>
import LoadingAnimation from "./LoadingAnimation.vue";
import db from "../firebase/firebaseInit";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { uid } from "uid";
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
export default {
  components: { Datepicker, LoadingAnimation },
  data() {
    return {
      id: null,
      createdAt: null,
      paymentDue: null,
      description: null,
      paymentTerms: 1,
      clientName: null,
      clientEmail: null,
      status: null,
      senderAddress: {
        street: null,
        city: null,
        postCode: null,
        country: null,
      },
      clientAddress: {
        street: null,
        city: null,
        postCode: null,
        country: null,
      },
      items: [
        {
          name: "",
          qty: 1,
          price: "0",
          total: "0",
        },
      ],
      total: 0,

      paymentTermTitle: "Net 1 Day",
      isSelectOpened: false,
      datePicked: this.$store.state.editingMode
        ? new Date(Date.parse(this.$store.state.currentInvoice.createdAt))
        : new Date(),
      animationIsReady: false,
      emptyItems: false,
      loading: false,

      //CSS switcher for form-wrapper
      noScroll: "no-scroll",
      formWrapper: "form-wrapper",
    };
  },

  methods: {
    ...mapMutations(["TOGGLE_FORM", "TOGGLE_EDITING_MODE"]),
    ...mapActions(["GET_INVOICES"]),
    toggleSelect() {
      if (this.isSelectOpened == false) {
        this.isSelectOpened = true;
        document.querySelector(".arrow-select").style.transform =
          "scale(1, -1)";
      } else {
        this.isSelectOpened = false;
        document.querySelector(".arrow-select").style.transform = "scale(1, 1)";
      }
    },
    hideSelectOptions() {
      this.isSelectOpened = false;
      document.querySelector(".arrow-select").style.transform = "scale(1, 1)";
    },
    setPaymentTerm(e) {
      this.paymentTerms = +e.target.dataset.term;
      this.paymentTermTitle = e.target.innerText;
      this.hideSelectOptions();
    },
    dateFormatter(date) {
      const day = date.getDate();
      function month() {
        if (date.getMonth() == 0) {
          return "Jan";
        } else if (date.getMonth() == 1) {
          return "Feb";
        } else if (date.getMonth() == 2) {
          return "Mar";
        } else if (date.getMonth() == 3) {
          return "Apr";
        } else if (date.getMonth() == 4) {
          return "May";
        } else if (date.getMonth() == 5) {
          return "June";
        } else if (date.getMonth() == 6) {
          return "July";
        } else if (date.getMonth() == 7) {
          return "Aug";
        } else if (date.getMonth() == 8) {
          return "Sept";
        } else if (date.getMonth() == 9) {
          return "Oct";
        } else if (date.getMonth() == 10) {
          return "Nov";
        } else if (date.getMonth() == 11) {
          return "Dec";
        }
      }
      const year = date.getFullYear();

      return `${day} ${month()} ${year}`;
    },

    closeForm() {
      this.animationIsReady = false;

      setTimeout(() => {
        this.TOGGLE_FORM();
        if (this.editingMode) {
          this.TOGGLE_EDITING_MODE();
        }
      }, 600);
    },
    addItem() {
      this.items.push({
        id: uid(),
        name: "",
        qty: 1,
        price: 0,
        total: "",
      });
    },
    deleteItem(id) {
      this.items = this.items.filter((item) => item.id != id);
    },
    calculateTotalPrice() {
      this.total = 0;
      const initialValue = 0;
      let total = this.items.reduce(
        (prev, curr) => prev + +curr.price * curr.qty,
        initialValue
      );
      this.total = total;
    },
    dateToString(dateArg) {
      function month() {
        if (dateArg.getMonth() + 1 < 10) {
          return `0${dateArg.getMonth() + 1}`;
        } else return dateArg.getMonth() + 1;
      }
      function date() {
        if (dateArg.getDate() + 1 < 10) {
          return `0${dateArg.getDate()}`;
        } else return dateArg.getDate();
      }
      return `${dateArg.getFullYear()}-${month()}-${date()}`;
    },
    saveDraft() {
      this.status = "Draft";
    },
    sendInvoice() {
      this.status = "Pending";
    },
    async submitForm() {
      if (this.items.length < 1) {
        this.emptyItems = true;
        return;
      }

      this.loading = true;

      this.calculateTotalPrice();

      const invoices = collection(db, "invoices");

      if (!this.editingMode) {
        let randomId = uid(6);
        await addDoc(invoices, {
          invoiceId: randomId,
          createdAt: this.createdAt,
          paymentDue: this.paymentDue,
          description: this.description,
          paymentTerms: this.paymentTerms,
          clientName: this.clientName,
          clientEmail: this.clientEmail,
          status: this.status,
          senderAddress: {
            street: this.senderAddress.street,
            city: this.senderAddress.city,
            postCode: this.senderAddress.postCode,
            country: this.senderAddress.country,
          },
          clientAddress: {
            street: this.clientAddress.street,
            city: this.clientAddress.city,
            postCode: this.clientAddress.postCode,
            country: this.clientAddress.country,
          },
          items: this.items,
          total: this.total,
          timestamp: Date.now(),
          type: "invoice",
        });

        // Refresh length info inside document stored in database
        const lengthStorage = doc(db, "invoices", "hHjzseGrUKntiPgVBTbS");
        await updateDoc(lengthStorage, {
          fullLength: increment(1),
        });

        if (this.status == "Pending") {
          await updateDoc(lengthStorage, {
            pendingLength: increment(1),
          });
        } else if (this.status == "Draft") {
          await updateDoc(lengthStorage, {
            draftLength: increment(1),
          });
        } else if (this.status == "paidLength") {
          await updateDoc(lengthStorage, {
            paidLength: increment(1),
          });
        }
        localStorage.setItem(randomId, true);
      } else {
        const updatedInvoice = doc(db, "invoices", this.currentInvoice.docId);
        await updateDoc(updatedInvoice, {
          paymentDue: this.paymentDue,
          description: this.description,
          paymentTerms: this.paymentTerms,
          clientName: this.clientName,
          clientEmail: this.clientEmail,
          senderAddress: {
            street: this.senderAddress.street,
            city: this.senderAddress.city,
            postCode: this.senderAddress.postCode,
            country: this.senderAddress.country,
          },
          clientAddress: {
            street: this.clientAddress.street,
            city: this.clientAddress.city,
            postCode: this.clientAddress.postCode,
            country: this.clientAddress.country,
          },
          items: this.items,
          total: this.total,
          timestamp: Date.now(),
        });

        if (this.currentInvoice.status == "Draft") {
          await updateDoc(updatedInvoice, {
            status: "Pending",
          });
          this.currentInvoice.status = "Pending";

          const lengthStorage = doc(db, "invoices", "hHjzseGrUKntiPgVBTbS");
          await updateDoc(lengthStorage, {
            pendingLength: increment(1),
          });
          await updateDoc(lengthStorage, {
            draftLength: increment(-1),
          });
        } else if (this.currentInvoice.status == "Paid") {
          await updateDoc(updatedInvoice, {
            status: "Pending",
          });
          this.currentInvoice.status = "Pending";

          const lengthStorage = doc(db, "invoices", "hHjzseGrUKntiPgVBTbS");
          await updateDoc(lengthStorage, {
            pendingLength: increment(1),
          });
          await updateDoc(lengthStorage, {
            paidLength: increment(-1),
          });
        }

        //Update current invoice
        this.currentInvoice.paymentDue = this.paymentDue;
        this.currentInvoice.description = this.description;
        this.currentInvoice.paymentTerms = this.paymentTerms;
        this.currentInvoice.clientName = this.clientName;
        this.currentInvoice.clientEmail = this.clientEmail;
        this.currentInvoice.senderAddress = this.senderAddress;
        this.currentInvoice.clientAddress = this.clientAddress;
        this.currentInvoice.items = this.items;
        this.currentInvoice.total = this.total;
        this.currentInvoice.status = "Pending";

        const serialObj = JSON.stringify(this.currentInvoice);
        localStorage.setItem("currentInvoice", serialObj);
      }
      this.loading = false;
      this.closeForm();

      this.GET_INVOICES();
    },
    validate(e) {
      if (e.target.value[0] == "0") {
        let validated = e.target.value.split("").slice(1).join("");
        e.target.value = validated;
      }
    },
    validated(data) {
      if (data[0] == "0") {
        let validated = data.split("").slice(1).join("");
        data = validated;
      }
      return data;
    },
  },
  watch: {
    datePicked() {
      let datePicked = this.datePicked;
      this.createdAt = this.dateToString(datePicked);
    },
    paymentTermTitle() {
      let datePicked = this.datePicked;
      let cloneDate = new Date(datePicked.getTime());

      let postponement = this.paymentTermTitle.split(" ")[1];
      cloneDate.setDate(cloneDate.getDate() + +postponement);

      this.paymentDue = this.dateToString(cloneDate);
    },
  },
  computed: {
    ...mapState(["editingMode", "currentInvoice", "darkMode"]),
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
      "inputBgStyle",
      "inputBorderStyle",
      "inputColorStyle",
      "paymentTermsBorderStyle",
      "addItemStyle",
      "addItemHoverStyle",
      "autofillTextColor",
      "autofillBgColor",
      "bottomPanelBg",
    ]),
  },

  created() {
    if (this.editingMode) {
      this.invoiceId = this.currentInvoice.invoiceId;
      this.paymentDue = this.currentInvoice.paymentDue;
      if (this.currentInvoice.paymentTerms == 1) {
        this.paymentTermTitle = "Net 1 Day";
      } else if (this.currentInvoice.paymentTerms == 7) {
        this.paymentTermTitle = "Net 7 Days";
      } else if (this.currentInvoice.paymentTerms == 14) {
        this.paymentTermTitle = "Net 14 Days";
      } else if (this.currentInvoice.paymentTerms == 30) {
        this.paymentTermTitle = "Net 30 Days";
      }

      this.description = this.currentInvoice.description;
      this.paymentTerms = this.currentInvoice.paymentTerms;
      this.clientName = this.currentInvoice.clientName;
      this.clientEmail = this.currentInvoice.clientEmail;
      this.status = this.currentInvoice.status;
      this.senderAddress = this.currentInvoice.senderAddress;
      this.clientAddress = this.currentInvoice.clientAddress;
      this.items = this.currentInvoice.items;
      this.total = this.currentInvoice.total;
      this.timestamp = Date.now();
    }
  },
  mounted() {
    this.animationIsReady = true;

    //Set initial payment term
    let datePicked = this.datePicked;
    this.createdAt = this.dateToString(new Date());
    let cloneDate = new Date(datePicked.getTime());

    let postponement = this.paymentTermTitle.split(" ")[1];
    cloneDate.setDate(cloneDate.getDate() + +postponement);

    this.paymentDue = this.dateToString(cloneDate);

    //Make datepicker disabled in editing mode
    if (this.editingMode) {
      setTimeout(() => {
        document.querySelector(
          ".date.input-block .input-container"
        ).style.opacity = "40%";
        document.querySelector(".dp__input").style.cursor = "default";
      }, 100);
    }
  },
};
</script>

<style lang="scss">
.no-scroll {
  overflow: hidden !important;
}
.form-wrapper {
  position: fixed;
  overflow: scroll;
  z-index: 3;
  top: 0;
  left: 104px;
  width: calc(100% - 104px);
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);

  @media (max-width: 960px) {
    padding-top: 80px;
    left: 0;
    width: 100%;
  }

  form {
    max-width: 620px;
    border-radius: 0 20px 20px 0;
    padding: 56px 56px 32px 56px;
    position: relative;
    .form-title {
      font-weight: 700;
      font-size: 30px;
      margin-bottom: 48px;
    }

    @media (max-width: 640px) {
      border-radius: 0;
    }

    @media (max-width: 500px) {
      padding: 24px 24px 32px 24px;
    }

    .bill-from,
    .bill-to {
      margin-bottom: 48px;
    }

    .bill-from-title,
    .bill-to-title {
      font-weight: 700;
      font-size: 15px;
      color: v-bind(mediumSlateBlue);
      margin-bottom: 24px;
    }

    .input-block {
      margin-bottom: 24px;

      .input-container {
        flex: 1;
        min-width: 152px;
      }
    }

    label,
    .select-title span {
      display: block;
      font-weight: 400;
      font-size: 15px;
      color: v-bind(lavenderWeb);
      margin-bottom: 12px;
    }

    .total-label {
      position: relative;
      top: -16px;
    }

    .total-price {
      font-weight: 700;
      font-size: 16px;
    }

    .select-title {
      position: relative;
    }

    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type="number"] {
      -moz-appearance: textfield;
    }
    input {
      height: 48px;
      width: 100%;
      padding: 0px 16px;
      border-radius: 4px;
      border: 1px solid v-bind(inputBorderStyle);
      background-color: v-bind(inputBgStyle);
      color: v-bind(inputColorStyle);

      font-weight: 700;
      font-size: 16px;

      &:hover,
      :focus,
      :active {
        border: 1px solid v-bind(mediumSlateBlue);
      }
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      transition: background-color 5000s ease-in-out 0s;
    }
    input:-webkit-autofill {
      -webkit-text-fill-color: v-bind(autofillTextColor) !important;
      -webkit-box-shadow: inset 0 0 0 50px v-bind(autofillBgColor);
    }
    .payment-terms {
      height: 48px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0px 16px;
      border-radius: 4px;
      border: 1px solid v-bind(inputBorderStyle);
      background-color: v-bind(inputBgStyle);

      .custom-select {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .custom-select-title {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }

    .location,
    .date {
      display: flex;
      gap: 24px;
      align-items: center;
      flex-wrap: wrap;
    }
  }

  //Custom select
  .custom-select {
    position: relative;
    display: flex;
    align-items: center;

    .custom-select-title {
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .custom-select-dropdown {
      color: v-bind(inputColorStyle);
      font-weight: 700;
      font-size: 16px;
    }

    img {
      width: 12px;
      height: 8px;

      margin-left: 16px;

      @media (max-width: 600px) {
        margin-left: 6px;
      }
    }
  }

  .payment-terms {
    position: relative;
  }
  .select-options {
    display: flex;
    flex-direction: column;

    font-weight: 700;
    font-size: 16px;

    border-radius: 8px;
    width: 100%;
    position: absolute;
    z-index: 1000;
    top: 54px;
    left: 0px;
    cursor: pointer;

    .option {
      padding: 16px 16px;
      cursor: pointer;

      &:not(:last-child) {
        border-bottom: 1px solid v-bind(paymentTermsBorderStyle);
      }
      &:hover {
        color: v-bind(mediumPurple);
      }

      transition: 0.2s;
    }
  }

  //Datepicker
  .dp__main input {
    padding: 0px 36px;
  }

  .dp__input_wrap {
    font-weight: 700;
    font-size: 16px;
  }

  .dp__input_wrap .dp__input_icon path {
    fill: v-bind(glaucous);
  }

  .dp__clear_icon {
    color: v-bind(glaucous);
  }

  .list-title {
    font-weight: 700;
    font-size: 21px;
    color: #777f98;
    padding-top: 8px;
    margin-bottom: 16px;
  }

  .item-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 18px;
  }

  .total input {
    background: transparent;
    border: none;
    pointer-events: none;
  }

  .item-name {
    flex: 12;
    @media (max-width: 500px) {
      flex-basis: 100%;
      margin-bottom: 12px;
    }
  }

  .qty {
    flex: 3;
  }
  .price {
    flex: 4;
  }
  .total {
    flex: 3;
    input {
      padding: 0;
    }
  }
  .icon-delete {
    height: 48px;
    display: flex;
    align-items: center;
    padding-top: 16px;
    cursor: pointer;

    &:hover svg path {
      fill: v-bind(redSalsa);
      transition: 0.2s;
    }
  }

  //Buttons
  .add-item {
    width: 100%;
    height: 48px;
    border-radius: 24px;

    color: #fff;
    background-color: v-bind(addItemStyle);
    margin-bottom: 45px;

    font-weight: 700;

    font-size: 15px;
    text-align: center;
    cursor: pointer;
    transition: 0.2s;

    color: v-bind(lavenderWeb);
    &:hover {
      background-color: v-bind(addItemHoverStyle);
    }
  }

  .bottom-buttons {
    display: flex;
    justify-content: space-between;
    @media (max-width: 500px) {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 2;
      background-color: v-bind(bottomPanelBg);
      padding: 12px 6px;
      width: 100%;
    }

    .discard {
      padding: 0px 24px;
      height: 48px;
      border-radius: 24px;
      background-color: #f9fafe;
      color: v-bind(glaucous);

      font-weight: 700;

      font-size: 15px;
      text-align: center;
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        background-color: v-bind(spaceCadetLight);
        color: #fff;
      }

      @media (max-width: 450px) {
        padding: 0px 16px;
      }
    }
    .draft {
      padding: 0px 24px;
      height: 48px;
      border-radius: 24px;
      background-color: #373b53;

      color: v-bind(coolGrey);

      font-weight: 700;

      font-size: 15px;
      text-align: center;
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        color: v-bind(lavenderWeb);
      }
      @media (max-width: 450px) {
        padding: 0px 16px;
      }
    }

    .cancel-btn {
      padding: 0px 24px;
      height: 48px;
      border-radius: 24px;
      background-color: v-bind(spaceCadetLight);
      color: v-bind(lavenderWeb);

      font-weight: 700;

      font-size: 15px;
      text-align: center;
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        background-color: v-bind(spaceCadetDark);
      }
      @media (max-width: 450px) {
        padding: 0px 16px;
      }
    }
    .send {
      padding: 0px 24px;
      height: 48px;
      border-radius: 24px;
      margin-left: 8px;
      background-color: v-bind(mediumSlateBlue);
      color: #fff;

      font-weight: 700;

      font-size: 15px;
      text-align: center;
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        background-color: v-bind(mediumPurple);
      }
      @media (max-width: 450px) {
        padding: 0px 16px;
        margin-left: 5px;
      }
    }
  }

  .go-back {
    display: none;
    margin-bottom: 24px;
    img {
      width: 10px;
      height: 14px;
    }
    span {
      padding-top: 2px;
    }
    a {
      text-decoration: none;
      color: #fff;
      font-weight: 700;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 24px;
    }

    @media (max-width: 500px) {
      display: flex;
      gap: 24px;
    }
  }
  .alert {
    font-weight: 600;
    font-size: 14px;
    color: v-bind(redSalsa);
    margin-bottom: 32px;
  }
}

//Datepicker variables
.dp__theme_dark {
  --dp-background-color: #252945;
  --dp-hover-color: #7c5dfa;
  --dp-primary-color: #7c5dfa;
  --dp-secondary-color: "#343854";
  --dp-icon-color: #fff;
  --dp-hover-icon-color: #fff;
}
.dp__theme_light {
  --dp-background-color: #ffffff;
  --dp-hover-color: #7c5dfa;
  --dp-primary-color: #7c5dfa;
  --dp-secondary-color: "#343854";
  --dp-icon-color: #fff;
  --dp-hover-icon-color: #fff;
  --dp-hover-text-color: #ffffff;
}

// Form transition
.form-enter-active,
.form-leave-active {
  transition: 0.6s ease all;
}

.form-enter-from,
.form-leave-to {
  transform: translateX(-620px);
}
</style>
