<template>
  <div class="wrapper meeting">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img
            src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
            alt="Lightweight UI components for Vue.js based on Bulma"
          />
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item href="#">
          Home
        </b-navbar-item>
        <b-navbar-item href="#">
          Documentation
        </b-navbar-item>
        <b-navbar-dropdown label="Info">
          <b-navbar-item href="#">
            About
          </b-navbar-item>
          <b-navbar-item href="#">
            Contact
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons">
            <a class="button is-primary">
              <strong>Sign up</strong>
            </a>
            <a class="button is-light">
              Log in
            </a>
          </div>
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
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>Bulma</strong> by
          <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is
          licensed
          <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The
          website content is licensed
          <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
            >CC BY NC SA 4.0</a
          >.
        </p>
      </div>
    </footer>
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

<style scoped></style>
