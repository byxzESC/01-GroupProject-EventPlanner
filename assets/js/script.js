
var citySearchForm = document.getElementById('city-search-input');
var genreOptions = d3.select('#genre-options');
var ticketInfo = d3.select('#ticketInfo')
var eventWeather;
var eventDate;
var currSearch = {};
var storeSearch = [];


function displayPreviousSearch() {
    
    storeSearch = JSON.parse(localStorage.getItem("searchObj"));

    if (storeSearch === null) {
        storeSearch = [];
    } else {
    
        d3.select('#history')
            .selectAll('button')
            .data(storeSearch)
            .enter()
            .append('button')
            .attr('class', 'pastCities')
            .attr('type','button')
            .each(function(d){
                d3.select(this)
            .attr('data-input', d.search)
            .attr('data-genre', d.genre)
            .attr('data-sdate', d.startDate)
            .attr('data-edate', d.endDate)
            .text(d.search)
            .classed('pastCities inline-block mx-1 my-2 px-6 py-2.5 bg-teal-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-teal-700', true)
            })
            d3.selectAll('.pastCities').on('click', function(evt){
                evt.preventDefault();
                d3.selectAll('.eCard').remove()
                pastCity = this.dataset.input
                pastGenre = this.dataset.genre
                pastStart = this.dataset.sdate
                pastEnd = this.dataset.edate

                eventSearch(pastCity, pastGenre, pastStart, pastEnd);
            })
    }
}
    
// fetch event data function accepting cityName as an argument
var eventSearch = function (city, genre, startDate, endDate) {
    var ticketMasterApiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?&city=' + city + '&classificationName=' + genre + '&startDateTime=' + startDate+ 'T00:00:01Z&endDateTime=' + endDate + 'T23:59:59Z&radius=50&apikey=9guoY8HVvZn5Dz76zhZz9omQCGJGNs7n';
    console.log(ticketMasterApiUrl)
    // fetch ticketmaster using cityName
    fetch(ticketMasterApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
               if (data._embedded && data._embedded.events && data._embedded.events.length > 0) {
                displayEvent(data._embedded.events, city)
                console.log('eventSearch result ', data)
               } else{
                openModal(city);
               }
            }) 
            
        }
    }).catch(function(error){
        console.error(error);
        openModal(city);
    });
}

// if selected city doesn't have any event this function will create a warning modal
function openModal(city) {
    //selecting the body of the HTML and appending a div with a warning class
    var htmlBody = d3.select('body')
        .append('div')
        .attr('class', 'warningModal modal fade fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm justify-center items-center flex w-1/8 h-1/8')
        .style('display', 'none');

    var content = htmlBody.append('div')
        .attr('class', 'justify-center items-center p-4 bg-white rounded-md')
    // Creates Modal header
    var header = content.append('div')
        .attr('class', ' justify-center items-center pb-4');
    header.append('h3')
        .attr('class', 'text-xl font-medium leading-normal text-black')
        .text('Warning');
    // Creates Modal body
    var body = content.append('div')
        .attr('class', 'text-black text-center')
        .text('Event type is unavailable in ' + city + '. Please pick a different event type.');
    // Creates Modal footer
    var footer = content.append('div')
        .attr('class', 'flex justify-end items-center p-4');
    // Appending a button to footer
    footer.append('button')
        .attr('class', 'px-6 py-2.5 bg-teal-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-teal-700')
        .text('OK')
    // When the OK button is clicked, the modal is set to be hidden again
        .on('click', function() {
            d3.select(".warningModal").style('display', 'none');
        });
// makes the modal visible
   d3.select(".warningModal").style('display', 'block')
}

