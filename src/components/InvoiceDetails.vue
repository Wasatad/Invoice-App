<template>
  <router-link class="go-back" :to="{ name: 'InvoicesList' }">
    <img src="../assets/icon-arrow-left.svg" alt="" />
    <span>Go Back</span>
  </router-link>
  <div class="head-panel">
    <div class="left">
      <span>Status</span>
      <div
        :class="[
          { paid: currentInvoice.status == 'Paid' },
          { pending: currentInvoice.status == 'Pending' },
          { draft: currentInvoice.status == 'Draft' },
        ]"
      >
        <div class="status">
          <span>{{ currentInvoice.status }}</span>
        </div>
      </div>
    </div>
    <div class="right">
      <!-- Start -- Double for mobile version -->
      <div
        :class="[
          { paid: currentInvoice.status == 'Paid' },
          { pending: currentInvoice.status == 'Pending' },
          { draft: currentInvoice.status == 'Draft' },
        ]"
      >
        <div class="status">
          <span>{{ currentInvoice.status }}</span>
        </div>
      </div>
      <!-- End -- Double for mobile version -->
      <button @click="toggleEditingMode" class="edit">Edit</button>
      <button @click="deleteInvoice" class="delete">Delete</button>
      <button
        @click="markAsPaid"
        :class="[{ disabled: invoiceIsPaid }, markPaid]"
      >
        Mark as Paid
      </button>
    </div>
  </div>
  <!-- Start -- Bottom panel -->
  <div class="bottom-panel">
    <button @click="toggleEditingMode" class="edit">Edit</button>
    <button @click="deleteInvoice" class="delete">Delete</button>
    <button
      @click="markAsPaid"
      :class="[{ disabled: invoiceIsPaid }, markPaid]"
    >
      Mark as Paid
    </button>
  </div>
  <!-- End -- Bottom panel -->

  <div class="main-card">
    <div class="card-head">
      <div class="info">
        <div class="id">
          #<span>{{ currentInvoice.invoiceId }}</span>
        </div>
        <div class="description">{{ currentInvoice.description }}</div>
      </div>
      <div class="adress">
        <div>{{ currentInvoice.senderAddress.street }}</div>
        <div>{{ currentInvoice.senderAddress.city }}</div>
        <div>{{ currentInvoice.senderAddress.postCode }}</div>
        <div>{{ currentInvoice.senderAddress.country }}</div>
      </div>
    </div>
    <div class="contacts">
      <div class="dates">
        <div class="invoice-date">
          <div class="label">Invoice Date</div>
          <div class="title">
            {{ dateFormatter(currentInvoice.createdAt) }}
          </div>
        </div>
        <div class="payment-due">
          <div class="label">Payment Due</div>
          <div class="title">
            {{ dateFormatter(currentInvoice.paymentDue) }}
          </div>
        </div>
      </div>
      <div class="bill-to">
        <div class="label">Bill To</div>
        <div class="title">{{ currentInvoice.clientName }}</div>
        <div class="adress">
          <div>{{ currentInvoice.clientAddress.street }}</div>
          <div>{{ currentInvoice.clientAddress.city }}</div>
          <div>{{ currentInvoice.clientAddress.postCode }}</div>
          <div>{{ currentInvoice.clientAddress.country }}</div>
        </div>
      </div>
      <div class="sent-to">
        <div class="label">Sent to</div>
        <div class="title">
          <div>{{ currentInvoice.clientEmail }}</div>
        </div>
      </div>
    </div>
    <table class="price">
      <tr class="table-title">
        <td align="left"><div>Item Name</div></td>
        <td align="right" class="qty-column"><div>QTY.</div></td>
        <td align="right" class="price-column"><div>Price</div></td>
        <td align="right"><div>Total</div></td>
      </tr>
      <tr
        v-for="item in $store.state.currentInvoice.items"
        :key="item.name"
        class="table-data"
      >
        <td align="left" width="50%">
          <div class="data">{{ item.name }}</div>
          <div class="mobile-label">{{ item.qty }} x ${{ item.price }}</div>
        </td>
        <td align="right" class="qty-column">
          <div
            :style="
              this.darkMode
                ? { color: 'rgba(223, 227, 250, 1)' }
                : { color: 'rgba(126, 136, 195, 1)' }
            "
            class="data"
          >
            {{ item.qty }}
          </div>
        </td>
        <td align="right" class="price-column">
          <div
            :style="
              this.darkMode
                ? { color: 'rgba(223, 227, 250, 1)' }
                : { color: 'rgba(126, 136, 195, 1)' }
            "
            class="data"
          >
            $ {{ item.price }}
          </div>
        </td>
        <td align="right">
          <div class="data">$ {{ item.total }}</div>
        </td>
      </tr>
    </table>
    <div class="total-amount">
      <div class="label">Amount Due</div>
      <div class="total-price">${{ currentInvoice.total }}</div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from "vuex";
