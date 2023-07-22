const parseCsv = (csvString) => {
  const rows = csvString.split("\n");
  const headerRow = rows.shift().replaceAll('"', '').split(",");

  return rows.map((row) => {
    const rowObj = {};
    const rowEntries = row.replaceAll('"', '').split(",");
    for (let i = 0; i < headerRow.length; ++i) {
      rowObj[headerRow[i]] = rowEntries[i];
    }
    return rowObj;
  });
};

const compareStopObjects = (stopObj1, stopObj2) => {
  return stopObj1.arrival_time_obj - stopObj2.arrival_time_obj;
};

const serviceDateStringToDate = (dateString) => {
  // "20230809" to date object. used in serviceData
  const year = dateString.substr(0, 4);
  const month = dateString.substr(4, 2) - 1;
  const day = dateString.substr(6, 2);

  return new Date(year, month, day);
};

const arrivalDateStringToDate = (dateString) => {
  const dateObj = new Date();
  let [h, m, s] = dateString.split(':').map(Number);

  if (h > 23) {
    h -= 24;
    dateObj.setDate(dateObj.getDate() + 1);
  }

  dateObj.setHours(h, m, s, 0);
  return dateObj;
};

const serviceIsActive = (service_id, serviceData) => {
  // service_id, mon-sun, start, end
  // "TUOTANTO_ Kesä La 59","0","0","0","0","0","1","0","20230714","20230809"
  const relatedService = serviceData.find((service) => {
    return service.service_id === service_id;
  });
  if (!relatedService) {
    return true; // rather show ghost trip than remove actual trip
  }

  const startDate = serviceDateStringToDate(relatedService.start_date);
  const endDate = serviceDateStringToDate(relatedService.end_date);
  const now = new Date();

  if (startDate > now || now > endDate) {
    return false;
  }

  const weekDays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const curDay = weekDays[now.getDay()];
  return relatedService[curDay] === "1";
};


const incomingBusesForStop = (csvData, stopId) => {
  //csvData = [stops, trips, routes, services]

  const parsedStopData = parseCsv(csvData[0]);
  const parsedTripsData = parseCsv(csvData[1]);
  const parsedRoutesData = parseCsv(csvData[2]);
  const parsedServiceData = parseCsv(csvData[3]);

  const busDatas = [];

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  const interestingStopTimes = parsedStopData.filter((stopData) => {
    return stopData.stop_id === stopId;
  });

  interestingStopTimes.forEach((stopTime) => {
    stopTime.arrival_time_obj = arrivalDateStringToDate(stopTime.arrival_time);
  });

  interestingStopTimes.sort(compareStopObjects);


  for (let i = 0; i < interestingStopTimes.length; ++i) {
    const stopTime = interestingStopTimes[i];
    const tripObj = parsedTripsData.find((tripData) => {
      return tripData.trip_id === stopTime.trip_id;
    });

    if (!serviceIsActive(tripObj.service_id, parsedServiceData)) {
      continue;
    }

    const routeName = parsedRoutesData.find((routeData) => {
      return routeData.route_id === tripObj.route_id;
    }).route_short_name;

    const busData = {
      routeName,
      arrivalTime: stopTime.arrival_time_obj,
      routeId: tripObj.route_id,
      tripId: stopTime.trip_id,
      serviceId: tripObj.service_id,
    };
    busDatas.push(busData);
  }
  return busDatas;
};

const getNextTrips = (busData, liveData, maxCount) => {
  const nextTrips = [];
  const now = new Date();
  for (let i = 0; i < busData.incomingBuses.length; ++i) {
    if (nextTrips.length === maxCount) {
      break;
    }
    const arrivalTime = busData.incomingBuses[i].arrivalTime;
    if (now > arrivalTime) {
      continue;
    }
    const updatedStopData = updateArrivalTime(
      busData.incomingBuses[i],
      liveData,
      busData.selectedStopId,
    )
    nextTrips.push(updatedStopData);
  }

  return nextTrips;
};


const updateArrivalTime = (trip, liveData, selectedStopId) => {
  liveData.tripsFeed.entity.forEach((e) => {
    if (trip.tripId === e.tripUpdate.trip.tripId) {
      const relevantStopTimeUpdate = e.tripUpdate.stopTimeUpdate.find((s) => {
        return s.stopId === selectedStopId;
      });
      if (relevantStopTimeUpdate) {
        trip.arrivalTime = epochToDateObj(relevantStopTimeUpdate.arrival.time);
      }
    }
  });
  return trip;
};


const epochToDateObj = (epochString) => {
  return new Date(parseInt(epochString, 10) * 1000);
};


export {
  incomingBusesForStop,
  getNextTrips,
  epochToDateObj,
};