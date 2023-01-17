
var citySearchForm = document.getElementById('city-search-input');
var genreOptions = d3.select('#genre-options');
var ticketInfo = d3.select('#ticketInfo')
var eventWeather;
var eventDate;
var currSearch = {};
var storeSearch = [];


function init() {
    
    storeSearch = JSON.parse(localStorage.getItem("searchObj"));

    if (storeSearch === null) {
    storeSearch = [];
     } else {
    
        console.log(storeSearch)
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
            .classed('pastCities inline-block mx-1 my2 px-6 py-2.5 bg-teal-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-teal-700', true)
            })
            d3.selectAll('.pastCities').on('click', function(evt){
                evt.preventDefault();
                d3.selectAll('.eCard').remove()
                pastCity = this.dataset.input
                pastGenre = this.dataset.genre
                pastStart = this.dataset.sdate
                pastEnd = this.dataset.edate
                console.log(this)
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

function openModal(city) {
    var modal = d3.select('body')
        .append('div')
        .attr('class', 'fixed top-50 left-50 inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm w-1/8 h-1/8')
        .style('display', 'none');

    var content = modal.append('div')
        .attr('class', 'relative flex flex-col justify-center items-center p-4 bg-white rounded-md')

    var header = content.append('div')
        .attr('class', 'flex justify-center items-center pb-4');
    header.append('h3')
        .attr('class', 'text-xl font-medium leading-normal text-black')
        .text('Warning');

    var body = content.append('div')
        .attr('class', 'text-black text-center')
        .text('Event type is unavailable in ' + city + '. Please pick a different event type.');

    var footer = content.append('div')
        .attr('class', 'flex justify-end items-center p-4');
    footer.append('button')
        .attr('class', 'px-6 py-2.5 bg-teal-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-teal-700')
        .text('OK')
        .on('click', function() {
            modal.style('display', 'none');
        });

    modal.style('display', 'block');
}

//function displayEvent accepts data
function displayEvent (data, city) {
    // creates elements for event info
    d3.select('#ticketInfo')
    .selectAll('div')
    .data(data)
    .enter()
    .append('div')
    .attr('class', 'eCard').attr('tabindex', '1')
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

// fetch weather data after user select an event
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
    // --- displays weather --- location, date, temp, condition, condition icon, wind
    // .avghumidity, .avgtemp_f, .maxwind_mph, hour[].condition.icon <-- is a URL, hour[]condition.text, .date
    console.log('date is', eventDate);
    console.log('this is weather data ', weatherData)

    var cardEl = document.querySelector('[data-selected=focused]');
    var weatherForecast = document.createElement('p');
    weatherForecast.setAttribute('id', 'weather-info');
    var TemperatureEl = document.createElement('p');
    var conditionEl = document.createElement('p');
    var windEL = document.createElement('p');
    var conditionIconEl = document.createElement('img');
    var iconUrl = "https:" +weatherData[0].hour[3].condition.icon;

    // console.log("this is icoon: ", iconUrl)
    TemperatureEl.textContent = `Temperature: ${weatherData[0].day.avgtemp_f}°F`;
    conditionEl.textContent = weatherData[0].hour[3].condition.text;
    windEL.textContent = `wind: ${weatherData[0].day.maxwind_mph}mph`;
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
        // d3.select("#staticBackdrop").style('display', 'block').classed("show", true);
        d3.select("#staticBackdrop").classed("visible", true).classed("hidden", false);
        console.log("need city name, start date, end date");
    } else {
        //Storing search in local storage
        currSearch = {search: city, genre, startDate, endDate};
        storeSearch.push(currSearch);
        localStorage.setItem('searchObj', JSON.stringify(storeSearch));
        init();
        eventSearch(city, genre, startDate, endDate);
    }
    citySearchForm.value = "";
})

d3.select('#understood').on('click', function (event) {
    event.preventDefault();
    // remove previous search results
    d3.selectAll('#staticBackdrop').classed("hidden", true);
});



init();






















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


// display Weather backup codes
    // var cardBod = d3.select('.eCard');
    //             cardBod.selectAll('article')
    //                     .data(weatherData)
    //                     .enter()
    //                     .append('article')
    //                     .style('border', 'solid',)
    //                     .attr('id', 'weather')
    //                     .style("background", "red")

    //                     .text( 'Date: '+weatherData[0].date +
    //                      ' Temperature: '+weatherData[0].day.avgtemp_f + "°F" + 
    //                      " conditon: "+weatherData[0].hour[3].condition.text + 
    //                      " Condition Icon: https:"+weatherData[0].hour[3].condition.icon +  
    //                      "  wind: "+weatherData[0].day.maxwind_mph+"mph");
    // this is to remove weather from eCard
            // d3.select('.eCard').on('click', function (event) {
            // event.preventDefault();
            // d3.selectAll('#weather').remove()
            // }); 
 

// CODE THAT WAS TRIED
    // .html(`<p>Temperature: ${currentEventWeather.avgtemp_f}</P>`)
    // var cardBod = d3.select('#eCard');
    // cardBod.selectAll('p')
    //         .data(weather)
    //         .enter()
    //         .append('p')
    //         .style('border', 'solid')
    //         .text('Temperature: ' + currentEventWeather.avgtemp_f)     
    
    // var weatherForecast = d3.select('[data-selected]');
    // console.log('eCard element ', weatherForecast._groups[0]);
    // weatherForecast.select('p').data(data).enter().append('p')
        // .attr('class', 'weatherForecast')
        // .text('Temperature: ' + currentEventWeather.avgtemp_f);
    // weatherForecast.append('p').html(`Temperature: ${weatherData[0].day.avgtemp_f}`)
    // console.log('eCard element ', weatherForecast._groups[0].siblings());
