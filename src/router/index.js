import Vue from "vue";
import Router from "vue-router";
import AgoraHome from "@/views/AgoraHome";
import AgoraMeeting from "@/views/AgoraMeeting";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: AgoraHome
    },
    {
      path: "/meeting",
      name: "meeting",
      component: AgoraMeeting
    }
  ]
});
