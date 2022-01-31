'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
let dataStorage = [];

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

const renderCountry = function (data, className = '') {
  const currency_key = Object.keys(data.currencies)[0];
  const currency = data.currencies[currency_key].name;
  const arrNum = Object.keys(data.languages).length > 1 ? 1 : 0;
  const language_key = Object.keys(data.languages)[arrNum];
  const language = data.languages[language_key];

  const html = `
        <article class="country ${className}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1_000_000
        ).toFixed(1)}</p>
            <p class="country__row"><span>🗣️</span>${language}</p>
            <p class="country__row"><span>💰</span>${currency}</p>
            </div>
            </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};
/*
const whereAmI = function (lat, lng) {
  fetch(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=152395983122352e15965452x23073`
  )
    .then(response => {
      if (!response.ok)
        throw new Error(`Problem with Geocoding ${response.status} :(`);
      return response.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);

      getCountryAndNeighbour(data.country);
      return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);
      return res.json();
    })
    .catch(err => {
      console.log(`${err.message}`);
    });
};
*/
// Getting the current Location
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
    /*
    // ALTERNATIVE resolve , reject
    navigator.geolocation.getCurrentPosition(
      position => resolve(position),
      err => reject(err)
    );
    */
  });
};

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

const getCountryAndNeighbour = function (countryName) {
  // get Country 1
  getJSON(`https://restcountries.com/v3.1/name/${countryName}`)
    .then(data => {
      renderCountry(data);
      const neighbour = data[0].borders;

      if (!neighbour) throw new Error('No neighbour found!');

      // get Country 2
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour[0]}`,
        'Country not found'
      );
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.error(err);
      renderError('Something wend wrong. ' + err.message + ' Try again!');
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};
getLocalStorage();

//////////////////////CONSUMING PROMISES WITH ASYNC AWAIT/////////////////////////
const whereAmI2 = async function () {
  try {
    // Geolocatio
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse Geocoding
    const resGeo = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json&auth=152395983122352e15965452x23073`
    );
    if (!resGeo.ok) throw new Error('Problem getting location data ');
    const dataGeo = await resGeo.json();

    dataStorage.push(dataGeo);
    setLocalStorage();
    console.log(dataStorage);

    // Country Data
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}`
    );
    if (!res.ok) throw new Error('Problem getting location data ');
    const data = await res.json();
    // console.log(data[0]);

    renderCountry(data[0]);

    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    renderError(`Something went wrong :( ${err.message})`);

    throw err;
  }
};

function setLocalStorage() {
  // Set to Local Storage
  localStorage.setItem('locations', JSON.stringify(dataStorage));
}

function getLocalStorage() {
  // Get local storage and print to console
  const getData = JSON.parse(localStorage.getItem('locations'));
  console.log(getData);

  // If there's no data. simply return
  if (!getData) return;

  // restores the data
  dataStorage = getData;

  dataStorage.forEach(ds => {
    console.log(ds);
  });
}

btn.addEventListener('click', whereAmI2);
// getCountryAndNeighbour('philippines');
// getCountryAndNeighbour('usa');
// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);
// getPosition().then(pos => console.log(pos));

/*
const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      console.log(pos.coords, lat, lng);

      return fetch(
        `https://geocode.xyz/${lat},${lng}?geoit=json&auth=152395983122352e15965452x23073`
      );
    })
    .then(response => {
      if (!response.ok)
        throw new Error(`Problem with Geocoding ${response.status} :(`);
      return response.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);

      getCountryAndNeighbour(data.country);
      return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);
      return res.json();
    })
    .catch(err => {
      console.log(`${err.message}`);
    });
};
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////THE EVENT LOOP PRACTICE//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
console.log('Test Start');
//timer will only start after all other callbacks are done
setTimeout(() => console.log('0 sec timer', 0));
Promise.resolve('Resolved promise 1').then(res => console.log(res));

Promise.resolve('Resolved promise 2').then(res => {
  for (let i = 0; i < 1000000000; i++) {}
  console.log(res);
});

console.log('Test end');
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////////BUILDING A SIMPLE PROMISE//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('Lottery Draw is Happening');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You WIN');
    } else {
      reject(new Error('You lost your money'));
    }
  }, 2000);
});

lotteryPromise.then(res => console.log(res)).catch(err => console.log(err));

// PROMISIFYING setTimeout
const wait = function (seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(2)
  .then(() => {
    console.log('I waited for 2 seconds');
    return wait(1);
  })
  .then(() => console.log('I waited for 1 second'));
*/

/*
// Using IIFE async await
(async function () {
  try {
    console.log('1: Will get location');
    const city = await whereAmI2();
    console.log(city);
  } catch (err) {
    console.log(err);
  } 
    console.log('3: Finished Getting Location');
})();
*/

/*
const get3Countrues = async function (c1, c2, c3) {
  try {
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);

    // DATA WILL LOAD AT THE SAME TIME
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);
    console.log(data.map(d => d[0].capital));
  } catch (err) {
    console.error(err);
  }
};
get3Countrues('portugal', 'canada', 'philippines');
*/

// Promise.race - returns the fastest promise loaded
/*
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/italy`),
    getJSON(`https://restcountries.com/v3.1/name/egypt`),
    getJSON(`https://restcountries.com/v3.1/name/mexico`),
  ]);
  console.log(res[0]);
})();

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request took too long!'));
    }, sec * 1000);
  });
};

Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/philippines`),
  timeout(5),
])
  .then(res => console.log(res[0]))
  .catch(err => console.error(err));

// Promise.allSettled - return all the results of all Promises
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another Success'),
]).then(res => console.log(res));

// Will short circute if there is one error.
Promise.all([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another Success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));

// Promise.any - return the first fullfilled Promise. Ignore rejected promises
Promise.any([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another Success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));
*/
