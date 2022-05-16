import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRO1JwLwmscuXMxyFC4Mht8D-GCUl_p5A",
  authDomain: "invoice-app-base.firebaseapp.com",
  projectId: "invoice-app-base",
  storageBucket: "invoice-app-base.appspot.com",
  messagingSenderId: "864558161267",
  appId: "1:864558161267:web:425e8edbbf69dfc497f906",
};
const app = initializeApp(firebaseConfig);

export default getFirestore(app);
