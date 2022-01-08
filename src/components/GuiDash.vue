<template>
  <div id="mainContainer">
    <div id="leftContainer">
      <Karpat v-if="karpatDataFetched"/>
      <h1 v-else>LOADING KARPAT DATA...</h1>
      <Korona v-if="koronaDataFetched"/>
      <h1 v-else>LOADING KORONA DATA...</h1>
    </div>
    <div id="middleContainer">
      <MiddleCircle v-if="weatherDataFetched"/>
      <h1 v-else>LOADING WEATHERDATA...</h1>
    </div>
    <div id="rightContainer">
      <div v-if="weatherDataFetched" id="forecastContainer">
        <DailyForecast/>
        <HourlyForecast/>
      </div>  
      <h1 v-else>LOADING WEATHERDATA...</h1>
    </div>
  </div>
</template>

<script>
import MiddleCircle from './MiddleCircle.vue'
import DailyForecast from './DailyForecast.vue'
import HourlyForecast from './HourlyForecast.vue'
import Karpat from './Karpat.vue'
import Korona from './Korona.vue'

export default {
  name: 'GuiDash',
  components: {
    MiddleCircle,
    DailyForecast,
    HourlyForecast,
    Karpat,
    Korona,
  },
  data() {
    return {
      weatherDataFetched: false,
      karpatDataFetched: false,
      koronaDataFetched: false,
      dataFetchInterval: null,
    };
  },
  mounted() {
    /*
    this.dataFetchInterval =
      setInterval(this.$store.dispatch('updateWeatherData'), 300000);

    this.$store.dispatch('updateWeatherData').then((res) => {
      this.weatherDataFetched = true;
    }, err => {
      this.weatherDataFetched = false;
    });
    */
    this.$store.dispatch('updateKoronaData').then((res) => {
      this.koronaDataFetched = true;
    }, err => {
      this.koronaDataFetched = false;
    });    

    this.$store.dispatch('updateKarpatData').then((res) => {
      this.karpatDataFetched = true;
    }, err => {
      this.karpatDataFetched = false;
    });


    setTimeout(() => {
      this.weatherDataFetched = true;
    }, 1000);
  },
  beforeUnmount() {
    if (this.dataFetchInterval) {
      clearInterval(this.dataFetchInterval);
      this.dataFetchInterval = null;
    }
  },
}
</script>

<style scoped>
  #mainContainer {
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-rows: 1;
    grid-template-columns: repeat(4, 1fr);
  }

  #leftContainer {
    grid-column-start: 1;
    grid-row-start: 1;
    display: grid;
    grid-template-rows: 1fr 1fr;
  }

  #middleContainer {
    grid-column-start: 2;
    grid-column-end: 4;
    grid-row-start: 1;
  }

  #rightContainer {
    grid-column-start: 4;
    grid-row-start: 1;
  }

  #forecastContainer {
    height: calc(100vh - 1em);
    display: grid;
    grid-template-rows: 1fr 1fr;
    margin: 0.5em;
    grid-gap: 4px;
  }

  #koronaContainer {
    margin: 0.5em;
  }
</style>