import db from "../firebase/firebaseInit";
import { doc, increment, updateDoc } from "firebase/firestore";

export default {
  data() {
    return {
      //CSS classes
      draft: "draft",
      pending: "pending",
      paid: "paid",
      markPaid: "mark-paid",
      disabled: "btn-disabled",
    };
  },
  methods: {
    ...mapMutations([
      "SET_CURRENT_INVOICE",
      "TOGGLE_EDITING_MODE",
      "TOGGLE_FORM",
      "TOGGLE_MODAL",
    ]),

    getCurrentInvoice() {
      this.SET_CURRENT_INVOICE(this.$route.params.invoiceId);
    },
    dateFormatter(payload) {
      let date = new Date(Date.parse(payload));
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
    toggleEditingMode() {
      this.TOGGLE_EDITING_MODE();
      this.TOGGLE_FORM();
    },
    async deleteInvoice() {
      this.TOGGLE_MODAL();
    },
    async markAsPaid() {
      const updatedInvoice = doc(db, "invoices", this.currentInvoice.docId);
      await updateDoc(updatedInvoice, {
        status: "Paid",
      });
      const lengthStorage = doc(db, "invoices", "hHjzseGrUKntiPgVBTbS");
      await updateDoc(lengthStorage, {
        paidLength: increment(1),
      });
      if (this.currentInvoice.status == "Pending") {
        await updateDoc(lengthStorage, {
          pendingLength: increment(-1),
        });
      } else if (this.currentInvoice.status == "Draft")
        await updateDoc(lengthStorage, {
          draftLength: increment(-1),
        });
      this.currentInvoice.status = "Paid";

      const serialObj = JSON.stringify(this.currentInvoice);
      localStorage.setItem("currentInvoice", serialObj);
    },
  },
  computed: {
    ...mapState(["currentInvoice", "deleteModalActive", "darkMode"]),
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
      "priceBlockBg",
      "totalAmountBg",
    ]),
    invoiceIsPaid() {
      if (this.currentInvoice.status == "Paid") return true;
      else {
        return false;
      }
    },
  },
  created() {
    this.getCurrentInvoice();
  },
};
</script>

<style scoped lang="scss">
.go-back {
  margin: 0 0 32px 0;
  display: flex;
  img {
    width: 10px;
    height: 14px;
  }
  span {
    padding-top: 2px;
  }

  text-decoration: none;
  color: v-bind(autofillTextColor);
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 960px) {
    margin: 48px 0 24px;
  }
}

