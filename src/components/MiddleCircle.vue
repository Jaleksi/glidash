<template>
  <canvas id="middleCanvas"/>
  <div id="currentTempText">
    {{this.$store.state.weatherData
      ? Math.round(this.$store.state.weatherData.current.temp)
      : "8"
    }}°
  </div>
  <div id="datetimeText"></div>
</template>


<script>
import { drawHourlyGraph, drawSunGraph } from '../canvas_utils'
const OPTIONS = {
  drawTemperatureGraph: true,
  drawSunGraph: true,
};

export default {
  name: 'MiddleCircle',
  data() {
    return {
      canvas: null,
      ctx: null,
      weekDays: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"],
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
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      const r = cx * 0.9;
      const sunrise = this.$store.state.weatherData.current.sunrise;
      const sunset = this.$store.state.weatherData.current.sunset;
      const dt = this.$store.state.weatherData.current.dt;

      if (OPTIONS.drawTemperatureGraph) {
        drawHourlyGraph(this.ctx, cx, cy, r, hourlyTemps);
      }
      if (OPTIONS.drawSunGraph) {
        drawSunGraph(this.ctx, cx, cy, r, dt, sunrise, sunset);
      }
    },

    updateDateTime() {
      const datetextDiv = document.getElementById("datetimeText");
      const now = new Date();
      const day = this.weekDays[now.getDay()];
      const date = `${now.getDate()}.${now.getMonth() + 1}.`;
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const time = `${hours}:${minutes}`;
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
    color: #FFF4E0;
  }

  #datetimeText {
    position: absolute;
    z-index: 1;
    top: 84%;
    left: 50%;
    font-size: 1.5em;
    transform: translate(-50%, 150%);
    color: #FFF4E0;
  }
</style>
