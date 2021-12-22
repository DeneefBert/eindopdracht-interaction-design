let daySelect, graph, canvas, graphcolour, linecolour, night;
let weatherData = [];
let labels = [];
let svg_night = `<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
class="c-night"
>
<path
  d="M12,3a9,9,0,1,0,9,9,10.122,10.122,0,0,0-.1-1.36A5.4,5.4,0,1,1,13.36,3.1,10.122,10.122,0,0,0,12,3Z"
/>
</svg>`;
let svg_day = ` <svg
class="c-sun"
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 22 22"
>
<path
  d="M17,11c0,3.3-2.7,6-6,6s-6-2.7-6-6s2.7-6,6-6S17,7.7,17,11z M11.5,0h-1v3h1V0z M3.6,2.9L2.9,3.6L5,5.7L5.7,5L3.6,2.9zM0,10.5l0,1h3v-1H0z M2.9,18.4l0.7,0.7L5.7,17L5,16.3L2.9,18.4z M10.5,22h1v-3h-1V22z M18.4,19.1l0.7-0.7L17,16.3L16.3,17L18.4,19.1z M22,11.5v-1h-3v1H22z M19.1,3.6l-0.7-0.7L16.3,5L17,5.7L19.1,3.6z"
/>
</svg>`;

const toggleNight = function () {
  let page = document.querySelector(".js-page");
  if (night) {
    setMotD();
    drawChart(weatherData, labels);
    document.querySelector(".js-button").innerHTML = svg_night;
  } else {
    page.setAttribute("class", "js-page is-night");
    graphcolour = "hsla(238, 90%, 70%, 1)";
    linecolour = "hsla(238, 90%, 70%, 0.1)";
    drawChart(weatherData, labels);
    night = true;
    document.querySelector(".js-button").innerHTML = svg_day;
  }
};

const drawChart = (weatherD, labels) => {
  let ctx = graph.getContext("2d");

  // let chart = new Chart(ctx, {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Temperature in °C",
          data: weatherD,
          borderColor: graphcolour,
          backgroundColor: "#A3A0FB00",
          pointBackgroundColor: "white",
          lineTension: 0.3,
          borderWidth: 2,
          pointRadius: 4,
        },
      ],
    },
    options: {
      defaultFontColor: (Chart.defaults.global.defaultFontColor = graphcolour),

      tooltips: {
        xPadding: 10,
        yPadding: 10,
        cornerRadius: 0,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: linecolour,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              color: linecolour,
            },
          },
        ],
      },
      legend: {
        position: "bottom",
        align: "start",
        labels: {
          defaultFontFamily: (Chart.defaults.global.defaultFontFamily =
            "'Source Sans Pro', 'Helvetica', 'arial', 'sans-serif'"),
          boxWidth: 2,
        },
      },
      responsive: true,
    },
  });
  // document.querySelector('.js-chartjsLegend').innerHTML = chart.generateLegend();
};

const getData = (json) => {
  let data = [];

  json.map((day) => {
    data.push(day.aantalBezoekers);
  });

  drawChart(data);
};

const loadWeather = async () => {
  const ENDPOINT = `https://api.openweathermap.org/data/2.5/forecast?q=Gullegem&appid=65749a1a6f21ba66a6b21de3506c218b`;

  const request = await fetch(`${ENDPOINT}`);
  const data = await request.json();
  console.log(data);
  currentTemp = Math.round((data.list[0].main.temp - 273.15) * 100) / 100;
  console.log(currentTemp);
  for (var i = 0; i < 40; i += 1) {
    var temp = new Date(data.list[i].dt * 1000);
    weatherData.push(Math.round((data.list[i].main.temp - 273.15) * 100) / 100);
    labels.push(`${temp.toLocaleString("en-GB", { weekday: "short" })}`);
  }
  console.log(weatherData);
  setMotD();
  drawChart(weatherData, labels);
};
let setMotD = function () {
  let motd = document.querySelector(".js-motd");
  let temp = document.querySelector(".js-temp");
  let background = document.querySelector(".js-page");
  if (currentTemp < -10) {
    motd.innerHTML = "So cold the USSR anthem starts playing spontaneously";
    background.setAttribute("class", "is-freezing js-page");
    graphcolour = "hsla(200,20%,20%,1)";
    linecolour = "hsla(200,20%,20%,0.1)";
  } else if (currentTemp < 0) {
    motd.innerHTML = "It's freezing, dress warm and be careful of slipping";
    background.setAttribute("class", "is-cold js-page");
    graphcolour = "hsla(187,20%,20%,1)";
    linecolour = "hsla(187,20%,20%,0.1)";
  } else if (currentTemp < 10) {
    motd.innerHTML = "It is quite cold, put on a warm coat";
    background.setAttribute("class", "is-chilly js-page");
    graphcolour = "hsla(162,20%,30%,1)";
    linecolour = "hsla(162,20%,30%,0.1)";
  } else if (currentTemp < 20) {
    motd.innerHTML = "Temperature is quite nice out";
    background.setAttribute("class", "is-nice js-page");
    graphcolour = "hsla(65,20%,20%,1)";
    linecolour = "hsla(65,20%,20%,0.1)";
  } else if (currentTemp < 30) {
    motd.innerHTML = "Pretty warm today, make sure to hydrate";
    background.setAttribute("class", "is-warm js-page");
    graphcolour = "hsla(48,30%,20%,1)";
    linecolour = "hsla(48,30%,20%,0.1)";
  } else {
    motd.innerHTML = "It is boiling hot, stay inside and hydrate";
    background.setAttribute("class", "is-hot js-page");
    graphcolour = "hsla(27,30%,15%,1)";
    linecolour = "hsla(27,30%,15%,0.1)";
  }
  temp.innerHTML = `It is currently ${currentTemp} degrees Celsius`;
  night = false;
};

const init = () => {
  graph = document.querySelector(".js-graph");
  canvas = document.querySelector(".js-graph");
  document.querySelector(".js-button").addEventListener("click", function () {
    toggleNight();
  });
  loadWeather();
};

document.addEventListener("DOMContentLoaded", function () {
  init();
});
