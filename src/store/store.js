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
} from "firebase/firestore";

export default createStore({
  state: {
    stateInvoices: [],
    invoiceForm: null,
    deleteModalActive: null,
    collectionLength: 0,

    //Applied filters
    filters: { draft: false, pending: false, paid: false },

    //Pagination settings
    itemsPerPage: 3,
    paginationPage: 1,
    paginationRecords: 20,
    paginationOptions: {
      chunk: 5,
      texts: {
        count: `Showing {from} to {to} of {count} invoices|{count} invoices|One invoice`,
      },
    },
  },
  mutations: {
    TOGGLE_FORM(state) {
      state.invoiceForm = !state.invoiceForm;
    },
    TOGGLE_MODAL(state) {
      state.deleteModalActive = !state.deleteModalActive;
    },
    SET_FILTERS(state, payload) {
      state.filters = payload;
    },
    GET_INVOICES(state, payload) {
      state.stateInvoices.push(payload);
    },
    SET_ACTIVE_PAGE(state, payload) {
      state.paginationPage = +payload;
    },
  },
  actions: {
    async GET_INVOICES(context) {
      //1. Обнуление списка примененных фильтров, списка инвойсов в state и установка начальной страницы в пагинации
      let filterTerms = [];
      context.state.stateInvoices = [];

      //2. Формирование списка примененных фильтров в виде массива
      const invoices = collection(db, "invoices");
      filterTerms = Object.keys(context.state.filters).filter(
        (k) => context.state.filters[k]
      );
      if (filterTerms.length < 1) {
        filterTerms = ["draft", "pending", "paid"];
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
          if (contains(filterTerms, "pending")) {
            querySnapshot.forEach((doc) => {
              length += doc.data().pendingLength;
            });
          }
          if (contains(filterTerms, "draft")) {
            querySnapshot.forEach((doc) => {
              length += doc.data().draftLength;
            });
          }
          if (contains(filterTerms, "paid")) {
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
      context.state.paginationRecords = await checkLength();

      //   //4. При клике на пагинацию передавать в state номер страницы
      //   //5. Вывести 5 итемов из коллекции. StartAt (номер страницы умноженный на длину итемов на странице - длина итемов на странице )
      console.log(context.state.paginationPage);
      console.log(
        context.state.paginationPage * context.state.itemsPerPage -
          context.state.itemsPerPage +
          1
      );

      //6. Определяю таймстамп первого инвойса, чтобы отсчитывать от него следующие страницы
      let searchFirstDocQ = query(
        invoices,
        where("type", "==", "invoice"),
        orderBy("timestamp"),
        limit(1)
      );
      let firstDocSnapshot = await getDocs(searchFirstDocQ);
      let firstTimeStamp = 0;
      firstDocSnapshot.forEach((doc) => {
        firstTimeStamp = doc.data().timestamp;
      });
      console.log(firstTimeStamp);

      const q = query(
        invoices,
        where("type", "==", "invoice"),
        where("status", "in", filterTerms),
        orderBy("timestamp"),
        startAt(
          firstTimeStamp
          // context.state.paginationPage * context.state.itemsPerPage -
          //   context.state.itemsPerPage +
          //   1
        ),
        limit(context.state.itemsPerPage)
      );
      const querySnapshot = await getDocs(q);

      //6. Запрашиваем блок инвойсов с учетом примененных фильтров и переносим их в state
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
            type: "invoice",
          };
          context.commit("GET_INVOICES", data);
        }
      });

      //   //* Функция вызывается при загрузке страницы с начальными параметрами, при каждом изменении фильтра и при каждом клике по пагинации
      //   //Также вызывается при добавлении нового инвойса, при этом номер страницы принудительно ставится = 1, переключается пагинация. setPage(page)
      //Обновляются сведения о длине коллекции для каждого фильтра
      //Данные о длинне обновляются также при обновлении статуса инвойса
    },
  },
});
