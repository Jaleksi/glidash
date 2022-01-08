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
import { drawTemperatureGraph } from '../canvas'

export default {
  name: 'DailyForecast',
  data() {
    return {
      canvas: null,
      ctx: null,
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
    draw() {
      const daysCount = 7;
      //const days = this.weatherData.daily.slice(0, daysCount);
      const days = [
        {
          dt: 1640080800,
          temp: {
            min: -25,
            max: 25,
          },
          pop: 0.2,
        },
        {
          dt: 1640080800,
          temp: {
            min: -5,
            max: 15,
          },
          pop: 0.2,
        },
        {
          dt: 1640080800,
          temp: {
            min: -5,
            max: 5,
          },
          pop: 0.2,
        },
        {
          dt: 1640080800,
          temp: {
            min: -8,
            max: 12,
          },
          pop: 0.2,
        },
        {
          dt: 1640080800,
          temp: {
            min: -15,
            max: 15,
          },
          pop: 0.2,
        },
        {
          dt: 1640080800,
          temp: {
            min: -15,
            max: 15,
          },
          pop: 0.2,
        },
        {
          dt: 1640080800,
          temp: {
            min: -15,
            max: 15,
          },
          pop: 0.2,
        },
      ];

      const dayNames = ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"];
      const dailyGrid = document.getElementById("dailyContainer");

      for (let i = 0; i < daysCount; ++i) {
        // Insert day cell
        const dayDiv = document.createElement("div");
        const dayNum = new Date(days[i].dt * 1000).getDay();
        dayDiv.innerHTML = dayNames[dayNum];
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
        rainDiv.innerHTML = days[i].pop * 100;
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
    background: linear-gradient(#b4dbff, #58aeff);
    border-radius: 10px;
  }

  #hourlyContainer {
    grid-column-start: 1;
    grid-row-start: 2;
    background: linear-gradient(#b4dbff, #58aeff);
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
    opacity: 80%;
  }

  #dailyItem {
    background: white;

  }
</style>
