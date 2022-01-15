'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const getCountryData = function (countryName) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${countryName}`);
  request.send();

  request.addEventListener('load', function () {
    // convert JSON to Object
    const [data] = JSON.parse(this.responseText);
    const currency_key = Object.keys(data.currencies)[0];
    const currency = data.currencies[currency_key].name;
    const arrNum = Object.keys(data.languages).length > 1 ? 1 : 0;
    const language_key = Object.keys(data.languages)[arrNum];
    const language = data.languages[language_key];

    console.log(data);
    console.log(language);

    const html = `
        <article class="country">
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
  });
};

getCountryData('Philippines');
getCountryData('usa');
getCountryData('portugal');
