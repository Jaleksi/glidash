<template>
  <div id="karpatContainer">
  </div>
</template>


<script>

export default {
  name: 'Karpat',
  data() {
    return {
      teamIcons: {
        "kärpät": "https://old.liiga.fi/media/team-logos/SM-Liiga-Logot_0012_Karpat_AGDUuMu.png",
        "hifk": "https://old.liiga.fi/media/team-logos/SM-Liiga-Logot_0004_HIFK_1.png",
        "ilves": "https://old.liiga.fi/media/team-logos/500x500px-ilves.png",
        "tappara": "https://old.liiga.fi/media/team-logos/SM-Liiga-Logot_0011_Tappara_2.png",
        "pelicans": "https://old.liiga.fi/media/team-logos/logo-pelicans-500x500px.png",
        "jukurit": "https://old.liiga.fi/media/team-logos/jukurit-500x500px.png",
        "tps": "https://old.liiga.fi/media/team-logos/TPS.png",
        "kookoo": "https://old.liiga.fi/media/team-logos/kookoo-musta-oranssi-500x500px.png",
        "lukko": "https://old.liiga.fi/media/team-logos/SM-Liiga-Logot_0013_Lukko.png",
        "hpk": "https://old.liiga.fi/media/team-logos/SM-Liiga-Logot_0000_HPK_1.png",
        "kalpa": "https://old.liiga.fi/media/team-logos/SM-Liiga-Logot_0010_Kalpa_1.png",
        "sport": "https://old.liiga.fi/media/team-logos/SM-Liiga-Logot_0008_Sport.png",
        "saipa": "https://old.liiga.fi/media/team-logos/SaiPa-logo-2021.png",
        "ässät": "https://old.liiga.fi/media/team-logos/SM-Liiga-Logot_0002_Assat_1_1.png.600x600_q85_OpT2DhQ.png",
        "jyp": "https://old.liiga.fi/media/team-logos/SM-Liiga-Logot_0005_Jyp_1.png",
      },
    }
  },
  mounted() {
    this.draw();
  },

  methods: {
    clear() {
      const karpatGrid = document.getElementById("karpatContainer");
      [...karpatGrid.childNodes].forEach((child) => {
        karpatGrid.removeChild(child);
      });
    },

    draw() {
      this.clear();
      const karpatGrid = document.getElementById("karpatContainer");
      const yellowGrd = "linear-gradient(to right, rgba(128, 128, 0, 1), rgba(255, 255, 0, 0.1)";
      const blackGrd = "linear-gradient(to right, rgba(50, 50, 50, 1), rgba(0, 0, 0, 0.1)";

      this.karpatData.forEach((game, i) => {
        const rowContainer = document.createElement("div");
        rowContainer.className = "rowContainer";
        rowContainer.style.background = i % 2 === 0 ? yellowGrd : blackGrd;

        const homeIcon = document.createElement("img");
        const homeIconDiv = document.createElement("div");
        const dividerDiv = document.createElement("div");
        const awayIconDiv = document.createElement("div");
        const awayIcon = document.createElement("img");
        const dateDiv = document.createElement("div");
        const resultDiv = document.createElement("div");

        homeIcon.src = this.teamIcons[game.homeTeam.teamId.split(":")[1]];
        homeIconDiv.className = "teamIconWrapper";
        awayIcon.src = this.teamIcons[game.awayTeam.teamId.split(":")[1]];
        awayIconDiv.className = "teamIconWrapper";
        const startDate = new Date(game.start);
        dividerDiv.innerHTML = "-";
        dateDiv.innerHTML = `${startDate.getDate()}.${startDate.getMonth() + 1}.`;
        resultDiv.innerHTML = game.started
          ? game.homeTeam.goals + "-" + game.awayTeam.goals
          : `${startDate.getHours()}:${String(startDate.getMinutes()).padStart(2, "0")}`;

        dividerDiv.style.gridArea = "1 / 2";
        dateDiv.style.gridArea = "1 / 4";
        resultDiv.style.gridArea = "1 / 5";
        homeIconDiv.style.gridArea = "1 / 1";
        awayIconDiv.style.gridArea = "1 / 3";

        homeIconDiv.appendChild(homeIcon);
        awayIconDiv.appendChild(awayIcon);

        rowContainer.appendChild(dividerDiv);
        rowContainer.appendChild(dateDiv);
        rowContainer.appendChild(resultDiv);
        rowContainer.appendChild(homeIconDiv);
        rowContainer.appendChild(awayIconDiv);

        rowContainer.style.gridArea = (i + 1) + " / 1";
        karpatGrid.appendChild(rowContainer);
      });
    },
  },
  computed: {
    karpatData() {
      return this.$store.state.karpatData;
    },
  },
  watch: {
    karpatData(newData, oldData) {
      this.draw();
    },
  },
}

</script>



<style>
  #karpatContainer {
    display: grid;
    grid-template-rows: repeat(8, 1fr);
    grid-template-columns: 1fr;
    align-items: center;
    text-align: center;
    margin: 0.5em;
  }

  .rowContainer {
    color: #FFEAD2;
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 0.5fr 0.5fr 0.5fr 1fr 0.8fr;
    margin: 0;
    height: 100%;
    align-items: center;
  }

  .teamIconWrapper {
    width: auto;
    height: 80%;
    display: flex;
    justify-content: center;
  }
</style>
