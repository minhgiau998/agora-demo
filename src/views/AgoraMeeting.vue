<template>
  <div class="wrapper meeting">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/meeting' }">
          <img
            src="https://www.agora.io/en/wp-content/uploads/2019/06/agoralightblue-1.png"
            alt="Agora Demo"
          />
        </b-navbar-item>
      </template>
    </b-navbar>
    <section class="hero is-info is-fullheight-with-navbar">
      <div class="hero-body">
        <div class="container">
          <AgoraMeetingVideoCall
            :channel="channel"
            :mode="mode"
            :transcode="transcode"
            :videoProfile="videoProfile"
            :attendeeMode="attendeeMode"
            :uid="uid"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import * as Cookies from "js-cookie";
import AgoraMeetingVideoCall from "@/components/AgoraMeetingVideoCall";

export default {
  components: {
    AgoraMeetingVideoCall,
  },
  data() {
    return {
      channel: Cookies.get("channel"),
      mode: Cookies.get("mode"),
      transcode: Cookies.get("transcode"),
      videoProfile: Cookies.get("videoProfile").split(",")[0],
      attendeeMode: Cookies.get("attendeeMode"),
      uid: undefined,
    };
  },
};
</script>
