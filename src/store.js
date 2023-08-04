import {
  createStore
} from 'vuex';
import axios from 'axios';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import JSZip from 'jszip';
import {
  incomingBusesForStop,
  getNextTrips,
} from './gtfs_utils';


export const store = createStore({
  state: {
    weatherData: null,
    karpatData: null,
    koronaData: null,
    bussesLiveData: null,
    bussesStaticData: null,
    busStaticDataFetchedForThisDay: false,
  },
  mutations: {
    setBusDataFetchedForThisDay(state, value) {
      state.busStaticDataFetchedForThisDay = value;
    },

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

    updateBussesLiveData(state, busLiveData) {
      // https://opendata.waltti.fi/docs
      // busLiveData = {
      //   tripsFeed,
      //   posFeed,
      //   alertFeed
      // }

      // get next 8 incoming buses data
      const tripsToDisplay = getNextTrips(
        state.bussesStaticData,
        busLiveData,
        8
      );
      state.bussesLiveData = tripsToDisplay;
    },

    updateBussesStaticData(state, staticContents) {
      const selectedStopId = "310718";
      const selectedStopName = "Liikkujantie P";

      state.bussesStaticData = {
        selectedStopName,
        selectedStopId,
        incomingBuses: incomingBusesForStop(staticContents, selectedStopId),
      };
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
    updateWeatherData({
      commit
    }) {
      const apiUrl = "https://api.openweathermap.org/data/2.5/onecall";
      const params = {
        'appid': process.env.VUE_APP_WEATHER_API_KEY,
        'lat': 65.012011,
        'lon': 25.483423,
        'exclude': 'minutely,alerts',
        'units': 'metric',
      };

      return axios.get(apiUrl, {
        params
      }).then(res => {
        commit('updateWeatherData', res.data);
      }).catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
    },

    updateKoronaData({
      commit
    }) {
      const apiUrl = "https://services7.arcgis.com/nuPvVz1HGGfa0Eh7/arcgis/rest/services/korona_tapauksia_ynteensa/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json";
      return axios.get(apiUrl).then(res => {
        commit('updateKoronaData', res.data);
      }).catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
    },

    async updateBussesLiveData({
      commit,
      state,
      dispatch
    }) {
      const curHour = new Date().getHours();
      if (
        state.bussesStaticData === null ||
        (!state.busStaticDataFetchedForThisDay &&
          curHour === 2
        )
      ) {
        await dispatch('updateBussesStaticData');
      }
      return axios.all([
        axios.get("https://data.waltti.fi/oulu/api/gtfsrealtime/v1.0/feed/tripupdate", {
          auth: {
            username: process.env.VUE_APP_WALTTI_ID,
            password: process.env.VUE_APP_WALTTI_SECRET
          },
          responseEncoding: null,
          responseType: "arraybuffer",
        }),
        axios.get("https://data.waltti.fi/oulu/api/gtfsrealtime/v1.0/feed/vehicleposition", {
          auth: {
            username: process.env.VUE_APP_WALTTI_ID,
            password: process.env.VUE_APP_WALTTI_SECRET
          },
          responseEncoding: null,
          responseType: "arraybuffer",
        }),
        axios.get("https://data.waltti.fi/oulu/api/gtfsrealtime/v1.0/feed/servicealert", {
          auth: {
            username: process.env.VUE_APP_WALTTI_ID,
            password: process.env.VUE_APP_WALTTI_SECRET
          },
          responseEncoding: null,
          responseType: "arraybuffer",
        }),
      ]).then(axios.spread((tripsResponse, vehiclePosResponse, alertResponse) => {
        const tripsFeed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
          new Uint8Array(tripsResponse.data)
        );
        const posFeed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
          new Uint8Array(vehiclePosResponse.data)
        );
        const alertFeed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
          new Uint8Array(alertResponse.data)
        );
        commit('updateBussesLiveData', {
          tripsFeed,
          posFeed,
          alertFeed,
        });
      })).catch((err) => {
        console.log(err);
        return Promise.reject(err);
      });
    },

    updateBussesStaticData({
      commit
    }) {
      const apiUrl = "https://tvv.fra1.digitaloceanspaces.com/229.zip";
      return axios.get(process.env.VUE_APP_CORS_PROXY_PREFIX + apiUrl, {
        responseType: "blob",
      }).then(res => {
        const zipper = new JSZip();
        return zipper.loadAsync(res.data);
      }).then((zip) => {
        const filenames = [
          "stop_times.txt",
          "trips.txt",
          "routes.txt",
          "calendar.txt",
        ];
        const filePromises = filenames.map((filename) => {
          return zip.file(filename).async("string");
        });
        return Promise.all(filePromises);
      }).then((fileContents) => {
        commit('updateBussesStaticData', fileContents);
      }).catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
    },


    updateKarpatData({
      commit
    }) {
      const curSeason = "2023";
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