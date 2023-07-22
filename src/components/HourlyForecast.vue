<template>
  <div id="hourlyContainer">
    <div id="celsiusSymbol">C°</div>
    <div id="windSymbol">m/s</div>
    <div id="dropletSymbol">💧%</div>
  </div>
</template>


<script>

export default {
  name: 'HourlyForecast',
  data() {
    return {
      hourCount: 10,
    }
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      this.clear();
      const hours = this.weatherData.hourly.slice(0, this.hourCount);
      const hourlyGrid = document.getElementById("hourlyContainer");

      for (let i = 0; i < this.hourCount; ++i) {
        // hour cell
        const hourDiv = document.createElement("div");
        const hoursString = new Date(hours[i].dt * 1000).getHours().toString();
        hourDiv.innerHTML = hoursString.padStart(2, "0");
        hourDiv.style.gridArea = (i + 2) + " / 1";
        hourlyGrid.appendChild(hourDiv);

        // icon cell
        const icon = document.createElement("img");
        icon.className = "iconWrapper";
        icon.src = `https://openweathermap.org/img/wn/${hours[i].weather[0].icon}@2x.png`;
        icon.style.gridArea = (i + 2) + " / 2";
        hourlyGrid.appendChild(icon);

        // temp cell
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = Math.round(hours[i].temp);
        tempDiv.style.gridArea = (i + 2) + " / 3";
        hourlyGrid.appendChild(tempDiv);

        // wind cell
        const windDiv = document.createElement("div");
        windDiv.innerHTML = Math.round(hours[i].wind_speed);
        windDiv.style.gridArea = (i + 2) + " / 4";
        hourlyGrid.appendChild(windDiv);

        // rain cell
        const rainDiv = document.createElement("div");
        rainDiv.innerHTML = Math.round(hours[i].pop * 100);
        rainDiv.style.gridArea = (i + 2) + " / 5";
        hourlyGrid.appendChild(rainDiv);
      }
    },

    clear() {
      const hourlyGrid = document.getElementById("hourlyContainer");
      const divIdsToSpare = ["celsiusSymbol", "dropletSymbol", "windSymbol"];
    
      [...hourlyGrid.childNodes].forEach((child) => {
        if (!divIdsToSpare.includes(child.id)) {
          hourlyGrid.removeChild(child);
        }
      });
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



<style>
  #hourlyContainer {
    grid-column-start: 1;
    grid-row-start: 2;
    background: linear-gradient(#FFF4E0, #F6E1C3);
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

  #windSymbol {
    grid-column-start: 4;
    grid-row-start: 1;
  }
  
  #dropletSymbol {
    grid-column-start: 5;
    grid-row-start: 1;
  }

  .iconWrapper {
    text-align: center;
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }
</style>
