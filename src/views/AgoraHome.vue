<template>
  <section class="hero is-info is-fullheight">
    <div class="hero-body">
      <div class="container">
        <h1 class="title has-text-centered">Demo Web RTC</h1>
        <h2 class="subtitle has-text-centered">Powered by Agora</h2>
        <b-field>
          <b-input
            placeholder="Name of room"
            type="text"
            required
            validation-message="Only lowercase is allowed"
            pattern="[a-z]*"
            v-model="channel"
          ></b-input>
        </b-field>
        <b-field label="Mode">
          <b-select v-model="mode" placeholder="Choose type of service">
            <option
              v-for="(mode, index) in modes"
              :value="mode.value"
              :key="index"
              >{{ mode.label }}</option
            >
          </b-select>
        </b-field>
        <b-field label="Transcode">
          <div class="block">
            <b-radio v-model="transcode" native-value="">
              VP8-only
            </b-radio>
            <b-radio v-model="transcode" native-value="interop">
              VP8 and H264
            </b-radio>
            <b-radio v-model="transcode" native-value="h264_interop">
              H264-only
            </b-radio>
          </div>
        </b-field>
        <b-field label="Resolution">
          <b-select
            v-model="videoProfile"
            placeholder="Choose type of resolution"
          >
            <option
              v-for="(resolution, index) in resolutions"
              :value="index.split(',')[0]"
              :key="index"
              >{{ resolution[0] }}x{{ resolution[1] }}, {{ resolution[2] }}fps,
              {{ resolution[3] }}kbps</option
            >
          </b-select>
        </b-field>
        <b-field label="Attendance Mode">
          <div class="block">
            <b-radio v-model="attendeeMode" native-value="video">
              Video Call
            </b-radio>
            <b-radio v-model="attendeeMode" native-value="audio-only">
              Audio-only
            </b-radio>
            <b-radio v-model="transcode" native-value="audience">
              Audience
            </b-radio>
          </div>
        </b-field>
        <b-button @click="join" type="is-warning">Join</b-button>
      </div>
    </div>
  </section>
</template>

<script>
import { RESOLUTION_ARR } from "@/utils/resolutions";
import * as Cookies from "js-cookie";

export default {
  data() {
    return {
      channel: "",
      modes: [
        {
          label: "Agora Video Call",
          value: "avc",
        },
        {
          label: "Agora Live",
          value: "al",
        },
      ],
      mode: "avc",
      transcode: "interop",
      resolutions: RESOLUTION_ARR,
      videoProfile: "480p_4",
      attendeeMode: "video",
    };
  },
  methods: {
    join() {
      Cookies.set("channel", this.channel);
      Cookies.set("mode", this.mode);
      Cookies.set("transcode", this.transcode);
      Cookies.set("videoProfile", this.videoProfile);
      Cookies.set("attendeeMode", this.attendeeMode);
      this.$router.push("/meeting");
    },
  },

  mounted() {},
};
</script>
