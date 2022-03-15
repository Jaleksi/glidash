const drawHourlyGraph = (ctx, centerX, centerY, r, hourlyTemps) => {
  const vmax = Math.max(...hourlyTemps);
  const vmin = Math.min(...hourlyTemps);

  const scaleBetweenRange = (v) => {
    return r - (v - vmin) / (vmax - vmin) * r;
  };

  // Create circle for "clipping"
  ctx.beginPath();
  ctx.arc(centerX, centerY, r, 0, 2 * Math.PI, false);
  ctx.fill();

  // source-in to clip parts which are outside of circle off
  ctx.globalCompositeOperation = "source-in";
  ctx.beginPath();

  // draw actual graph
  hourlyTemps.forEach((tempValue, i) => {
    const x = centerX * 0.1 + (r * 2 / (hourlyTemps.length - 1) * i);
    const nx = centerX * 0.1 + (r * 2 / (hourlyTemps.length - 1) * (i + 1));
    const y = scaleBetweenRange(tempValue) + centerY;
    const ny = scaleBetweenRange(hourlyTemps[i + 1]) + centerY;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      const dx = (x + nx) / 2;
      const dy = (y + ny) / 2;
      ctx.quadraticCurveTo(x, y, dx, dy);
    }
  });

  // extra points to make sure there are no gaps in circle
  ctx.lineTo(centerX + r, centerY + r);
  ctx.lineTo(0, centerY + r);
  ctx.closePath();

  const grd = ctx.createLinearGradient(0, centerY + r, 0, centerY);
  grd.addColorStop(0, "#55ADFF");
  grd.addColorStop(1, "#cee8ff");
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
};


const drawSunGraph = (ctx, cx, cy, r, dt, sunrise, sunset) => {
  const nightColor = "#293241";
  const dayColor = "#55ADFF";
  const gradientSize = 0.0175;
  const dayTime = 86400;
  const sunTimePercentage = (sunset - sunrise) / dayTime;

  // draw surrounding circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);

  // gradient to show day/night
  const grd = ctx.createConicGradient(0, cx, cy);
  const sunrisePercentage = 1 - sunTimePercentage / 2;
  const sunsetPercentage = sunTimePercentage / 2;
  grd.addColorStop(sunsetPercentage - gradientSize, dayColor); 
  grd.addColorStop(sunsetPercentage + gradientSize, nightColor);
  grd.addColorStop(sunrisePercentage - gradientSize, nightColor);
  grd.addColorStop(sunrisePercentage + gradientSize, dayColor);
  
  ctx.strokeStyle = grd;
  ctx.lineWidth = 5;
  ctx.stroke();

  // draw circling sun
  const curSunPercentage = (dt - sunrise) / dayTime;
  const theta =
    (-Math.PI * 0.5) - (Math.PI * 2 * -sunrisePercentage) + (Math.PI * 2 * curSunPercentage);
  const sunX = cx + r * Math.cos(theta);
  const sunY = cy + r * Math.sin(theta);
  ctx.beginPath();
  ctx.arc(sunX, sunY, 10, 0, Math.PI * 2);
  ctx.fillStyle = dayColor;
  ctx.fill();
};

const drawTemperatureGraph = (ctx, canvas, temps) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = canvas.width / 2;
  const blockHeight = canvas.height / temps.length;
  const vminmin = Math.min(...temps.map(t => t.min));
  const vminmax = Math.max(...temps.map(t => t.min));
  const vmaxmin = Math.min(...temps.map(t => t.max));
  const vmaxmax = Math.max(...temps.map(t => t.max));
  const scaleToCanvasWidth = (v, vmax, vmin) => {
    return cx - (v - vmin) / (vmax - vmin) * cx;
  };

  ctx.beginPath();

  // draw min lines
  const minValues = temps.map(t => t.min);
  minValues.forEach((minValue, i) => {
    const x = cx - scaleToCanvasWidth(minValue, vminmax, vminmin);
    const y = blockHeight * 0.5 + blockHeight * i;
    const nx = cx - scaleToCanvasWidth(minValues[i + 1], vminmax, vminmin);
    const ny = blockHeight * 0.5 + blockHeight * (i + 1);

    if (i === 0) {
      ctx.moveTo(x, blockHeight * 0.2);
    } else if (i === minValues.length - 1) {
      ctx.lineTo(x, canvas.height - blockHeight * 0.33);
    } else {
      const dx = (x + nx) / 2;
      const dy = (y + ny) / 2;
      ctx.quadraticCurveTo(x, y, dx, dy);
    }
  });
  
  
  // draw max lines
  const maxValuesReversed = temps.map(t => t.max).reverse();
  maxValuesReversed.forEach((maxValue, i) => {
    const x = cx + scaleToCanvasWidth(maxValue, vmaxmin, vmaxmax);
    const y = (blockHeight * temps.length - blockHeight / 2) - blockHeight * i;
    const nx = cx + scaleToCanvasWidth(maxValuesReversed[i + 1], vmaxmin, vmaxmax);
    const ny = (blockHeight * temps.length - blockHeight / 2) - blockHeight * (i + 1);
    if (i === 0) {
      ctx.lineTo(x, canvas.height - blockHeight * 0.33);
    } else if (i === maxValuesReversed.length - 1) {
      ctx.lineTo(x, blockHeight * 0.2);
    } else {
      const dx = (x + nx) / 2;
      const dy = (y + ny) / 2;
      ctx.quadraticCurveTo(x, y, dx, dy);
    }
  });
  
  ctx.closePath();

  const grd = ctx.createLinearGradient(0, canvas.height / 2, canvas.width, canvas.height / 2);
  grd.addColorStop(0, "#55ADFF"); // min color
  grd.addColorStop(1, "#ef476f"); // max color
  ctx.fillStyle = grd;
  
  ctx.fill();
};

export {
  drawHourlyGraph,
  drawSunGraph,
  drawTemperatureGraph,
};
