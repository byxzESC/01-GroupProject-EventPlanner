// var searchBtn = d3.select('#modal-button');
// var citySearchForm = d3.select('#city-search-form');
var searchBtn = document.getElementById('search-submit-button');
var citySearchForm = document.getElementById('city-search-input');
var inputVal = d3.select('#inputState');
var genre;

                   
                    

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
    var ticketMasterApiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?&countryCode=US&classificationName='+ genre +'&apikey=9guoY8HVvZn5Dz76zhZz9omQCGJGNs7n'
   

    // fetch ticketmaster using cityName
        //call a function displayEvent passes data into it
    // fetch weather using the cityName
        //call a function displayWeather passes data into it
    fetch(ticketMasterApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayEvent(data._embedded.events)
            }) 
        }
    })
    
}
// super cool text
// font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600

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
                <h5 class="card-title text-white h-16">${d.name}</h5>
                <p class="event-date">${d.dates.start.localDate}</p>
                <a href="${d.url}"><button class="inline-block px-2.5 py-1 bg-white font-medium text-teal-600 rounded hover:bg-teal-700">More Info</button></a> 
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
function displayWeather (avTemp) {
        console.log(avTemp);
    //   var localDate = data._embedded.events[0].dates.start.localDate
    // console.log(data)
    // var weatherApiUrl = 'https://api.weatherapi.com/v1/future.json?key=4e031b93d3c141019f0220405231401&q='+inputVal+'&dt='+localDate+''
   
    // fetch(weatherApiUrl).then(function (response) {
    //     if (response.ok) {
    //         response.json().then(function (data) {
    //             console.log(data);
    //         }) 
    //     }
    // })

// --- displays weather --- location, date, temp, condition, condition icon, wind
}

// d3.select('#eCard')
//     .on('click')

//event listener on search submit of cityName
// d3.select('#modal-button').on('click', async function (event) {
    d3.select('#search-submit-button')
    .on('click', async function (event) {
    event.preventDefault();
         d3.selectAll('#eCard')
            .remove()
           genre = inputVal.nodes()[0].value

    // value that user enter
    // var city = d3.select('#city-search-form').values;
    // console.log(d3.select('#city-search-form').value())
    var city = citySearchForm.value;
    console.log(city);
    var weatherApiUrl = 'https://api.weatherapi.com/v1/future.json?key=4e031b93d3c141019f0220405231401&q='+city+'&dt=2023-03-03'
    

    // check if city input is empty
     if (!city) {

        console.log("need city name")
    } else {
        // get the longitude and latitude of the input city
        // var openCageApiUrl =  'https://api.opencagedata.com/geocode/v1/json?q=' + city + '&current_weather=true&key=5ffc6c893abd4262b33abf21d8deab53';
       
        // waits for response from open cage api
        try{
            let response = await fetch(weatherApiUrl);
            let data = await response.json();
            console.log(data);
            var avTemp = data.forecast.forecastday[0].day.avgtemp_f
            console.log("temp: ", avTemp)
            var locName = data.location.name
            console.log("name: ", locName)
            var dateW = data.forecast.forecastday[0].date
            console.log("date: ", dateW)
            var condition = data.forecast.forecastday[0].hour[3].condition.text
            console.log("conditon: ", condition)
            var conditionIcon = data.forecast.forecastday[0].hour[3].condition.icon
            console.log("icon: ", conditionIcon)
            var wind = data.forecast.forecastday[0].day.maxwind_mph
            console.log("wind: ", wind)
        }catch(error){
            console.log(error);        
        }        
        finally {
            console.log("Weather fetched");
            
        };

        //invoke a function eventSearch
        eventSearch();
        displayWeather(avTemp);
    }
    citySearchForm.value = "";
})