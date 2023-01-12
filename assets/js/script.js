var tmApiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?city='+ {city} +'&countryCode=US&apikey=9guoY8HVvZn5Dz76zhZz9omQCGJGNs7n'
var weatherApiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=51.51&longitude=-0.13&hourly=temperature_2m'
//variable for html elements
// use d3 to select elements from html
// var weatherInfo 
// var ticketInfo



fetch(tmApiUrl).then(function (response) {
    if (response.ok) {
        response.json().then(function (data) {
            console.log(data);
        }) 
    }
})

fetch(weatherApiUrl).then(function (response) {
    if (response.ok) {
        response.json().then(function (data) {
            console.log(data);
        }) 
    }
})



//event listener on search submit of cityName
    //invoke a function eventSearch

//eventSearch function accepting cityName as an argument
    // fetch ticketmaster using cityName
        //call a function displayEvent passes data into it
    // fetch weather using the cityName
        //call a function displayWeather passes data into it
    
//function displayEvent accepts data
// --- display event information --- event name, ticket availability, price range, date, please note
    // iterate over data --- for events shown on cityName search
        // creates element for event info
        // append elements to weatherInfo


//function displayWeather accepts data
// --- displays weather --- location, date, temp, condition, condition icon, wind


//once submitted modal brings up local events and dates
//once selected weather is shown for local event
//function to submit city name and store it into local storage
//
