import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import Paginate from "vuejs-paginate-next";

// import Event bus support library
import mitt from "mitt";

// 실제 데이터를 json으로 주고받기 위해 무언가 요청할 때 사용할 수 있도록 설정
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

const app = createApp(App);
const emitter = mitt();

// Declare globalProperties
// app에 통신할 때 axios 쓸 거야 선언
app.config.globalProperties.axios = axios;
app.config.productionTip = false;
// set globalProperties "emitter" that mitt Object ref-variable
app.config.globalProperties.emitter = emitter;

// store, router, vueSession, sessionOptions 사용할 거야
// 네 개 다 사용해서 app을 띄워

app
  .use(store)
  .use(router)
  .use(Paginate)
  //.use(twLib)
  .use(emitter)
  .mount("#app");

// main.js
// - 제일 먼저 실행되는 js
// - 프로젝트에서 필요한 게 있으면 main.js에서 공통적으로 사용할 수 있도록 import 해 주면 됨
// - jsp 방식에서의 common_include.jsp file 과 동일한 기능이라 볼 수 있다.
