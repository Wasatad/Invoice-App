<template>
  <div class="header">
    <div class="title-block">
      <div
        @click="loadMoreInvoices"
        class="title"
        :style="this.darkMode ? { color: white } : { color: richBlack }"
      >
        Invoices
      </div>
      <div
        class="info"
        :style="this.darkMode ? { color: white } : { color: coolGrey }"
      >
        <span>There are </span>{{ collectionLength }} total invoices
      </div>
    </div>
    <div v-click-away="hideFilterMenu" class="controls">
      <div class="filter">
        <div @click="toggleFilterMenu" class="filter-title">
          <span
            class="filter-dropdown"
            :style="this.darkMode ? { color: white } : { color: richBlack }"
            >Filter<span> by status</span></span
          >
          <img class="arrow" src="../assets/icon-arrow-down.svg" alt="" />
        </div>
        <form
          v-show="isFilterMenuOpened"
          class="filters"
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
          <div>
            <input
              @input="updateFilters"
              id="draft"
              type="checkbox"
              class="custom-checkbox"
              name="Draft"
              :checked="stateFilters.Draft"
            />
            <label for="draft">Draft</label>
          </div>
          <div>
            <input
              @input="updateFilters"
              id="pending"
              type="checkbox"
              class="custom-checkbox"
              name="Pending"
              :checked="stateFilters.Pending"
            />
            <label for="pending">Pending</label>
          </div>
          <div>
            <input
              @input="updateFilters"
              id="paid"
              type="checkbox"
              class="custom-checkbox"
              name="Paid"
              :checked="stateFilters.Paid"
            />
            <label for="paid">Paid</label>
          </div>
        </form>
      </div>
      <button @click="openForm" class="new-invoice">
        <div class="plus">
          <img src="../assets/icon-plus.svg" alt="" />
        </div>
        <span>New<span> Invoice</span></span>
      </button>
    </div>
  </div>

  <!--Start Invoices List-->
  <div id="listItem" @click="loadMoreInvoices">
    <loading-animation v-if="invoicesIsLoading"></loading-animation>
    <router-link
      :to="{
        name: 'InvoiceDetails',
        params: { invoiceId: invoice.invoiceId },
      }"
      v-for="invoice in stateInvoices"
      :key="invoice.invoiceId"
      class="item"
      :style="
        this.darkMode
          ? { 'background-color': spaceCadetDark }
          : {
              'background-color': white,

              'box-shadow': '0px 10px 10px -10px rgba(72, 84, 159, 0.100397)',
            }
      "
    >
      <div class="item-info">
        <div
          class="id"
          :style="this.darkMode ? { color: white } : { color: richBlack }"
        >
          <span class="hashtag">#</span>{{ invoice.invoiceId }}
        </div>
        <div
          class="date"
          :style="this.darkMode ? { color: lavenderWeb } : { color: glaucous }"
        >
          Due {{ dateFormatter(invoice.paymentDue) }}
        </div>
        <div
          class="price"
          :style="this.darkMode ? { color: white } : { color: richBlack }"
        >
          $ {{ invoice.total }}
        </div>
        <div
          class="name"
          :style="this.darkMode ? { color: lavenderWeb } : { color: '#858BB2' }"
        >
          {{ invoice.clientName }}
        </div>
      </div>
      <div class="price-status">
        <div
          class="name"
          :style="this.darkMode ? { color: lavenderWeb } : { color: '#858BB2' }"
        >
          {{ invoice.clientName }}
        </div>
        <div
          class="price"
          :style="this.darkMode ? { color: white } : { color: richBlack }"
        >
          $ {{ invoice.total }}
        </div>
        <div
          :class="[
            { paid: invoice.status == 'Paid' },
            { pending: invoice.status == 'Pending' },
            { draft: invoice.status == 'Draft' },
          ]"
        >
          <div class="status">
            <span>{{ invoice.status }}</span>
          </div>
          <img src="../assets/icon-arrow-right.svg" alt="" />
        </div>
      </div>
    </router-link>
  </div>
  <div class="trigger" ref="trigger">&nbsp;</div>
  <!--End Invoices List-->

  <div v-if="showPlaceholder" class="empty-placeholder">
    <img src="../assets/illustration-empty.svg" alt="" />
    <div class="empty-title">There is nothing here</div>
    <div class="empty-description">
      Create an invoice by clicking the <span>New Invoice</span> button and get
      started
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import LoadingAnimation from "./LoadingAnimation.vue";

