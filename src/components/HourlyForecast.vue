<template>
  <div id="hourlyContainer">
    <div id="celsiusSymbol">C°</div>
    <div id="dropletSymbol">💧%</div>
    <div id="windSymbol">m/s</div>
  </div>
</template>


<script>

export default {
  name: 'HourlyForecast',
  data() {
    return {
    }
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      const hourCount = 10;
      const hours = this.weatherData.hourly.slice(0, hourCount);
      const hourlyGrid = document.getElementById("hourlyContainer");

      for (let i = 0; i < hourCount; ++i) {
        // hour cell
        const hourDiv = document.createElement("div");
        hourDiv.innerHTML = new Date(hours[i].dt * 1000).getHours();
        hourDiv.style.gridArea = (i + 2) + " / 1";
        hourlyGrid.appendChild(hourDiv);

        // icon cell
        const iconDiv = document.createElement("img");
        iconDiv.src = `http://openweathermap.org/img/wn/${hours[i].weather[0].icon}@2x.png`;
        iconDiv.style.gridArea = (i + 2) + " / 2";
        iconDiv.style.textAlign = "center";
        iconDiv.style.display = "block"
        iconDiv.style.margin = "0 auto";
        iconDiv.style.maxWidth = "100%";
        hourlyGrid.appendChild(iconDiv);

        // temp cell
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = Math.round(hours[i].temp);
        tempDiv.style.gridArea = (i + 2) + " / 3";
        hourlyGrid.appendChild(tempDiv);

        // rain cell
        const rainDiv = document.createElement("div");
        rainDiv.innerHTML = hours[i].pop * 100;
        rainDiv.style.gridArea = (i + 2) + " / 4";
        hourlyGrid.appendChild(rainDiv);

        // wind cell
        const windDiv = document.createElement("div");
        windDiv.innerHTML = Math.round(hours[i].wind_speed);
        windDiv.style.gridArea = (i + 2) + " / 5";
        hourlyGrid.appendChild(windDiv);

      }
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
  #hourlyContainer {
    grid-column-start: 1;
    grid-row-start: 2;
    background: linear-gradient(#b4dbff, #58aeff);
    border-radius: 10px;
    display: grid;
    grid-template-rows: repeat(11, 1fr);
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
  }

  #celsiusSymbol {
    grid-column-start: 3;
    grid-row-start: 1;
  }
  
  #dropletSymbol {
    grid-column-start: 4;
    grid-row-start: 1;
  }
  
  #windSymbol {
    grid-column-start: 5;
    grid-row-start: 1;
  }
</style>
