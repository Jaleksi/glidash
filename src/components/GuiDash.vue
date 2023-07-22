<template>
  <div id="mainContainer">
    <div id="leftContainer">
      <Karpat v-if="karpatDataFetched"/>
      <h1 v-else>LOADING KARPAT DATA...</h1>
      <Busses v-if="bussesDataFetched"/>
      <h1 v-else>LOADING BUSSES DATA...</h1>
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
import Busses from './Busses.vue'

export default {
  name: 'GuiDash',
  components: {
    MiddleCircle,
    DailyForecast,
    HourlyForecast,
    Karpat,
    Busses,
  },
  data() {
    return {
      weatherDataFetched: false,
      karpatDataFetched: false,
      bussesDataFetched: false,
      dataFetchInterval1min: null,
      dataFetchInterval5min: null,
      staticDataFetchInterval: null,
    };
  },
  mounted() {
    this.dataFetchInterval5min =
      setInterval(this.updateDatas, 300000);
    this.dataFetchInterval1min =
      setInterval(this.updateDatas, 60000);

    this.updateDatas5min();
    this.updateDatas1min();
  },
  beforeUnmount() {
    if (this.dataFetchInterval1min) {
      clearInterval(this.dataFetchInterval1min);
      this.dataFetchInterval1min = null;
    }
    if (this.dataFetchInterval5min) {
      clearInterval(this.dataFetchInterval5min);
      this.dataFetchInterval5min = null;
    }
  },
  methods: {
    updateDatas5min() {
      this.$store.dispatch('updateWeatherData').then((res) => {
        this.weatherDataFetched = true;
      }, err => {
        this.weatherDataFetched = false;
        console.log(err);
      });

      this.$store.dispatch('updateKarpatData').then((res) => {
        this.karpatDataFetched = true;
      }, err => {
        this.karpatDataFetched = false;
        console.log(err);
      });
    },
    updateDatas1min() {
      this.$store.dispatch('updateBussesLiveData').then((res) => {
        this.bussesDataFetched = true;
      }, err => {
        this.bussesDataFetched = false;
        console.error(err);
      });
    },
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
