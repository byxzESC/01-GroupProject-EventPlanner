var tmApiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?city='+ {city} +'&countryCode=US&apikey=9guoY8HVvZn5Dz76zhZz9omQCGJGNs7n'
var weatherApiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=51.51&longitude=-0.13&hourly=temperature_2m'
//variable for html elements
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



//event listener on search submit of city name
    //invoke a function eventSearch

//eventSearch function accepting city name as an argument
    //fetch ticketmaster using city name
        //call a function displayEvent
    // fetch weather using the city name
        //call a function displayWeather
    
//create a function called displayEvent
//create a function called displayWeather


//once submitted modale brings up local events and dates
//once selected weather is shown for local event
//function to submit city name and store it into local storage
//
