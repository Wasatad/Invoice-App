import { createStore } from "vuex";

import db from "../firebase/firebaseInit";
import {
  query,
  getDocs,
  collection,
  orderBy,
  where,
  limit,
  updateDoc,
  deleteDoc,
  increment,
  doc,
  startAt,
} from "firebase/firestore";

export default createStore({
  state: {
    darkMode: true,
    stateInvoices: [],
    invoiceForm: false,
    deleteModalActive: null,
    isDeletionAllowed: false,
    collectionLength: 0,
    itemsPerPage: 12,
    lastDocSnapshot: null,
    lastDocTimeStamp: null,
    invoicesIsLoading: false,
    currentInvoice: null,
    editingMode: null,

    showPlaceholder: false,

    //Applied filters
    filters: { Draft: false, Pending: false, Paid: false },
  },
  getters: {
    //CSS variables
    white: () => {
      return "#fff";
    },
    xiketic: () => {
      return "rgba(20, 22, 37, 1)";
    },
    cultured: () => {
      return "rgba(248, 248, 251, 1)";
    },
    lightCoral: () => {
      return "rgba(255, 151, 151, 1)";
    },
    redSalsa: () => {
      return "rgba(236, 87, 87, 1)";
    },
    richBlack: () => {
      return "rgba(12, 14, 22, 1)";
    },
    glaucous: () => {
      return "rgba(126, 136, 195, 1)";
    },
    coolGrey: () => {
      return "rgba(136, 142, 176, 1)";
    },
    lavenderWeb: (state) => {
      return state.darkMode
        ? "rgba(223, 227, 250, 1)"
        : "rgba(126, 136, 195, 1)";
    },
    spaceCadetLight: () => {
      return "rgba(37, 41, 69, 1)";
    },
    spaceCadetDark: (state) => {
      return state.darkMode ? "rgba(30, 33, 57, 1)" : "#fff";
    },
    mediumPurple: () => {
      return "rgba(146, 119, 255, 1)";
    },
    mediumSlateBlue: () => {
      return "rgba(124, 93, 250, 1)";
    },
    checkboxStyle: (state) => {
      return state.darkMode ? "rgba(30, 33, 57, 1)" : "rgba(223, 227, 250, 1)";
    },
    inputBgStyle: (state) => {
      return state.darkMode ? "rgba(30, 33, 57, 1)" : "#fff";
    },
    inputBorderStyle: (state) => {
      return state.darkMode ? "rgba(37, 41, 69, 1)" : "rgba(223, 227, 250, 1)";
    },
    inputColorStyle: (state) => {
      return state.darkMode ? "#fff" : "rgba(12, 14, 22, 1)";
    },
    paymentTermsBorderStyle: (state) => {
      return state.darkMode ? "rgba(30, 33, 57, 1)" : "rgba(223, 227, 250, 1)";
    },
    addItemStyle: (state) => {
      return state.darkMode ? "rgba(37, 41, 69, 1)" : "rgba(249, 250, 254, 1)";
    },
    addItemHoverStyle: (state) => {
      return state.darkMode
        ? "rgba(124, 93, 250, 1)"
        : "rgba(223, 227, 250, 1)";
    },
    autofillTextColor: (state) => {
      return state.darkMode ? "rgb(255, 255, 255)" : "rgba(12, 14, 22, 1)";
    },
    autofillBgColor: (state) => {
      return !state.darkMode ? "rgb(255, 255, 255)" : "rgba(30, 33, 57, 1)";
    },
    editBtnBg: (state) => {
      return state.darkMode ? "rgba(37, 41, 69, 1)" : "rgba(249, 250, 254, 1)";
    },
    editBtnText: (state) => {
      return state.darkMode
        ? "rgba(255, 255, 255, 1)"
        : "rgba(126, 136, 195, 1)";
    },
    editBtnBgHover: (state) => {
      return state.darkMode ? "rgba(20, 22, 37, 1)" : "rgba(223, 227, 250, 1)";
    },
    priceBlockBg: (state) => {
      return state.darkMode ? "rgba(37, 41, 69, 1)" : "rgba(249, 250, 254, 1)";
    },
    totalAmountBg: (state) => {
      return state.darkMode ? "rgba(12, 14, 22, 1)" : "rgba(55, 59, 83, 1)";
    },
    bottomPanelBg: (state) => {
      return state.darkMode ? "rgba(20, 22, 37, 1)" : "#fff";
    },
  },
  mutations: {
    TOGGLE_FORM(state) {
      state.invoiceForm = !state.invoiceForm;
    },
    TOGGLE_MODAL(state) {
      state.deleteModalActive = !state.deleteModalActive;
      if (state.deleteModalActive) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "visible";
      }
    },
    CONFIRM_DELETE(state, payload) {
      state.deleteConfirmed = payload;
    },
    SET_DELETION_RULE(state) {
      state.isDeletionAllowed = true;
    },
    SET_FILTERS(state, payload) {
      state.filters = payload;
    },
    GET_INVOICES(state, payload) {
      state.stateInvoices.push(payload);
    },
    SET_CURRENT_INVOICE(state, payload) {
      if (
        !localStorage.currentInvoice ||
        JSON.parse(localStorage.getItem("currentInvoice")).invoiceId != payload
      ) {
        state.currentInvoice = state.stateInvoices.filter((invoice) => {
          return invoice.invoiceId == payload;
        });

        const data = {
          docId: state.currentInvoice[0].docId,
          invoiceId: state.currentInvoice[0].invoiceId,
          createdAt: state.currentInvoice[0].createdAt,
          paymentDue: state.currentInvoice[0].paymentDue,
          description: state.currentInvoice[0].description,
          paymentTerms: state.currentInvoice[0].paymentTerms,
          clientName: state.currentInvoice[0].clientName,
          clientEmail: state.currentInvoice[0].clientEmail,
          status: state.currentInvoice[0].status,
          senderAddress: state.currentInvoice[0].senderAddress,

          clientAddress: state.currentInvoice[0].clientAddress,
          items: state.currentInvoice[0].items,
          total: state.currentInvoice[0].total,
          timestamp: state.currentInvoice[0].timestamp,
        };

        const serialObj = JSON.stringify(data);

        localStorage.setItem("currentInvoice", serialObj);
      }

      state.currentInvoice = JSON.parse(localStorage.getItem("currentInvoice"));
    },
    TOGGLE_EDITING_MODE(state) {
      state.editingMode = !state.editingMode;
    },
    TOGGLE_DARK_MODE(state) {
      state.darkMode = !state.darkMode;
    },
  },
  actions: {
    async GET_INVOICES(context, payload) {
      //1. Reset filters list and clear invoices in state
      let filterTerms = [];
      context.state.showPlaceholder = false;

      //2. Check if function was called from scroll listener
      if (payload != "addMoreInvoices") {
        context.state.stateInvoices = [];
        context.state.invoicesIsLoading = true;
        this.lastDocSnapshot = null;
      }

      //3. Transforming applied filters into an array
      const invoices = collection(db, "invoices");
      filterTerms = Object.keys(context.state.filters).filter(
        (k) => context.state.filters[k]
      );
      if (filterTerms.length < 1) {
        filterTerms = ["Draft", "Pending", "Paid"];
      }

      //4. Check invoices collection length
      async function checkLength() {
        let length = 0;

        //5. Collection length stored in document inside collection. This was made for better performance (collection length does not recalculate each time invoices list was updated)
        let q = query(invoices, where("name", "==", "lengthStore"));
        let querySnapshot = await getDocs(q);

        function contains(arr, elem) {
          return arr.find((i) => i === elem) != undefined;
        }
        if (filterTerms.length > 0 && filterTerms.length < 3) {
          if (contains(filterTerms, "Pending")) {
            querySnapshot.forEach((doc) => {
              length += doc.data().pendingLength;
            });
          }
          if (contains(filterTerms, "Draft")) {
            querySnapshot.forEach((doc) => {
              length += doc.data().draftLength;
            });
          }
          if (contains(filterTerms, "Paid")) {
            querySnapshot.forEach((doc) => {
              length += doc.data().paidLength;
            });
          }

          return length;
        } else {
          querySnapshot.forEach((doc) => {
            length = doc.data().fullLength;
          });

          return length;
        }
      }

      //6. Update collection length inside state
      context.state.collectionLength = await checkLength();

      //7. Find first`s invoice timestamp. It`s gonna be a start point for collection building
      let searchFirstDocQ = query(
        invoices,
        where("status", "in", filterTerms),
        where("type", "==", "invoice"),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      let firstDocSnapshot = await getDocs(searchFirstDocQ);
      let firstTimeStamp = 0;

      firstDocSnapshot.forEach((doc) => {
        firstTimeStamp = doc.data().timestamp;
      });

      //.8 Sending a request for a block of invoices with applied filters. Filling state.
      const q = query(
        invoices,
        where("type", "==", "invoice"),
        where("status", "in", filterTerms),
        orderBy("timestamp", "desc"),
        startAt(this.lastDocSnapshot ? this.lastDocTimeStamp : firstTimeStamp),
        limit(context.state.itemsPerPage)
      );
      let querySnapshot = await getDocs(q);

      //9. Saving last loaded document

      this.lastDocSnapshot = querySnapshot.docs[context.state.itemsPerPage - 1];

      if (this.lastDocSnapshot) {
        this.lastDocTimeStamp = this.lastDocSnapshot.data().timestamp;
      }

      if (querySnapshot.docs.length < 1) {
        context.state.invoicesIsLoading = false;
        context.state.showPlaceholder = true;
      }
      querySnapshot.forEach((doc) => {
        if (
          !context.state.stateInvoices.find(
            (invoice) => invoice.docId == doc.id
          )
        ) {
          const data = {
            docId: doc.id,
            invoiceId: doc.data().invoiceId,
            createdAt: doc.data().createdAt,
            paymentDue: doc.data().paymentDue,
            description: doc.data().description,
            paymentTerms: doc.data().paymentTerms,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            status: doc.data().status,
            senderAddress: doc.data().senderAddress,

            clientAddress: doc.data().clientAddress,
            items: doc.data().items,
            total: doc.data().total,
            timestamp: doc.data().timestamp,
          };

          context.commit("GET_INVOICES", data);
        }
      });
      context.state.invoicesIsLoading = false;

      checkLength();
    },
    async DELETE_INVOICE(context) {
      const deletedInvoice = context.state.currentInvoice.docId;
      await deleteDoc(doc(db, "invoices", deletedInvoice));

      // Refreshing collection length in document inside database
      const lengthStorage = doc(db, "invoices", "hHjzseGrUKntiPgVBTbS");
      await updateDoc(lengthStorage, {
        fullLength: increment(-1),
      });

      if (context.state.currentInvoice.status == "Pending") {
        await updateDoc(lengthStorage, {
          pendingLength: increment(-1),
        });
      } else if (context.state.currentInvoice.status == "Draft") {
        await updateDoc(lengthStorage, {
          draftLength: increment(-1),
        });
      } else if (context.state.currentInvoice.status == "Paid") {
        await updateDoc(lengthStorage, {
          paidLength: increment(-1),
        });
      }
    },
  },
});
