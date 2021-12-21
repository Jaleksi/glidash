import { createStore } from 'vuex'
import axios from 'axios'


export const store = createStore({
  state: {
    weatherData: null,
  },
  mutations: {
    updateWeatherData(state, weatherData) {
      state.weatherData = weatherData;
      console.log("updatedData");
    },
  },
  actions: {
    updateWeatherData({ commit }) {
      const apiUrl = "http://api.openweathermap.org/data/2.5/onecall";
      const param = {
        'appid': process.env.VUE_APP_WEATHER_API_KEY,
        'lat': 65.012011,
        'lon': 25.483423,
        'exclude': 'minutely,alerts',
        'units': 'metric',
      };

      return axios.get(apiUrl, {params: param}).then(res => {
        commit('updateWeatherData', res.data)
      }).catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
    },

  }
});
