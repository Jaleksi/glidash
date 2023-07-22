<template>
  <div id="bussesContainer"></div>
</template>


<script>

export default {
  name: 'Busses',
  data() {
    return {
    };
  },
  mounted() {
    this.draw();
  },

  methods: {
    clear() {
      const bussesGrid = document.getElementById("bussesContainer");
      [...bussesGrid.childNodes].forEach((child) => {
        bussesGrid.removeChild(child);
      });
    },

    draw() {
      this.clear();
      const bussesGrid = document.getElementById("bussesContainer");
      const headerRow = document.createElement("div");
      headerRow.id = "gridHeader";
      headerRow.innerHTML = this.$store.state.bussesStaticData.selectedStopName;
      bussesGrid.appendChild(headerRow);

      const now = new Date();

      this.bussesLiveData.forEach((trip, i) => {
        const rowContainer = document.createElement("div");
        rowContainer.className = "busRowContainer";

        const routeNumDiv = document.createElement("div");
        const arrivalTimeDiv = document.createElement("div");
        const untilArrivalDiv = document.createElement("div");

        routeNumDiv.innerHTML = trip.routeName;

        const minutes = trip.arrivalTime.getMinutes().toString().padStart(2, "0");
        const timeString = `${trip.arrivalTime.getHours()}:${minutes}`;
        arrivalTimeDiv.innerHTML = timeString;

        const timeDelta = trip.arrivalTime - now;
        const deltaHours = Math.floor(timeDelta / 3600000);
        const deltaMinutes = Math.floor((timeDelta % 3600000) / 60000);
        const untilString = deltaHours > 0
          ? `${deltaHours}h ${deltaMinutes}min`
          : `${deltaMinutes}min`;
        untilArrivalDiv.innerHTML = untilString;
        untilArrivalDiv.style.textAlign = "right";
        untilArrivalDiv.style.marginRight = "1em";


        routeNumDiv.style.gridArea = "1 / 1";
        arrivalTimeDiv.style.gridArea = "1 / 2";
        untilArrivalDiv.style.gridArea = "1 / 3";
        
        rowContainer.appendChild(routeNumDiv);
        rowContainer.appendChild(arrivalTimeDiv);
        rowContainer.appendChild(untilArrivalDiv);

        rowContainer.style.gridArea = (i + 2) + " / 1";
        bussesGrid.appendChild(rowContainer);
      });
    },
  },

  computed: {
    bussesLiveData() {
      return this.$store.state.bussesLiveData;
    },
  },
  watch: {
    bussesLiveData(newData, oldData) {
      this.draw();
    },
  },
}

</script>

<style>
  #bussesContainer {
    background: linear-gradient(#FFF4E0, #F6E1C3);
    border-radius: 10px;
    display: grid;
    grid-template-rows: repeat(9, 1fr);
    grid-template-columns: 1fr;
    align-items: center;
    text-align: center;
    margin: 0.5em;
  }

  .busRowContainer {
    background: linear-gradient(#FFF4E0, #F6E1C3);
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 0.6fr 1fr 1fr;
    margin: 0;
    height: 100%;
    align-items: center;
  }

  #gridHeader {
    display: grid;
    grid-area: 1 / 1;
    font-size: 1.2em;
  }
</style>
