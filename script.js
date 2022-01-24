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

const whereAmI = function (lat, lng) {
  console.log(lat, lng);
  fetch(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=152395983122352e15965452x23073`
  )
    .then(response => {
      if (!response.ok) throw new Error(`Not working :(`);
      return response.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);
      getCountryAndNeighbour(data.country);
    })
    .catch(err => {
      console.log(err);
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

btn.addEventListener('click', function () {
  // getCountryAndNeighbour('philippines');

  whereAmI(52.508, 13.381);
  whereAmI(19.037, 72.873);
  whereAmI(-33.933, 18.474);
});