export default {
  components: { LoadingAnimation },
  data() {
    return {
      filters: { Draft: false, Pending: false, Paid: false },
      isFilterMenuOpened: false,

      //CSS classes
      draft: "draft",
      pending: "pending",
      paid: "paid",
      notShown: "not-shown",

      //Infinite scroll option
      noResult: true,
    };
  },
  computed: {
    ...mapState({
      stateInvoices: "stateInvoices",
      collectionLength: "collectionLength",
      showPlaceholder: "showPlaceholder",
      invoicesIsLoading: "invoicesIsLoading",
      darkMode: "darkMode",
      stateFilters: "filters",
    }),
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
      "checkboxStyle",
      "autofillTextColor",
    ]),
  },

  methods: {
    ...mapMutations(["TOGGLE_FORM", "SET_FILTERS"]),
    ...mapActions(["GET_INVOICES"]),

    toggleFilterMenu() {
      if (this.isFilterMenuOpened == false) {
        this.isFilterMenuOpened = true;
        document.querySelector(".arrow").style.transform = "scale(1, -1)";
      } else {
        this.isFilterMenuOpened = false;
        document.querySelector(".arrow").style.transform = "scale(1, 1)";
      }
    },
    hideFilterMenu() {
      this.isFilterMenuOpened = false;
      document.querySelector(".arrow").style.transform = "scale(1, 1)";
    },
    openForm() {
      this.TOGGLE_FORM();
    },

    updateFilters() {
      let draft = document.getElementById("draft");
      let pending = document.getElementById("pending");
      let paid = document.getElementById("paid");

      this.filters.Draft = draft.checked;
      this.filters.Pending = pending.checked;
      this.filters.Paid = paid.checked;
      this.SET_FILTERS(this.filters);
      this.GET_INVOICES();
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

    loadMoreInvoices() {
      this.GET_INVOICES("addMoreInvoices");
    },
  },
  mounted() {
    this.GET_INVOICES();
    let observerOptions = {
      threshold: 0.5,
    };
    let observer = new IntersectionObserver(
      this.loadMoreInvoices,
      observerOptions
    );
    observer.observe(this.$refs.trigger);
  },
};
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 64px;
  @media (max-width: 960px) {
    margin-top: 56px;
  }
  @media (max-width: 720px) {
    margin-bottom: 32px;
  }

  .controls {
    display: flex;
    justify-content: flex-end;
    gap: 40px;
    @media (max-width: 400px) {
      gap: 24px;
    }
  }

  .title {
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 8px;

    @media (max-width: 600px) {
      font-size: 26px;
      margin-bottom: 4px;
    }
  }

  .info {
    color: #fff;
    font-weight: 400;
    font-size: 16px;

    @media (max-width: 600px) {
      & span {
        display: none;
      }
    }
  }

  .filter {
    position: relative;
    display: flex;
    align-items: center;

    .filter-title {
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .filter-dropdown {
      color: #fff;
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

    .filters {
      display: flex;
      flex-direction: column;
      gap: 12px;

      padding: 24px;
      border-radius: 8px;
      width: 192px;
      position: absolute;
      z-index: 2;
      top: 50px;
      left: 0px;
      transform: translateX(-15%);
      @media (max-width: 600px) {
        top: 60px;
        transform: translateX(-35%);
      }

      .custom-checkbox {
        position: absolute;
        z-index: -1;
        opacity: 0;
      }
      .custom-checkbox + label {
        display: inline-flex;
        align-items: center;
        user-select: none;
        font-weight: 700;
        font-size: 15px;
        cursor: pointer;
      }
      .custom-checkbox + label::before {
        content: "";
        display: inline-block;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        flex-grow: 0;
        background-color: v-bind(checkboxStyle);
        border: 1px solid v-bind(checkboxStyle);

        border-radius: 2px;
        margin-right: 13px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 70% 50%;
      }
      .custom-checkbox:checked + label::before {
        background-color: v-bind(mediumSlateBlue);
        background-image: url("../assets/icon-check.svg");
      }

      .custom-checkbox:not(:disabled):not(:checked) + label:hover::before {
        border-color: v-bind(mediumSlateBlue);
      }
    }

    @media (max-width: 600px) {
      span:last-child {
        display: none;
      }
    }
  }

  .new-invoice {
    display: flex;
    align-items: center;
    background-color: v-bind(mediumSlateBlue);
    color: #fff;
    font-weight: 700;
    font-size: 16px;
    border-radius: 24px;
    padding: 8px 15px 8px 8px;
    cursor: pointer;
    transition: 0.2s ease-in-out;

    .plus {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    span:not(:first-child) {
      margin-left: 12px;
    }
    @media (max-width: 600px) {
      span:first-child {
        display: none;
      }
    }
    &:hover {
      background-color: v-bind(mediumPurple);
    }
  }
}

//Invoice styling
.item {
  display: flex;
  align-items: center;
  max-width: 730px;
  width: 100%;
  padding: 16px 24px 16px 32px;
  border-radius: 8px;
  color: #fff;
  justify-content: space-between;
  border: 1px solid v-bind(spaceCadetDark);
  margin-bottom: 16px;
  cursor: pointer;
  text-decoration: none;
  transition: 0.3s;
  &:hover {
    border: 1px solid v-bind(mediumSlateBlue);
  }
  @media (max-width: 720px) {
    padding: 24px;
  }

  .item-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 40px;
    @media (max-width: 720px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .name {
      font-weight: 400;
      font-size: 15px;
      line-height: 0.2;
      @media (max-width: 720px) {
        display: none;
      }
    }

    .price {
      display: none;
      font-weight: 700;
      font-size: 21px;
      @media (max-width: 720px) {
        display: block;
      }
    }

    .id {
      font-weight: 700;
      font-size: 15px;
      text-transform: uppercase;
      .hashtag {
        color: v-bind(coolGrey);
      }

      @media (max-width: 720px) {
        margin-bottom: 18px;
      }
    }

    .date {
      font-weight: 400;
      font-size: 15px;
    }
  }

  .price-status {
    display: flex;
    align-items: center;
    gap: 40px;

    @media (max-width: 720px) {
      flex-direction: column;
      gap: 30px;
    }

    .price {
      font-weight: 700;
      font-size: 21px;
      @media (max-width: 720px) {
        display: none;
      }
    }

    .name {
      font-weight: 400;
      font-size: 15px;
      display: none;
      @media (max-width: 720px) {
        display: block;
      }
    }

    .paid {
      display: flex;
      align-items: center;

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

      img {
        width: 8px;
        height: 12px;
        margin-left: 20px;
        @media (max-width: 720px) {
          display: none;
        }
      }
    }
    .pending {
      display: flex;
      align-items: center;

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

      img {
        width: 8px;
        height: 12px;
        margin-left: 20px;
        @media (max-width: 720px) {
          display: none;
        }
      }
    }
    .draft {
      display: flex;
      align-items: center;

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

      img {
        width: 8px;
        height: 12px;
        margin-left: 20px;
        @media (max-width: 720px) {
          display: none;
        }
      }
    }
  }
}

//Placeholder image
.empty-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: calc(100vh - 290px);

  img {
    margin-bottom: 56px;
  }

  .empty-title {
    color: v-bind(autofillTextColor);
    font-weight: 700;
    font-size: 25px;
    margin-bottom: 20px;
  }

  .empty-description {
    color: v-bind(lavenderWeb);
    font-weight: 400;
    font-size: 16px;
    max-width: 250px;
    line-height: 1.2;
    text-align: center;
    span {
      font-weight: 700;
    }
  }
  .trigger {
    height: 10px;
    width: 100%;
  }
}
</style>
