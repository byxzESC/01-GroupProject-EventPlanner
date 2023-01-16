
var searchBtn = document.getElementById('search-submit-button');
var citySearchForm = document.getElementById('city-search-input');
var inputVal = d3.select('#inputState');

// moved global declaration var to line 139
// changed names for more clarity
var eventWeather;
var eventDate;
var ticketInfo = d3.select('#ticketInfo')

// user enter city name, date range, and pick genre
    // fetch using user input, and area radius
    // send fetched data to display event

// user click event 
    // display weather and more info


// fetch event data function accepting cityName as an argument
var eventSearch = function (city, genre, startDate, endDate) {
    var ticketMasterApiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?&q=' + city + '&classificationName=' + genre + '&startDateTime=' + startDate+ 'T00:00:01Z&endDateTime=' + endDate + 'T23:59:59Z&radius=50&apikey=9guoY8HVvZn5Dz76zhZz9omQCGJGNs7n';

    // fetch ticketmaster using cityName
    fetch(ticketMasterApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log('eventSearch result ', data)
                displayEvent(data._embedded.events, city)
            }) 
        }
    })
}

//function displayEvent accepts data
function displayEvent (data, city) {
    // creates elements for event info
    d3.select('#ticketInfo')
    .selectAll('div')
    .data(data)
    .enter()
    .append('div').attr('class', 'eCard').attr('tabindex', '1')
    .each(function(d) {
        d3.select(this).html(
            `<div class="card-body">
                <h5 class="card-title text-white h-16">${d.name}</h5>
                <p class="event-date" value='${d.dates.start.localDate}'>${d.dates.start.localDate}</p>
                <a href="${d.url}"><button class="inline-block px-2.5 py-1 bg-white font-medium text-teal-600 rounded hover:bg-teal-700">More Info</button></a> 
                `)
        .selectChild().insert('p')
        .text(function(dta) {
            if(dta.priceRanges){
                return "Price ranges $" + dta.priceRanges[0].min + " - $" + dta.priceRanges[0].max;
            } else {
                return "Price ranges N/A";
            }
        });
    });

    // append elements to eCard "weatherInfo"
    d3.select('#ticketInfo').selectAll('.eCard').on('click', function(){
        // TODO:: selectAll data-selected and remove all data-selected attribute from them

        eventDate = this.querySelector('.event-date').getAttribute('value')
        // assign a special attribute to --this--
        // and later could use it to select this particular element to append weather info to
        d3.select(this).attr('data-selected', 'focused');

        // fetch weather data
        callWeather(eventDate, city)
     });
}

// fetch weather data after user select an event
function callWeather(date, city){
    var weatherApiUrl = 'https://api.weatherapi.com/v1/future.json?key=4e031b93d3c141019f0220405231401&q=' + city + '&dt=' + date;

    fetch(weatherApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // console.log(data);
                eventWeather = data.forecast.forecastday[0];
                // console.log(weather)
                displayWeather(eventWeather);
            })
           
        }
    })
}

//function displayWeather accepts data
// --- displays weather --- location, date, temp, condition, condition icon, wind
function displayWeather (WeatherData) {
    // .avghumidity, .avgtemp_f, .maxwind_mph, hour[].condition.icon <-- is a URL, hour[].condition.text, .date
    console.log('date is', eventDate);
    console.log('this is weather data ', WeatherData)

    //TODO: select eCard element correctly, display weatherData, and append to it

    // .html(`<p>Temperature: ${currentEventWeather.avgtemp_f}</P>`)
    // var cardBod = d3.select('#eCard');
    // cardBod.selectAll('p')
    //         .data(weather)
    //         .enter()
    //         .append('p')
    //         .style('border', 'solid')
    //         .text('Temperature: ' + currentEventWeather.avgtemp_f)     
    
    var weatherForecast = d3.select('[data-selected]');
    console.log('eCard element ', weatherForecast._groups[0]);
    // weatherForecast.select('p').data(data).enter().append('p')
    //     .attr('class', 'weatherForecast')
    //     .text('Temperature: ' + currentEventWeather.avgtemp_f);
    weatherForecast.append('p').html(`Temperature: ${currentEventWeather.avgtemp_f}`)
    console.log('eCard element ', weatherForecast._groups[0].siblings());



    // testing with JS codes
    // var cardEl = document.getElementsByClassName('eCard');
    // var test = document.getElementById('ticketInfo');
    // var weatherForecast = document.createElement('p');
    // weatherForecast.textContent = '-----------------Temperature: ' + currentEventWeather.avgtemp_f;
    // test.append(weatherForecast);
    // cardEl.append(weatherForecast);
}


//event listener on search submit of cityName
d3.select('#search-submit-button').on('click', function (event) {
    event.preventDefault();
    // remove previous search results
    d3.selectAll('.eCard').remove()

    // these var gets declare and assign to variables every time --- base on user input
    var city = citySearchForm.value;
    var genre = inputVal.nodes()[0].value
    var startDate = d3.select('#startDate').nodes()[0].value
    var endDate = d3.select('#endDate').nodes()[0].value


    
    // check if city input is empty
     if (!city || !startDate || !endDate) { 
         // check if user entered city, start date, and end date 
        // this appends modal  when inputs aren't selected 
        // need to figure how to loop modal for everytime the search doesn't have city name inputed
        d3.select("#staticBackdrop").style('display', 'block').classed("show", true).text();

        // adventListener for the understood modal button to close modal
        d3.select('#close').on('click', function (event) {
            event.preventDefault();
            // remove previous search results
            d3.selectAll('#staticBackdrop').remove()});
            
        // console.log(d3.select("#staticBackdrop").classed("<div>", false).text());
        console.log("need city name");
        console.log("need city name, start date, end date");
        
    } else {
        eventSearch(city, genre, startDate, endDate);
    }
    citySearchForm.value = "";
})

// submit-button alteration codes
    // inside else statement
        // displayWeather(avTemp);
        // get the longitude and latitude of the input city
        // var openCageApiUrl =  'https://api.opencagedata.com/geocode/v1/json?q=' + city + '&current_weather=true&key=5ffc6c893abd4262b33abf21d8deab53';
       
        // waits for response from open cage api
        // d3.select('#search-submit-button').on('click', async function (event) {
        // try{
        //     let response = await fetch(weatherApiUrl);
        //     let data = await response.json();
        //     console.log(data);
        //     var avTemp = data.forecast.forecastday[0].day.avgtemp_f
        //     console.log("temp: ", avTemp)
        //     var locName = data.location.name
        //     console.log("name: ", locName)
        //     var dateW = data.forecast.forecastday[0].date
        //     console.log("date: ", dateW)
        //     var condition = data.forecast.forecastday[0].hour[3].condition.text
        //     console.log("conditon: ", condition)
        //     var conditionIcon = data.forecast.forecastday[0].hour[3].condition.icon
        //     console.log("icon: ", conditionIcon)
        //     var wind = data.forecast.forecastday[0].day.maxwind_mph
        //     console.log("wind: ", wind)
        // }catch(error){
        //     console.log(error);        
        // }        
        // finally {
        //     console.log("Weather fetched");
            
        // };







