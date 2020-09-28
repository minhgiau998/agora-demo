import Vue from "vue";
import App from "./App.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import router from "@/router";
import "@/assets/fonts/css/icons.css";

Vue.config.productionTip = false;

Vue.use(Buefy, {
  defaultIconPack: "mdi",
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
