<template>
  <div id="ag-canvas" class="hero is-fullheight">
    <div class="ag-btn-group">
      <span
        @click="handleExit"
        class="ag-btn exitBtn"
        :class="{ disabled: !readyState }"
        title="Exit"
      >
        <i class="ag-icon ag-icon-leave"></i>
      </span>
      <span
        v-if="attendeeMode === 'video'"
        @click="handleVideo"
        class="ag-btn videoControlBtn"
        title="Enable/Disable Video"
      >
        <i class="ag-icon ag-icon-camera"></i>
        <i class="ag-icon ag-icon-camera-off"></i>
      </span>
      <span
        v-if="attendeeMode !== 'audience'"
        @click="handleAudio"
        class="ag-btn audioControlBtn"
        title="Enable/Disable Audio"
      >
        <i class="ag-icon ag-icon-mic"></i>
        <i class="ag-icon ag-icon-mic-off"></i>
      </span>
    </div>
  </div>
</template>

<script>
import AgoraRTC from "agora-rtc-sdk";
import { merge } from "lodash";

const tile_canvas = {
  "1": ["span 12/span 24"],
  "2": ["span 12/span 12/13/25", "span 12/span 12/13/13"],
  "3": ["span 6/span 12", "span 6/span 12", "span 6/span 12/7/19"],
  "4": [
    "span 6/span 12",
    "span 6/span 12",
    "span 6/span 12",
    "span 6/span 12/7/13",
  ],
  "5": [
    "span 3/span 4/13/9",
    "span 3/span 4/13/13",
    "span 3/span 4/13/17",
    "span 3/span 4/13/21",
    "span 9/span 16/10/21",
  ],
  "6": [
    "span 3/span 4/13/7",
    "span 3/span 4/13/11",
    "span 3/span 4/13/15",
    "span 3/span 4/13/19",
    "span 3/span 4/13/23",
    "span 9/span 16/10/21",
  ],
  "7": [
    "span 3/span 4/13/5",
    "span 3/span 4/13/9",
    "span 3/span 4/13/13",
    "span 3/span 4/13/17",
    "span 3/span 4/13/21",
    "span 3/span 4/13/25",
    "span 9/span 16/10/21",
  ],
};