//function displayEvent accepts data
function displayEvent (data, city) {
    // creates elements for event info
    d3.select('#ticketInfo')
    .selectAll('div')
    .data(data)
    .enter()
    .append('div')
    .attr('class', 'eCard')
    .attr('tabindex', '1')
    .each(function(d) {
        // "this" is the div element being created on line 107
        // "d" is each variable in data
        d3.select(this)
        .html(`<div class="card-body">
                <h5 class="card-title text-white h-16">${d.name}</h5>
                <p class="event-date" value='${d.dates.start.localDate}'>${d.dates.start.localDate}</p>
                <a href="${d.url}"><button class="inline-block px-2.5 py-1 bg-white font-medium text-teal-600 rounded hover:bg-teal-700">More Info</button></a>`)
        .selectChild()
        .insert('p')
        .text(function(dta) {
            if(dta.priceRanges){
                return "Price $" + dta.priceRanges[0].min + " - $" + dta.priceRanges[0].max;
            } else {
                return "Price ranges N/A";
            }
        });
    });

    // append elements to eCard "weatherInfo"
    d3.select('#ticketInfo').selectAll('.eCard').on('click', function(){
        //select all data-selected and set value to none
        d3.selectAll('.eCard').attr('data-selected', 'none')
        d3.selectAll('#weather-info').remove();
        eventDate = this.querySelector('.event-date').getAttribute('value')
        // assign a special attribute to --this--
        // and later could use it to select this particular element to append weather info to
        d3.select(this).attr('data-selected', 'focused');

        // fetch weather data
        callWeather(eventDate, city)
     });
}

// fetch weather data after user selected an event
function callWeather(date, city){
    var weatherApiUrl = 'https://api.weatherapi.com/v1/future.json?key=4e031b93d3c141019f0220405231401&q=' + city + '&dt=' + date;

    fetch(weatherApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                eventWeather = data.forecast.forecastday;
                displayWeather(eventWeather);
            })
        }
    })
}

//function displayWeather accepts weatherData
function displayWeather (weatherData) {

    console.log('date is', eventDate);
    console.log('this is weather data ', weatherData)

    var cardEl = document.querySelector('[data-selected=focused]');
    var weatherForecast = document.createElement('p');
    var TemperatureEl = document.createElement('p');
    var conditionEl = document.createElement('p');
    var windEL = document.createElement('p');
    var conditionIconEl = document.createElement('img');
    var iconUrl = "https:" +weatherData[0].hour[3].condition.icon;

    // console.log("this is icoon: ", iconUrl)
    weatherForecast.setAttribute('id', 'weather-info');
    TemperatureEl.textContent = `Temp: ${weatherData[0].day.avgtemp_f}°F`;
    conditionEl.textContent = weatherData[0].hour[3].condition.text;
    windEL.textContent = `Wind: ${weatherData[0].day.maxwind_mph}mph`;
    conditionIconEl.setAttribute('src', iconUrl);
    console.log(conditionIconEl);
    
    weatherForecast.append(TemperatureEl);
    weatherForecast.append(windEL);
    weatherForecast.append(conditionEl);
    weatherForecast.append(conditionIconEl);
    cardEl.append(weatherForecast);

}


//event listener on search submit of cityName
d3.select('#search-submit-button').on('click', function (event) {
    event.preventDefault();
    // remove previous search results
    d3.selectAll('.eCard').remove()

    // these var gets declare and assign to variables every time --- base on user input
    var city = citySearchForm.value;
    console.log(citySearchForm)
    var genre = genreOptions.nodes()[0].value
    console.log(genre)
    var startDate = d3.select('#startDate').nodes()[0].value
    var endDate = d3.select('#endDate').nodes()[0].value
    console.log(startDate, endDate)
    // check if city and date input are empty
     if (!city || !startDate || !endDate) { 
        d3.select("#staticBackdrop").classed("visible", true).classed("hidden", false);
        console.log("need city name, start date, end date");
    } else {
        //Storing search in local storage
        currSearch = {search: city, genre, startDate, endDate};
        storeSearch.push(currSearch);
        localStorage.setItem('searchObj', JSON.stringify(storeSearch));
        displayPreviousSearch();
        eventSearch(city, genre, startDate, endDate);
    }
    citySearchForm.value = "";
})

d3.select('#understood').on('click', function (event) {
    event.preventDefault();
    // remove previous search results
    d3.selectAll('#staticBackdrop').classed("hidden", true);
});


displayPreviousSearch();
