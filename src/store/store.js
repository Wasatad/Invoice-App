import { createStore } from "vuex";

import db from "../firebase/firebaseInit";
import {
  query,
  getDocs,
  collection,
  orderBy,
  startAt,
  where,
  limit,
  updateDoc,
  deleteDoc,
  increment,
  doc,
} from "firebase/firestore";

export default createStore({
  state: {
    stateInvoices: [],
    invoiceForm: null,
    deleteModalActive: null,
    collectionLength: 0,
    itemsPerPage: 12,
    lastDocSnapshot: null,
    invoicesIsLoading: false,
    currentInvoice: null,
    editingMode: null,

    showPlaceholder: false,

    //Applied filters
    filters: { Draft: false, Pending: false, Paid: false },
  },
  mutations: {
    TOGGLE_FORM(state) {
      state.invoiceForm = !state.invoiceForm;
    },
    TOGGLE_MODAL(state) {
      state.deleteModalActive = !state.deleteModalActive;
    },
    CONFIRM_DELETE(state, payload) {
      console.log(payload);
      state.deleteConfirmed = payload;
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
  },
  actions: {
    async GET_INVOICES(context, payload) {
      //1. Обнуление списка примененных фильтров, списка инвойсов в state и установка начальной страницы в пагинации
      let filterTerms = [];
      context.state.showPlaceholder = false;

      // Проверяем, не вызвана ли функция их обзорщика скролла
      if (payload != "addMoreInvoices") {
        context.state.stateInvoices = [];
        context.state.invoicesIsLoading = true;
      }

      //2. Формирование списка примененных фильтров в виде массива
      const invoices = collection(db, "invoices");
      filterTerms = Object.keys(context.state.filters).filter(
        (k) => context.state.filters[k]
      );
      if (filterTerms.length < 1) {
        filterTerms = ["Draft", "Pending", "Paid"];
      }

      //3. Проверяем, есть ли примененные фильтры и устанавливаем длину всего списка инвойсов с учетом полученной информации
      async function checkLength() {
        let length = 0;

        //4. Данные о длине списка инвойсов хранятся в отдельном документе в базе данных и редактируются при каждом добавлении/удалении инвойса. Это сделано для экономии времени и вычислительных ресурсов, чтобы каждый раз не обрабатывать всю длину коллекции.
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

      //5. Передаю длину коллекции с учетом примененных фильтров в переменную определяющую пагинацию
      context.state.collectionLength = await checkLength();

      //6. Определяю таймстамп первого инвойса, чтобы отсчитывать от него следующие страницы
      let searchFirstDocQ = query(
        invoices,
        where("type", "==", "invoice"),
        orderBy("timestamp", "desc"),
        limit(1)
      );
      let firstDocSnapshot = await getDocs(searchFirstDocQ);
      let firstTimeStamp = 0;
      firstDocSnapshot.forEach((doc) => {
        firstTimeStamp = doc.data().timestamp;
      });

      //6. Запрашиваем блок инвойсов с учетом примененных фильтров и переносим их в state
      const q = query(
        invoices,
        where("type", "==", "invoice"),
        where("status", "in", filterTerms),
        orderBy("timestamp", "desc"),
        startAt(this.lastDocSnapshot ? this.lastDocSnapshot : firstTimeStamp),
        limit(context.state.itemsPerPage)
      );
      const querySnapshot = await getDocs(q);

      //Сохраняем последний загруженный документ
      this.lastDocSnapshot =
        querySnapshot.docs[context.state.stateInvoices.length - 1];
      if (querySnapshot.docs.length < 1) {
        context.state.invoicesIsLoading = false;
        context.state.showPlaceholder = true;
      }

      querySnapshot.forEach((doc) => {
        if (
          context.state.stateInvoices.find(
            (invoice) => invoice.docId == doc.id
          ) == undefined
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
          context.state.invoicesIsLoading = false;

          checkLength();
        }
      });

      //   //* Функция вызывается при загрузке страницы с начальными параметрами, при каждом изменении фильтра и при каждом клике по пагинации
      //   //Также вызывается при добавлении нового инвойса, при этом номер страницы принудительно ставится = 1, переключается пагинация. setPage(page)
      //Обновляются сведения о длине коллекции для каждого фильтра
      //Данные о длинне обновляются также при обновлении статуса инвойса
    },
    async DELETE_INVOICE(context) {
      const deletedInvoice = context.state.currentInvoice.docId;
      await deleteDoc(doc(db, "invoices", deletedInvoice));

      // Обновляем данные о длине коллекции внтури спец документа
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
