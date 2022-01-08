<template>
  <div id="koronaContainer">
    <div id="koronaHeader">Korona<br>(edelliset 2vk)</div>
    <div id="kokoSuomiTartunnat">Tartunnat<br>(koko Suomi)</div>
    <div id="kokoSuomiIlmaantuvuus">Ilmaantuvuus<br>(koko Suomi)</div>
    <div id="ouluTartunnat">Tartunnat<br>(PPSHP)</div>
    <div id="ouluIlmaantuvuus">Ilmaantuvuus<br>(PPSHP)</div>
  </div>
</template>


<script>

export default {
  name: 'Korona',
  data() {
    return {
    }
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      const dataEntries = [
        this.koronaData.suomi.tapaukset,
        this.koronaData.suomi.ilmaantuvuus,
        this.koronaData.oulu.tapaukset,
        this.koronaData.oulu.ilmaantuvuus,
      ];
      const coronaGrid = document.getElementById("koronaContainer");

      dataEntries.forEach((entry, i) => {
        const dataDiv = document.createElement("div");
        dataDiv.class = "koronaDataEntry";
        dataDiv.style.gridArea = (i + 2) + " / 2";
        dataDiv.innerHTML = Math.floor(entry);
        coronaGrid.appendChild(dataDiv);
      });
    },
  },
  computed: {
    koronaData() {
      return this.$store.state.koronaData;
    },
  },
  watch: {
    koronaData(newData, oldData) {
      this.draw();
    },
  },
}
</script>

<style>
  #koronaContainer {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    background: linear-gradient(#b4dbff, #58aeff);
    border-radius: 10px;
    font-size: 0.9em;
  }

  #koronaHeader {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    font-weight: bold;
  }

  #kokoSuomiTartunnat {
    grid-column-start: 1;
    grid-row-start: 2;
  }

  #kokoSuomiIlmaantuvuus {
    grid-column-start: 1;
    grid-row-start: 3;
  }

  #ouluTartunnat {
    grid-column-start: 1;
    grid-row-start: 4;
  }

  #ouluIlmaantuvuus {
    grid-column-start: 1;
    grid-row-start: 5;
  }


</style>