export default {
  props: {
    channel: {
      type: String,
      defaut: "demo",
    },
    mode: {
      type: String,
      default: "avc",
    },
    transcode: {
      type: String,
      default: "interop",
    },
    videoProfile: {
      type: String,
      default: "480p_4",
    },
    attendeeMode: {
      type: String,
      default: "video",
    },
    uid: {
      type: String,
      default: undefined,
    },
  },

  data() {
    return {
      appID: "836e6b6202314728a2e6e88289770c88",
      client: {},
      localStream: {},
      shareClient: {},
      shareStream: {},
      displayMode: "pip",
      streamList: [],
      readyState: false,
    };
  },

  methods: {
    // Initialize the local stream
    streamInit(uid, attendeeMode, videoProfile, config) {
      // Setup default config
      let defaultConfig = {
        streamID: uid,
        audio: true,
        video: true,
        screen: false,
      };

      // Setup video and audio config base on attendeeMode
      if (this.attendeeMode === "audio-only") {
        defaultConfig.video = false;
      } else if (this.attendeeMode === "audience") {
        defaultConfig.video = false;
        defaultConfig.audio = false;
      }

      // Create a local stream
      let stream = AgoraRTC.createStream(merge(defaultConfig, config));
      stream.setVideoProfile(videoProfile);
      return stream;
    },

    // Subscribe stream events
    subscribeStreamEvents() {
      let rtc = this;

      // Subscribe to a remote stream
      rtc.client.on("stream-added", function(evt) {
        let stream = evt.stream;
        console.log("New stream added: " + stream.getId());
        console.log("At " + new Date().toLocaleTimeString());
        console.log("Subcribe ", stream);

        rtc.client.subscribe(stream, function(err) {
          console.log("Subscribe stream failed: ", err);
        });
      });

      // Remove stream when a user leaves the channel
      rtc.client.on("peer-leave", function(evt) {
        console.log("Peer has left: " + evt.uid);
        console.log(new Date().toLocaleTimeString());
        console.log(evt);
        rtc.removeStream(evt.uid);
      });

      // Play the remote stream after subscribing
      rtc.client.on("stream-subscribed", function(evt) {
        let stream = evt.stream;
        console.log("Got stream-subscribe event");
        console.log(new Date().toLocaleTimeString());
        console.log(evt);
        rtc.addStream(stream);
      });

      // Stop the stream playback and remove its view
      rtc.client.on("stream-removed", function(evt) {
        let stream = evt.stream;
        console.log("Stream removed: " + stream.getId());
        console.log(new Date().toLocaleTimeString());
        console.log(evt);
        rtc.removeStream(stream.getId());
      });
    },

    // Remove stream
    removeStream(uid) {
      this.streamList.map((item, index) => {
        if (item.getId() === uid) {
          item.close();
          let element = document.querySelector("#ag-item-" + uid);
          if (element) {
            element.parentNode.removeChild(element);
          }
          let templateList = [...this.streamList];
          templateList.splice(index, 1);
          this.streamList = templateList;
        }
      });
    },

    // Add stream
    addStream(stream, push = false) {
      let repeat = this.streamList.some((item) => {
        return item.getId() === stream.getId();
      });
      if (repeat) {
        return;
      }
      if (push) {
        this.streamList = this.streamList.concat([stream]);
      } else {
        this.streamList = [stream].concat(this.streamList);
      }
    },

    // Handle video
    handleVideo(e) {
      e.currentTarget.classList.toggle("off");
      this.localStream.isVideoOn()
        ? this.localStream.disableVideo()
        : this.localStream.enableVideo();
    },

    // Handle audio
    handleAudio(e) {
      e.currentTarget.classList.toggle("off");
      this.localStream.isAudioOn()
        ? this.localStream.disableAudio()
        : this.localStream.enableAudio();
    },

    // Handle exit
    handleExit(e) {
      if (e.currentTarget.classList.contains("disabled")) {
        return;
      }
      try {
        this.client && this.client.unpublish(this.localStream);
        this.localStream && this.localStream.close();
        this.client &&
          this.client.leave(
            () => {
              console.log("Client success to leave.");
            },
            (err) => {
              console.log("Client failed to leave: " + err);
            }
          );
      } finally {
        this.readyState = false;
        this.client = null;
        this.localStream = null;
        this.$router.push("/");
      }
    },
  },

  created() {
    let $ = this;
    // Init AgoraRTC local client
    $.client = AgoraRTC.createClient({ mode: $.transcode });
    $.client.init($.appID, () => {
      console.log("AgoraRTC client initialized.");

      // Subscribe stream events
      $.subscribeStreamEvents();

      // Join a channel
      $.client.join($.appID, $.channel, $.uid, (uid) => {
        console.log("User " + uid + " join channel successfully");
        console.log("At " + new Date().toLocaleTimeString());

        // Create local stream
        console.log(uid);
        $.localStream = this.streamInit(uid, $.attendeeMode, $.videoProfile);
        $.localStream.init(
          () => {
            if ($.attendeeMode !== "audience") {
              $.addStream($.localStream, true);
              $.client.publish($.localStream, (err) => {
                console.log("Publish local stream error: " + err);
              });
            }
            $.readyState = true;
          },
          (err) => {
            console.log("getUserMedia failed: ", err);
            $.readyState = true;
          }
        );
      });
    });
  },

  mounted() {
    this.$nextTick(() => {
      // Add event listner to btnGroup
      let canvas = document.querySelector("#ag-canvas");
      let btnGroup = document.querySelector(".ag-btn-group");
      canvas.addEventListener("mousemove", () => {
        if (global._toolbarToggle) {
          clearTimeout(global._toolbarToggle);
        }
        btnGroup.classList.add("active");
        global._toolbarToggle = setTimeout(function() {
          btnGroup.classList.remove("active");
        }, 2000);
      });
    });
  },

  beforeUpdate() {
    let $ = this;
    let canvas = document.querySelector("#ag-canvas");
    if ($.displayMode === "pip") {
      // pip mode (only use when less than 4 people in channel)
      if ($.streamList.length > 4) {
        $.displayMode = "tile";
        return;
      }
      $.streamList.map((item, index) => {
        let id = item.getId();
        let agItemID = document.querySelector("#ag-item-" + id);
        if (!agItemID) {
          agItemID = document.createElement("section");
          agItemID.setAttribute("id", "ag-item-" + id);
          agItemID.setAttribute("class", "ag-item");
          canvas.appendChild(agItemID);
          item.play("ag-item-" + id);
        }
        if (index === $.streamList.length - 1) {
          agItemID.setAttribute("style", `grid-area: span 12/span 24/13/25`);
        } else {
          agItemID.setAttribute(
            "style",
            `grid-area: span 3/span 4/${4 + 3 * index}/25;
          z-index:1;width:calc(100% - 20px);height:calc(100% - 20px)`
          );
        }
        item.player.resize && item.player.resize();
      });
    } else if ($.displayMode === "tile") {
      // tile mode
      $.streamList.map((item, index) => {
        let id = item.getId();
        let agItemID = document.querySelector("#ag-item-" + id);
        if (!agItemID) {
          agItemID = document.createElement("section");
          agItemID.setAttribute("id", "ag-item-" + id);
          agItemID.setAttribute("class", "ag-item");
          canvas.appendChild(agItemID);
          item.play("ag-item-" + id);
        }
        agItemID.setAttribute(
          "style",
          `grid-area: ${tile_canvas[$.streamList.length][index]}`
        );
        item.player.resize && item.player.resize();
      });
    }
  },

  beforeDestroy() {
    this.client && this.client.unpublish(this.localStream);
    this.localStream && this.localStream.close();
    this.client &&
      this.client.leave(
        () => {
          console.log("Client success to leave.");
        },
        (err) => {
          console.log("Client failed to leave: ", err);
        }
      );
  },
};
</script>

