import { createStore } from 'vuex'
import axios from 'axios'


export const store = createStore({
  state: {
    weatherData: null,
    karpatData: null,
    koronaData: null,
  },
  mutations: {
    updateWeatherData(state, weatherData) {
      state.weatherData = weatherData;
    },
    
    updateKoronaData(state, koronaData) {
      const ouluData = koronaData.features.find((entry) => {
        return entry.attributes.sairaanhoitopiiri === "Pohjois-Pohjanmaa";
      });
      const suomiData = koronaData.features.find((entry) => {
        return entry.attributes.sairaanhoitopiiri === "Kaikki sairaanhoitopiirit";
      });

      const trimData = {
        "oulu": {
          "tapaukset": ouluData.attributes.tapauksia_14vrk,
          "ilmaantuvuus": ouluData.attributes.ilmaantuvuus_14vrk,
        },
        "suomi": {
          "tapaukset": suomiData.attributes.tapauksia_14vrk,
          "ilmaantuvuus": suomiData.attributes.ilmaantuvuus_14vrk,
        },
      };
      state.koronaData = trimData;
    },

    updateKarpatData(state, karpatData) {
      const gamesOfInterest = [];
      const karpatId = "495643563:kärpät";
      const karpatGames = karpatData.filter((game) => {
        const karpatHomeTeam = game.homeTeam.teamId === karpatId;
        const karpatAwayTeam = game.awayTeam.teamId === karpatId;
        return karpatHomeTeam || karpatAwayTeam;
      });

      const maxGames = 8;
      let futureGamesCount = 0;
      for (let i = 0; i < karpatGames.length; ++i) {
        gamesOfInterest.push(karpatGames[i]);
        if (!karpatGames[i].started) {
          futureGamesCount++;
        }
        
        if (gamesOfInterest.length > maxGames) {
          gamesOfInterest.shift();
        }
        if (futureGamesCount === maxGames / 2) {
          break;
        }
      }
      state.karpatData = gamesOfInterest;
    },
  },
  actions: {
    updateWeatherData({ commit }) {
      const apiUrl = "http://api.openweathermap.org/data/2.5/onecall";
      const params = {
        'appid': process.env.VUE_APP_WEATHER_API_KEY,
        'lat': 65.012011,
        'lon': 25.483423,
        'exclude': 'minutely,alerts',
        'units': 'metric',
      };

      return axios.get(apiUrl, {params}).then(res => {
        commit('updateWeatherData', res.data);
      }).catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
    },
    
    updateKoronaData({ commit }) {
      const apiUrl = "https://services7.arcgis.com/nuPvVz1HGGfa0Eh7/arcgis/rest/services/korona_tapauksia_ynteensa/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";
      return axios.get(apiUrl).then(res => {
        commit('updateKoronaData', res.data);
      }).catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
    },

    updateKarpatData({ commit }) {
      const curSeason = "2022";
      const apiUrl = "https://liiga.fi/api/v1/games?tournament=runkosarja&season=" + curSeason;

      return axios.get(apiUrl).then(res => {
        commit('updateKarpatData', res.data);
      }).catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
    },
  }
});
