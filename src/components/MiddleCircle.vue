<template>
  <canvas id="middleCanvas"/>
  <div id="currentTempText">
    {{this.$store.state.weatherDataX
      ? Math.round(this.$store.state.weatherData.current.temp)
      : "8"
    }}°
  </div>
  <div id="datetimeText"></div>
</template>


<script>
import { drawHourlyGraph, drawSunGraph } from '../canvas'

export default {
  name: 'MiddleCircle',
  data() {
    return {
      canvas: null,
      ctx: null,
      weekDays: ["Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai", "Sunnuntai"],
      dateTimeInterval: null,
    }
  },
  mounted() {
    const canvas = document.getElementById("middleCanvas");
    const ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.ctx = ctx;
    this.draw();
    this.updateDateTime();
    this.dateTimeInterval = setInterval(this.updateDateTime, 60000);
  },

  beforeUnmount() {
    if (this.dateTimeInterval) {
      clearInterval(this.dateTimeInterval);
      this.dateTimeInterval = null;
    }
  },

  methods: {
    clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    draw() {
      this.clear();
      const hourlyTemps = this.$store.state.weatherData.hourly.map(h => h.temp); 
      //const hourlyTemps = [3,2,2,3,3,4,4,4,4,5,5,3,3,3,2,2,2,2,1,1,3,4,4,5,5,6];
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      const r = cx * 0.98; // 0.9
      const sunrise = 1639728000;
      const sunset = 1639742400;
      const dt = 1639731600;

      drawHourlyGraph(this.ctx, cx, cy, r, hourlyTemps);
      drawSunGraph(this.ctx, cx, cy, r, dt, sunrise, sunset);
    },

    updateDateTime() {
      const datetextDiv = document.getElementById("datetimeText");
      const now = new Date();
      const day = this.weekDays[now.getDay()];
      const date = `${now.getDate()}.${now.getMonth() + 1}.`;
      const time = `${now.getHours()}:${now.getMinutes()}`;
      datetextDiv.innerHTML = `${day} ${date} ${time}`;
    },
  },

  computed: {
    weatherData() {
      return this.$store.state.weatherData;
    },
  },

  watch: {
    weatherData(newData, oldData) {
      this.draw();
    },
  },
}

</script>



<style scoped>
  #middleCanvas {
    width: 100%;
    height: 100%;
  }

  #currentTempText {
    position: absolute;
    z-index: 1;
    font-size: 6em;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  #datetimeText {
    position: absolute;
    z-index: 1;
    top: 84%;
    left: 50%;
    font-size: 1.5em;
    transform: translate(-50%, 150%);
  }
</style>
