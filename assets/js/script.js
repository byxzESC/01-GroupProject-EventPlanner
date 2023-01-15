// var searchBtn = d3.select('#modal-button');
// var citySearchForm = d3.select('#city-search-form');
var searchBtn = document.getElementById('search-submit-button');
var citySearchForm = document.getElementById('city-search-input');
var inputVal = d3.select('#inputState');

var startDateISO
var endDateISO
searchBtn.addEventListener("click", function(){
    var startDate = document.getElementById('startDate').valueAsDate;
    var endDate = document.getElementById('endDate').valueAsDate;
    var startDateISO = startDate.toISOString().split('T', 1);
    var endDateISO = endDate.toISOString().split('T', 1);
    eventSearch(citySearchForm.value, inputVal.value, startDateISO, endDateISO);
    console.log(startDateISO)
    console.log(endDateISO)
});


var ticketInfo = d3.select('#ticketInfo')
var date;
                    

// user enter city name, date range, and pick genre
    // fetch using user input, and area radius
    // send fetched data to display event

// user click event 
    // display weather and more info


// fetch event data function accepting cityName as an argument
var eventSearch = function (city, genre, startDate, endDate) {


    var ticketMasterApiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?&q=' + city + '&classificationName='+ genre +'&startDateTime='+startDate+'T00:00:01Z&endDateTime='+endDate+'T23:59:59Z&apikey=9guoY8HVvZn5Dz76zhZz9omQCGJGNs7n'
    var weatherApiUrl = 'https://api.weatherapi.com/v1/future.json?key=4e031b93d3c141019f0220405231401&q='+city+'&dt=2023-03-03'


    // fetch ticketmaster using cityName
    fetch(ticketMasterApiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayEvent(data._embedded.events, city)
            }) 
        }
    })
    // fetch weather using the cityName
   

}
// super cool text
// font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600

//function displayEvent accepts data
function displayEvent (data, city) {

    // creates element for event info
    d3.select('#ticketInfo')
    .selectAll('div')
    .data(data)
    .enter()
    .append('div')
    .attr('id', 'eCard')

    .attr('tabindex', '1')

    

    .classed('card, my-2, mx-4, bg-teal-600, text-white, border, border-black, border-solid, flex-1' , true)
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
      return "N/A"}
    })

    // append elements to weatherInfo
    d3.select('#ticketInfo').selectAll('#eCard').on('click', function(){
        date = this.querySelector('.event-date').getAttribute('value')
        console.log(date)
        displayWeather(date, city)
     })

}


// ticketInfo.nodes()[0].on('click', function(){
//    console.log("I've been clicked");
// });

//function displayWeather accepts data
// --- displays weather --- location, date, temp, condition, condition icon, wind
function displayWeather (date, city) {
        console.log('date is', date);

        var weatherApiUrl = 'https://api.weatherapi.com/v1/future.json?key=4e031b93d3c141019f0220405231401&q='+city+'&dt='+date

        fetch(weatherApiUrl).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    avTemp = data.forecast.forecastday[0].day;
                    // displayWeather(avTemp);
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
                }) 
            }
        })
    
    //   var localDate = data._embedded.events[0].dates.start.localDate
    // console.log(data)
    // var weatherApiUrl = 'https://api.weatherapi.com/v1/future.json?key=4e031b93d3c141019f0220405231401&q='+inputVal+'&dt='+localDate+''
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


}

//event listener on search submit of cityName
// d3.select('#search-submit-button').on('click', async function (event) {
d3.select('#search-submit-button').on('click', function (event) {
    event.preventDefault();
    // remove previous search results
    d3.selectAll('#eCard').remove()

    var city = citySearchForm.value;
    var genre = inputVal.nodes()[0].value
    var dateRange;
    console.log(`searched city is ${city}, genre is ${genre}, and dateRange ${startDateISO} - ${endDateISO}`);
    
    // check if city input is empty
     if (!city) {
        console.log("need city name")
    } else {
        //invoke a function eventSearch
        eventSearch(city, genre, startDate, endDate);
    }
    citySearchForm.value = "";
})

d3.select('#eCards')
    

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











