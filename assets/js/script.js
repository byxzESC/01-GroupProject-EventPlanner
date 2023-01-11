var tmApiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?city=denver&countryCode=US&apikey=9guoY8HVvZn5Dz76zhZz9omQCGJGNs7n'
var weatherApiUrl = 'https://api.open-meteo.com/v1/forecast?latitude=51.51&longitude=-0.13&hourly=temperature_2m'

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



//event listener on submission of city name
//once submitted modale brings up local events and dates
//once selected weather is shown for local event
//function to submit city name and store it into local storage
