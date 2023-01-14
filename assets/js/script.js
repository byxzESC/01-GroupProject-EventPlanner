// var searchBtn = d3.select('#modal-button');
// var citySearchForm = d3.select('#city-search-form');
var searchBtn = document.getElementById('search-submit-button');
var citySearchForm = document.getElementById('city-search-input');

// startDate
// EndDate

//variable for html elements
// use d3 to select elements from html
// var weatherInfo 
// var ticketInfo

//once submitted modal brings up local events and dates
//once selected weather is shown for local event
//function to submit city name and store it into local storage
// enter a city --- user input
    // fetch event data
        // get the date for the event
            // function fetchWeather
                    // display weather



//eventSearch function accepting cityName as an argument
var eventSearch = function (longitude, latitude) {
    console.log('event search args are ', longitude, latitude);
    // startDateTime < data < endDateTime 
    var ticketMasterApiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?latlong='+ latitude +',' + longitude + '&countryCode=US&apikey=9guoY8HVvZn5Dz76zhZz9omQCGJGNs7n'
    var openMeteoApiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=weathercode&timezone=auto'

    // fetch ticketmaster using cityName
        //call a function displayEvent passes data into it
    // fetch weather using the cityName
        //call a function displayWeather passes data into it
    fetch(ticketMasterApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayEvent(data._embedded.events);
            }) 
        }
    })
    
    fetch(openMeteoApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
            }) 
        }
    })
}

//function displayEvent accepts data
function displayEvent (data) {


    // creates element for event info
    d3.select('#ticketInfo')
    .selectAll('div')
    .data(data)
    .enter()
    .append('div')
    .attr('id', 'eCard')
    .classed('card, my-2, mx-4, bg-teal-600, text-white, border, border-black, border-solid, flex-1' , true)
    .each(function(d) {
        d3.select(this).html(
            `<div class="card-body">
                <h5 class="card-title">${d.name}</h5>
                <p class="event-date">${d.dates.start.localDate}</p>
                <button class="inline-block px-2.5 py-1 bg-white font-medium text-teal-600 rounded hover:bg-teal-700" href="${d.url}">More Info</button>
        `)
    .selectChild().insert('p')
    .text(function(dta) {
         if(dta.priceRanges){
         return "Min: $" + dta.priceRanges[0].min + " Max: $" + dta.priceRanges[0].max
    } else {
      return "N/A"}
    })
    });
    // append elements to weatherInfo

}

//function displayWeather accepts data
var displayWeather = function (data) {
// --- displays weather --- location, date, temp, condition, condition icon, wind

}


//event listener on search submit of cityName
// d3.select('#modal-button').on('click', async function (event) {
    d3.select('#search-submit-button')
    .on('click', async function (event) {
    event.preventDefault();
    // value that user enter
    // var city = d3.select('#city-search-form').values;
    // console.log(d3.select('#city-search-form').value())
    var city = citySearchForm.value;
    console.log(city);
    

    // check if city input is empty
    if (!city) {

        console.log("need city name")
    } else {
        // get the longitude and latitude of the input city
        var openCageApiUrl =  'https://api.opencagedata.com/geocode/v1/json?q=' + city + '&current_weather=true&key=5ffc6c893abd4262b33abf21d8deab53';

        // waits for response from open cage api
        try{
            let response = await fetch(openCageApiUrl);
            let data = await response.json();
            var longitude = data.results[0].geometry.lng;
            var latitude = data.results[0].geometry.lat;
        }catch(error){
            console.log(error);        
        }        
        finally {
            console.log("Weather fetched");
        };

        //invoke a function eventSearch
        eventSearch(longitude, latitude);
    }
    citySearchForm.value = "";
})