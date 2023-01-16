// var searchBtn = d3.select('#modal-button');
// var citySearchForm = d3.select('#city-search-form');
var searchBtn = document.getElementById('search-submit-button');
var citySearchForm = document.getElementById('city-search-input');
var inputVal = d3.select('#inputState');

var startDate
var endDate
var weather


var ticketInfo = d3.select('#ticketInfo')
var date;
                    

// user enter city name, date range, and pick genre
    // fetch using user input, and area radius
    // send fetched data to display event

// user click event 
    // display weather and more info


// fetch event data function accepting cityName as an argument
var eventSearch = function (city, genre, startDate, endDate) {
    console.log(startDate)
    console.log(endDate)

    var ticketMasterApiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?&q=' + city + '&classificationName='+genre+'&startDateTime='+startDate+'T00:00:01Z&endDateTime='+endDate+'T23:59:59Z&radius=50&apikey=9guoY8HVvZn5Dz76zhZz9omQCGJGNs7n'
    // var weatherApiUrl = 'https://api.weatherapi.com/v1/future.json?key=4e031b93d3c141019f0220405231401&q='+city+'&dt='+startDate

   

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

// super cool text
// font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600

//function displayEvent accepts data
function displayEvent (data, city) {
    // .classed('card, my-2, mx-4, bg-teal-600, text-white, border, border-black, border-solid, flex-1' , true)

    // creates element for event info
    d3.select('#ticketInfo')
    .selectAll('div')
    .data(data)
    .enter()
    .append('div').attr('id', 'eCard').attr('tabindex', '1').attr('class', 'flex flex-right')
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
         return "Min: $" + dta.priceRanges[0].min + " Max: $" + dta.priceRanges[0].max
    } else {
      return "N/A"
    }
    });
});
    // append elements to weatherInfo
    d3.select('#ticketInfo').selectAll('#eCard').on('click', function(){
        date = this.querySelector('.event-date').getAttribute('value')
         console.log(date)
        // pass in date and city to fetch weather data
        // display weather info with d3
        // append weather info to ticketInfo
        callWeather(date, city)
     });

}


function callWeather(date, city){
    var weatherApiUrl = 'https://api.weatherapi.com/v1/future.json?key=4e031b93d3c141019f0220405231401&q='+city+'&dt='+date;

    fetch(weatherApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                // localName = data.location.name
                // console.log("this is: ", localName)
                weather = data.forecast.forecastday
                console.log(weather)
                displayWeather(weather)
            })
           
        }
        }) 
}

//function displayWeather accepts data
// --- displays weather --- location, date, temp, condition, condition icon, wind
function displayWeather (weather) {
     console.log('date is', date);
     console.log('this is weather data', weather)
     var cardBod = d3.select('#eCard');
        cardBod.selectAll('article')
                .data(weather)
                .enter()
                .append('article')
                .style('border', 'solid',)
                .attr('id', 'weather')
                // this will display background color for weather info
                .style("background", "red")
                // added all the data needed to display date, temp, condition, condition icon, wind
                // need to know how to diplay icon but that will be the correct the correct link
                .text( 'Date: '+weather[0].date +
                 ' Temperature: '+weather[0].day.avgtemp_f + "°F" + 
                 " conditon: "+weather[0].hour[3].condition.text + 
                 " Condition Icon: https:"+weather[0].hour[3].condition.icon +  
                 "  wind: "+weather[0].day.maxwind_mph+"mph");
                 
            
    // this is to remove weather from eCard
    d3.select('#eCard').on('click', function (event) {
    event.preventDefault();
    // remove previous search results
    d3.selectAll('#weather').remove()
    }); 
          
     }
     
    // avTemp = data.forecast.forecastday[0].day;
    // displayWeather(avTemp);
    // var avTemp = data.forecast.forecastday[0].day.avgtemp_f
    // console.log("temp: ", avTemp)
    // var locName = data.location.name
    // console.log("name: ", locName)
    // var dateW = data.forecast.forecastday[0].date
    // console.log("date: ", dateW)
    // var condition = data.forecast.forecastday[0].hour[3].condition.text
    // console.log("conditon: ", condition)
    // var conditionIcon = data.forecast.forecastday[0].hour[3].condition.icon
    // console.log("icon: ", conditionIcon)
    // var wind = data.forecast.forecastday[0].day.maxwind_mph
    // console.log("wind: ", wind)

//event listener on search submit of cityName
// d3.select('#search-submit-button').on('click', async function (event) {
d3.select('#search-submit-button').on('click', function (event) {
    event.preventDefault();
    // remove previous search results
    d3.selectAll('#eCard').remove()

    var city = citySearchForm.value;
    var genre = inputVal.nodes()[0].value
    var dateRange;
    startDate = d3.select('#startDate').nodes()[0].value
    endDate = d3.select('#endDate').nodes()[0].value

    console.log(startDate)
    console.log(endDate)
    console.log(`SEARCHBTN PRESSED searched city is ${city}, genre is ${genre}, and dateRange ${startDate} - ${endDate}`);

    // eventSearch(citySearchForm.value, inputVal.value, startDate, endDate);


    
    // check if city input is empty
     if (!city) {   
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
        
    } else {
        //invoke a function eventSearch
        eventSearch(city, genre, startDate, endDate);
    }
    citySearchForm.value = "";
})

// submit-button codes
    // inside else statement
        // displayWeather(avTemp);
        // get the longitude and latitude of the input city
        // var openCageApiUrl =  'https://api.opencagedata.com/geocode/v1/json?q=' + city + '&current_weather=true&key=5ffc6c893abd4262b33abf21d8deab53';
       
        // waits for response from open cage api
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







