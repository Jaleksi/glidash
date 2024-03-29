<template>
<div id="dailyContainer">
    <div id="celsiusSymbol">C°</div>
    <div id="lowestSymbol">↓</div>
    <div id="highestSymbol">↑</div>
    <div id="dropletSymbol">💧%</div>
    <canvas id="temperatureCanvas"/>
  </div>
</template>


<script>
import { drawTemperatureGraph } from '../canvas_utils'

export default {
  name: 'DailyForecast',
  data() {
    return {
      canvas: null,
      ctx: null,
      daysCount: 7,
      dayNames: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
    }
  },
  mounted() {
    this.canvas = document.getElementById("temperatureCanvas");
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.ctx = this.canvas.getContext("2d");
    this.draw();
  },
  methods: {
    clear() {
      const dailyGrid = document.getElementById("dailyContainer");
      const idsToSpare = [
        "celsiusSymbol",
        "lowestSymbol",
        "highestSymbol",
        "dropletSymbol",
        "temperatureCanvas",
      ];
      [...dailyGrid.childNodes].forEach((child) => {
        if (!idsToSpare.includes(child.id)) {
          dailyGrid.removeChild(child);
        }
      });
    },

    draw() {
      this.clear();
      const days = this.weatherData.daily.slice(0, this.daysCount);
      const dailyGrid = document.getElementById("dailyContainer");

      for (let i = 0; i < this.daysCount; ++i) {
        // Insert day cell
        const dayDiv = document.createElement("div");
        const dayNum = new Date(days[i].dt * 1000).getDay();
        dayDiv.innerHTML = this.dayNames[dayNum];
        dayDiv.style.gridArea = (i + 2) + " / 1";
        dailyGrid.appendChild(dayDiv);

        // Insert min/max cells
        const minTempDiv = document.createElement("div");
        minTempDiv.innerHTML = Math.round(days[i].temp.min);
        minTempDiv.style.gridArea = (i + 2) + " / 2";
        dailyGrid.appendChild(minTempDiv);
        const maxTempDiv = document.createElement("div");
        maxTempDiv.innerHTML = Math.round(days[i].temp.max);
        maxTempDiv.style.gridArea = (i + 2) + " / 4";
        dailyGrid.appendChild(maxTempDiv);

        // Insert rain probability cell
        const rainDiv = document.createElement("div");
        rainDiv.innerHTML = Math.round(days[i].pop * 100);
        rainDiv.style.gridArea = (i + 2) + " / 5";
        rainDiv.textAlign = "right";
        dailyGrid.appendChild(rainDiv);
      }

      const temps = days.map(d => d.temp);
      drawTemperatureGraph(this.ctx, this.canvas, temps);
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
  #dailyContainer {
    grid-column-start: 1;
    grid-row-start: 1;
    display: grid;
    grid-template-rows: repeat(8, 1fr);
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
    background: linear-gradient(#FFF4E0, #F6E1C3);
    border-radius: 10px;
  }

  #celsiusSymbol {
    grid-column-start: 3;
    grid-row-start: 1;
  }
  
  #lowestSymbol {
    grid-column-start: 2;
    grid-row-start: 1;
  }
  
  #highestSymbol {
    grid-column-start: 4;
    grid-row-start: 1;
  }

  #dropletSymbol {
    grid-column-start: 5;
    grid-row-start: 1;
  }

  #temperatureCanvas {
    grid-column-start: 3;
    grid-row-start: 2;
    grid-row-end: 9;
    height: 100%;
    width: 100%;
    opacity: 0.8;
  }

  #dailyItem {
    background: white;

  }
</style>
