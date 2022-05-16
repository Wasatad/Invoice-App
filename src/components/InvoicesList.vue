<template>
  <div class="header">
    <div class="title-block">
      <div class="title">Invoices</div>
      <div class="info">
        <span>There are </span>{{ paginationRecords }} total invoices
      </div>
    </div>
    <div v-click-away="hideFilterMenu" class="controls">
      <div class="filter">
        <div @click="toggleFilterMenu" class="filter-title">
          <span class="filter-dropdown">Filter<span> by status</span></span>
          <img class="arrow" src="../assets/icon-arrow-down.svg" alt="" />
        </div>
        <form v-show="isFilterMenuOpened" class="filters">
          <div>
            <input
              @input="updateFilters"
              id="draft"
              type="checkbox"
              class="custom-checkbox"
              name="Draft"
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

  <div v-for="invoice in stateInvoices" :key="invoice.invoiceId" class="item">
    <div class="item-info">
      <div class="id">
        <span class="hashtag">#</span>{{ invoice.invoiceId }}
      </div>
      <div class="date">Due {{ invoice.paymentDue }}</div>
      <div class="price">$ {{ invoice.total }}</div>
      <div class="name">{{ invoice.clientName }}</div>
    </div>
    <div class="price-status">
      <div class="name">{{ invoice.clientName }}</div>
      <div class="price">$ {{ invoice.total }}</div>
      <div
        :class="[
          { paid: invoice.status == 'paid' },
          { pending: invoice.status == 'pending' },
          { draft: invoice.status == 'draft' },
        ]"
      >
        <div class="status">
          <span>{{ invoice.status }}</span>
        </div>
        <img src="../assets/icon-arrow-right.svg" alt="" />
      </div>
    </div>
  </div>
  <div v-if="stateInvoices.length < 1" class="empty-placeholder">
    <img src="../assets/illustration-empty.svg" alt="" />
    <div class="empty-title">There is nothing here</div>
    <div class="empty-description">
      Create an invoice by clicking the <span>New Invoice</span> button and get
      started
    </div>
  </div>
  <pagination
    v-model="page"
    :records="paginationRecords"
    :per-page="itemsPerPage"
    :options="paginationOptions"
    @paginate="paginationPage"
  />
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import pagination from "v-pagination-3";
export default {
  components: { pagination },
  data() {
    return {
      page: 1,
      filters: { draft: false, pending: false, paid: false },
      isFilterMenuOpened: false,

      //CSS classes
      draft: "draft",
      pending: "pending",
      paid: "paid",
    };
  },
  computed: {
    ...mapState([
      "itemsPerPage",
      "paginationRecords",
      "paginationOptions",
      "stateInvoices",
    ]),
  },
  methods: {
    ...mapMutations(["TOGGLE_FORM", "SET_FILTERS", "SET_ACTIVE_PAGE"]),
    ...mapActions(["GET_INVOICES"]),
    paginationPage(e) {
      this.SET_ACTIVE_PAGE(e);
      this.GET_INVOICES();
    },
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

      this.filters.draft = draft.checked;
      this.filters.pending = pending.checked;
      this.filters.paid = paid.checked;
      this.SET_FILTERS(this.filters);
      this.GET_INVOICES();
    },
  },
  created() {
    this.GET_INVOICES();
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
    color: #fff;
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
      color: #fff;
      background-color: $spaceCadetLight;
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
        background-color: $spaceCadetDark;
        border: 1px solid $spaceCadetDark;

        border-radius: 2px;
        margin-right: 13px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 70% 50%;
      }
      .custom-checkbox:checked + label::before {
        background-color: $mediumSlateBlue;
        background-image: url("../assets/icon-check.svg");
      }

      .custom-checkbox:not(:disabled):not(:checked) + label:hover::before {
        border-color: $mediumSlateBlue;
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
    background-color: $mediumSlateBlue;
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
      background-color: $mediumPurple;
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
  background-color: $spaceCadetDark;
  border: 1px solid $spaceCadetDark;
  margin-bottom: 16px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    border: 1px solid $mediumSlateBlue;
  }
  @media (max-width: 720px) {
    padding: 24px;
  }

  .item-info {
    display: flex;
    justify-content: flex-start;
    gap: 40px;
    @media (max-width: 720px) {
      flex-direction: column;
      gap: 10px;
    }

    .name {
      font-weight: 400;
      font-size: 15px;
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
      .hashtag {
        color: $coolGrey;
      }

      @media (max-width: 720px) {
        margin-bottom: 18px;
      }
    }

    .date {
      font-weight: 400;
      font-size: 15px;
      color: $lavenderWeb;
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
        padding: 14px 30px 12px 46px;
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
        padding: 14px 30px 12px 46px;
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
        padding: 14px 30px 12px 46px;
        background-color: rgba(223, 227, 250, 0.06);
        color: $lavenderWeb;
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
          background-color: $lavenderWeb;
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
    color: #fff;
    font-weight: 700;
    font-size: 25px;
    margin-bottom: 20px;
  }

  .empty-description {
    color: $lavenderWeb;
    font-weight: 400;
    font-size: 16px;
    max-width: 250px;
    line-height: 1.2;
    text-align: center;
    span {
      font-weight: 700;
    }
  }
}

// Pagination
.VuePagination {
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    cursor: pointer;
    border: 1px solid $xiketic;
    &:hover {
      border: 1px solid $mediumSlateBlue;
      border-radius: 4px;
      color: $mediumSlateBlue;
    }
  }

  .pagination {
    display: flex;
    margin-bottom: 16px;

    .page-link {
      color: #585b73;
      background-color: $xiketic;
      padding: 8px 12px 4px;
    }
    .active {
      color: #fff;
      background-color: $mediumSlateBlue;
      border-radius: 4px;
    }
  }
  .VuePagination__count {
    color: $lavenderWeb;
    font-weight: 300;
    font-size: 16px;
  }
}
</style>
