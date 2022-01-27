'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

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
  // countriesContainer.style.opacity = 1;
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
  getJSON(
    `https://restcountries.com/v3.1/name/${countryName}`,
    'Country not found'
  )
    .then(data => {
      renderCountry(data[0]);
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

btn.addEventListener('click', whereAmI);
// getCountryAndNeighbour('philippines');
// getCountryAndNeighbour('usa');
// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);
// getPosition().then(pos => console.log(pos));
// });

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