.head-panel {
  padding: 24px 32px;
  background-color: v-bind(spaceCadetDark);
  border-radius: 8px;
  width: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .left {
    display: flex;
    align-items: center;
    gap: 16px;

    span {
      color: v-bind(lavenderWeb);
      font-weight: 400;
      font-size: 15px;
    }

    .paid {
      display: flex;
      align-items: center;
      @media (max-width: 600px) {
        display: none;
      }

      .status {
        padding: 0px 0px 0px 14px;
        width: 104px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        background-color: rgba(51, 214, 159, 0.06);
        color: rgba(51, 214, 159, 1);
        border-radius: 6px;

        span {
          position: relative;
        }

        span::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(51, 214, 159, 1);
          top: 2px;
          left: -16px;
        }
      }
    }
    .pending {
      display: flex;
      align-items: center;
      @media (max-width: 600px) {
        display: none;
      }

      .status {
        padding: 0px 0px 0px 14px;
        width: 104px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        background-color: rgba(255, 143, 0, 0.06);
        color: rgba(255, 143, 0, 1);
        border-radius: 6px;

        span {
          position: relative;
        }

        span::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(255, 143, 0, 1);
          top: 2px;
          left: -16px;
        }
      }
    }
    .draft {
      display: flex;
      align-items: center;
      @media (max-width: 600px) {
        display: none;
      }

      .status {
        padding: 0px 0px 0px 14px;
        width: 104px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        background-color: rgba(108, 122, 203, 0.1);
        color: v-bind(lavenderWeb);
        border-radius: 6px;

        span {
          position: relative;
        }

        span::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: v-bind(lavenderWeb);
          top: 2px;
          left: -16px;
        }
      }
    }
  }
  .right {
    display: flex;
    gap: 8px;
    button {
      padding: 16px 24px 14px;
      border-radius: 24px;
      color: #fff;
      cursor: pointer;
      transition: 0.2s ease;
      @media (max-width: 600px) {
        display: none;
      }
    }
    .edit {
      color: v-bind(editBtnText);
      background-color: v-bind(editBtnBg);
      &:hover {
        background-color: v-bind(editBtnBgHover);
      }
    }
    .delete {
      background-color: v-bind(redSalsa);
      &:hover {
        background-color: v-bind(lightCoral);
      }
    }
    .mark-paid {
      background-color: v-bind(mediumSlateBlue);
      &:hover {
        background-color: v-bind(mediumPurple);
      }
    }

    .mark-paid.disabled {
      opacity: 0.3;
      cursor: default;
      &:hover {
        background-color: v-bind(mediumSlateBlue);
      }
    }

    .paid {
      display: none;
      align-items: center;
      @media (max-width: 600px) {
        display: flex;
      }

      .status {
        padding: 0px 0px 0px 14px;
        width: 104px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        background-color: rgba(51, 214, 159, 0.06);
        color: rgba(51, 214, 159, 1);
        border-radius: 6px;

        span {
          position: relative;
        }

        span::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(51, 214, 159, 1);
          top: 2px;
          left: -16px;
        }
      }
    }
    .pending {
      display: none;
      align-items: center;
      @media (max-width: 600px) {
        display: flex;
      }
      .status {
        padding: 0px 0px 0px 14px;
        width: 104px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        background-color: rgba(255, 143, 0, 0.06);
        color: rgba(255, 143, 0, 1);
        border-radius: 6px;

        span {
          position: relative;
        }

        span::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: rgba(255, 143, 0, 1);
          top: 2px;
          left: -16px;
        }
      }
    }
    .draft {
      display: none;
      align-items: center;
      @media (max-width: 600px) {
        display: flex;
      }

      .status {
        padding: 0px 0px 0px 14px;
        width: 104px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        background-color: rgba(108, 122, 203, 0.1);
        color: v-bind(lavenderWeb);
        border-radius: 6px;

        span {
          position: relative;
        }

        span::before {
          content: "";
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: v-bind(lavenderWeb);
          top: 2px;
          left: -16px;
        }
      }
    }
  }
}
.bottom-panel {
  display: none;

  align-items: center;
  justify-content: center;
  gap: 8px;
  position: fixed;
  bottom: 0px;
  left: 0;
  padding: 22px 24px;
  width: 100%;
  background-color: v-bind(spaceCadetDark);
  @media (max-width: 600px) {
    display: flex;
  }

  button {
    padding: 16px 24px 14px;
    border-radius: 24px;
    color: #fff;
    cursor: pointer;
    transition: 0.2s ease;
  }
  .edit {
    color: v-bind(editBtnText);
    background-color: v-bind(editBtnBg);
    &:hover {
      background-color: v-bind(editBtnBgHover);
    }
  }
  .delete {
    background-color: v-bind(redSalsa);
    &:hover {
      background-color: v-bind(lightCoral);
    }
  }

  .mark-paid {
    background-color: v-bind(mediumSlateBlue);
    &:hover {
      background-color: v-bind(mediumPurple);
    }
  }

  .mark-paid.disabled {
    opacity: 0.3;
    cursor: default;
    &:hover {
      background-color: v-bind(mediumSlateBlue);
    }
  }
}
.main-card {
  background-color: v-bind(spaceCadetDark);
  border-radius: 8px;
  padding: 48px;
  margin-bottom: 56px;
  color: v-bind(lavenderWeb);
  @media (max-width: 500px) {
    padding: 24px;
  }
  .card-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;

    @media (max-width: 420px) {
      flex-direction: column;
      gap: 30px;
    }
    .id {
      font-weight: 700;
      font-size: 21px;
      text-transform: uppercase;
      margin-bottom: 8px;

      span {
        color: v-bind(autofillTextColor);
      }
    }
    .description {
      font-weight: 300;
      font-size: 16px;
      letter-spacing: 1px;
    }
    .adress {
      font-weight: 300;
      font-size: 15px;
      letter-spacing: 1px;
      line-height: 18px;
    }
  }

  .contacts {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    // @media (max-width: 700px) {
    //   flex-direction: column;
    // }
    .dates {
      .invoice-date,
      .payment-due {
        .label {
          font-weight: 300;
          font-size: 16px;
          margin-bottom: 12px;
        }
        .title {
          font-weight: 700;
          font-size: 19px;
          line-height: 20px;
          color: v-bind(autofillTextColor);
        }
        margin-bottom: 32px;
      }
    }
    .bill-to,
    .sent-to {
      margin-bottom: 30px;
      .label {
        font-weight: 300;
        font-size: 16px;
        margin-bottom: 12px;
      }
      .title {
        font-weight: 700;
        font-size: 19px;
        line-height: 20px;
        color: v-bind(autofillTextColor);
        margin-bottom: 8px;
      }
      .adress {
        font-weight: 300;
        font-size: 15px;
        letter-spacing: 1px;
        line-height: 18px;
      }
    }
  }

  .price {
    padding: 32px 32px 8px 32px;
    background-color: v-bind(priceBlockBg);
    border-radius: 8px 8px 0px 0px;
    width: 100%;
    .table-title {
      font-weight: 300;
      font-size: 16px;
      td div {
        margin-bottom: 32px;
      }
    }

    .table-data td .data {
      font-weight: 700;
      font-size: 16px;
      color: v-bind(autofillTextColor);
      margin-bottom: 32px;
      @media (max-width: 400px) {
        margin-bottom: 12px;
      }
    }
    .mobile-label {
      display: none;
      font-weight: 700;
      font-size: 15px;
      color: v-bind(coolGrey);
      margin-bottom: 24px;
    }
    @media (max-width: 400px) {
      .qty-column,
      .price-column {
        display: none;
      }
      .mobile-label {
        display: block;
      }
    }
  }
  .total-amount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32px;
    background-color: v-bind(totalAmountBg);
    border-radius: 0px 0px 8px 8px;
    color: #fff;
    @media (max-width: 400px) {
      padding: 24px;
    }
    .label {
      font-weight: 300;
      font-size: 16px;
    }
    .total-price {
      font-weight: 700;
      font-size: 30px;
      @media (max-width: 400px) {
        font-size: 25px;
      }
    }
  }
}
</style>