<style>
#ag-canvas {
  height: 100%;
  display: grid;
  grid-gap: 10px;
  align-items: center;
  justify-items: center;
  grid-template-rows: repeat(12, auto);
  grid-template-columns: repeat(24, auto);
}

.ag-item :first-child {
  border-radius: 6px;
}

.ag-item {
  border-radius: 6px;
  border: 2px #00b6ed solid;
  /* background: url("../assets/images/avatar.png") center no-repeat; */
  height: 100%;
  width: 100%;
}

#ag-resize-container {
  background-image: none !important;
  background-color: black;
  display: flex;
  justify-content: center;
  height: center;
}

#ag-resize-container .ag-item {
  border: none !important;
}

/* button group */
.ag-btn-group {
  height: 70px;
  width: 100%;
  margin: 0 auto;
  position: absolute;
  bottom: 0;
  background: transparent;
  z-index: 11;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.ag-btn-group:hover,
.ag-btn-group.active {
  background: rgba(18, 74, 99, 0.8);
}

.ag-btn {
  z-index: 12;
  opacity: 0;
  color: white;
  /* width: 35px;
    height: 35px; */
  cursor: pointer;
  font-size: 60px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.ag-btn:hover {
  color: #00b6ed;
}

.ag-btn.disabled,
.ag-btn.disabled:hover {
  color: #637c8e;
  cursor: not-allowed;
}

.ag-btn-group:hover .ag-btn,
.ag-btn-group.active .ag-btn {
  opacity: 1;
}

.ag-btn.off.videoControlBtn .ag-icon-camera {
  display: none;
}

.ag-btn.videoControlBtn .ag-icon-camera-off {
  display: none;
}

.ag-btn.videoControlBtn .ag-icon-camera {
  display: inline-block;
}

.ag-btn.off.videoControlBtn .ag-icon-camera-off {
  display: inline-block;
}

.ag-btn.off.audioControlBtn .ag-icon-mic {
  display: none;
}

.ag-btn.audioControlBtn .ag-icon-mic-off {
  display: none;
}

.ag-btn.audioControlBtn .ag-icon-mic {
  display: inline-block;
}

.ag-btn.off.audioControlBtn .ag-icon-mic-off {
  display: inline-block;
}

video {
  max-width: unset !important;
}
</style>
