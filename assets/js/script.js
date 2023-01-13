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
                d3.select('#ticketInfo')
                    .selectAll('div')
                    .data(data._embedded.events)
                    .enter()
                    .append('div')
                    .classed('eCards', true)
                    .append('h2')
                    .text(dta => dta.name)
                    // .append('text')
                    // .attr('y', '1.5em')
                    // .style('margin', '2px')
                    // .text(dta => dta.url)
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
        // data._embedded.events[i] 
    // --- display event information --- event name, ticket availability, price range,  date,               please note, ticketmaster url, images
                                        // .name\        not sure\         .priceRanges\ .dates.start.dateTime\ .pleaseNote\   .url\      .images\
    // iterate over data --- for events shown on cityName search
    // i = 30

        // creates element for event info
        // append elements to weatherInfo
}

//function displayWeather accepts data
// --- displays weather --- location, date, temp, condition, condition icon, wind


//once submitted modal brings up local events and dates
//once selected weather is shown for local event
//function to submit city name and store it into local storage







//event listener on search submit of cityName
// d3.select('#modal-button').on('click', async function (event) {
searchBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    // value that user enter
    // var city = d3.select('#city-search-form').values;
    // console.log(d3.select('#city-search-form').value())
    var city = citySearchForm.value;
    console.log(city);
    

    // check if city input is empty
    if (!city) {
        alert("please enter a city name");
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

