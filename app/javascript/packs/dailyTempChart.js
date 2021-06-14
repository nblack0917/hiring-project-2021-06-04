require('dotenv').config({ path: '.env' })

//starting variables
let loading = true;
let monthsToQuery = 1;
let historicData = [];
let forecastData = [];

// function to create array of dates for weather api queries
// creates array of two dates based on # of monthsToQuery: start date to last day of that month, any middle months first day to last day, current month first day to today
const createDates = (numOfMonths) => {
    let queryDates = [[]];
    
    const todayDate = new Date();
    let startMonthDate = new Date();
    startMonthDate.setMonth(todayDate.getMonth() - numOfMonths);
    let endOfStartMonth = new Date(startMonthDate.getFullYear(), startMonthDate.getMonth()+1, 0);
    let startOfThisMonthDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)

    for(let i=0; i<numOfMonths; i++) {
        queryDates.push([])
    }
    const formatDate = (date, query, idx) => {
        const formatDay = (day) => {
            let thisDay = day;
            if (thisDay.length <= 1) {
            thisDay.padStart(2, "0")
            return thisDay
            } else {
            return thisDay
            }
        };
        const formatMonth = (month) => {
            let thisMonth = month;
            if (thisMonth.length <= 1) {
            thisMonth.padStart(2, "0")
            return thisMonth
            } else {
            return thisMonth
            }
        }
        const year = date.getFullYear().toString();
        let lastIndex = queryDates.length-1;
        if(query === "today") {
            let day = formatDay((date.getDate() - 1).toString());
            let month = formatMonth((date.getMonth() + 1).toString());
            queryDates[lastIndex].push(`${year}-${month}-${day}`)
        } else {
            let day = formatDay(date.getDate().toString());
            let month = formatMonth((date.getMonth()+1).toString());
            if (query === "startOfThisMonth") {
            queryDates[lastIndex].unshift(`${year}-${month}-${day}`)
            } else if (query === "startOfOneMonth") {
            queryDates[idx].push(`${year}-${month}-${day}`)
            } else if (query === "endOfOneMonth") {
            queryDates[idx].push(`${year}-${month}-${day}`)
            } else if (query === "startDate") {
            queryDates[0].push(`${year}-${month}-${day}`)
            } else if (query === "endOfTwoMonths") {
            queryDates[0].push(`${year}-${month}-${day}`)
            } 
        }
    }

    const setMiddleMonths = (idx, monthNum) => {
        let previousMonthDate = new Date();
        previousMonthDate.setMonth(todayDate.getMonth() - (monthNum));
        // console.log(previousMonthDate)
        let startOfOneMonthDate = new Date(previousMonthDate.getFullYear(), previousMonthDate.getMonth(), 1);
        let endOfOneMonthDate = new Date(previousMonthDate.getFullYear(), previousMonthDate.getMonth()+1, 0);
        formatDate(startOfOneMonthDate, "startOfOneMonth", idx)
        formatDate(endOfOneMonthDate, "endOfOneMonth", idx)
    }

    formatDate(todayDate, "today")
    formatDate(startOfThisMonthDate, "startOfThisMonth")
    if(numOfMonths > 1) {
    let num = queryDates.length
    let endIndex = num - 1;
    let monthNum = endIndex;
    for(let x=1; x<endIndex; x++) {
        monthNum -= 1;
        setMiddleMonths(x, monthNum)
    }
    }
    formatDate(startMonthDate, "startDate")
    formatDate(endOfStartMonth, "endOfTwoMonths")

    return queryDates;
};

// function to query weather api for data, push data into appropriate array, and create chart through callback
const detailData = async function (callback) {
    let dateParameters = createDates(monthsToQuery)
    // console.log("dats", dateParameters)
    let backLogDataURLArray = []

    // reformat date information into string and create array of date and temp. Push weather info array into correct data array.
    const updateHistoricData = (weatherData, array) => {
        weatherData.forEach(thisDay => {
            let day = thisDay.date
            let year = day.slice(0, 4)
            let month = parseInt(day.slice(5, 7))
            let date = day.slice(8)
            thisDay.hourly.forEach(temp => {
                let weatherDetail = [];
                let armyTime = temp.time.toString();
                let newTime;
                if (armyTime.length !== 4) {
                    newTime = armyTime.padStart(4, "0").slice(0,2)
                } else {
                    newTime = armyTime.slice(0,2)
                }
                weatherDetail.push(Date.UTC(year, (month - 1).toString(), date, newTime, 0, 0));
                weatherDetail.push(parseFloat(temp.tempF));
                if(array === "historicData") {
                    historicData.push(weatherDetail)
                } else {
                    forecastData.push(weatherDetail)
                }
            });
            
        })
    }

    // API url for forecast data
    const forecastDataURL = "https://api.worldweatheronline.com/premium/v1/weather.ashx?key=" + process.env.WEATHER_API_KEY + "&q=30.404251,-97.849442&num_of_days=2&tp=1&format=json"

    // loop for API url for historic data based on number of months needed
    dateParameters.forEach(dates => {
        let backlogDataURL = "https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=" + process.env.WEATHER_API_KEY + "6&q=30.404251,-97.849442&date=" + dates[0] + "&enddate=" + dates[1] + "&tp=1&data=weather&format=json"
        backLogDataURLArray.push(backlogDataURL)
    })

    // AJAX GET loop function for any required months of historic data
    const historicAPIQuery = (url) =>  {
            return $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: function(result) {
                    var weatherData = result.data.weather;
                    // console.log("result", result)
                    updateHistoricData(weatherData, "historicData")
                }
            });

            
    }
    
    // Promise loop for historic data
    try {
        await backLogDataURLArray.reduce(function(p, url) {
            // console.log(p, url)
            return p.then(function() { 
                return historicAPIQuery(url);
            });
        }, $.when());
    } catch (error) {
        console.error(error);
    }

    // AJAX GET for forecast data
    try {
        await $.ajax({
            type: "GET",
            url: forecastDataURL,
            dataType: "json",
            success: function(result) {
                var weatherData = result.data.weather;
                // console.log("result", result)  
                updateHistoricData(weatherData, "forecastData")
                // console.log(forecastData)
                callback()
            }
        });
    } catch (error) {
        console.error(error);
    }
    // console.log(historicData)
}

// Chart options
let options = {
    chart: {
        zoomType: 'x'
    },
    title: {
        text: 'Weather for Austin HQ',
        align: 'center'
    },
    subtitle: {
        text: `Daily temperature for ${monthsToQuery.toString()} month period and 2 day forecast`,
        align: 'center'
    },
    data: {
        enablePolling: true,
        dataRefreshRate: 1
    },
    xAxis: {
        type: 'datetime',
    },
    yAxis: {
        title: {
            text: 'Temperature (F)'
        },
        minorGridLineWidth: 0,
        gridLineWidth: 0,
        alternateGridColor: null,
        plotBands: [{ 
            from: 10,
            to: 20,
            color: 'rgba(29, 135, 222, 0.2)',
            label: {
                text: 'Light air',
                style: {
                    color: '#606060'
                }
            }
        }, { 
            from: 20,
            to: 30,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'Light breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { 
            from: 30,
            to: 40,
            color: 'rgba(29, 222, 190, 0.2)',
            label: {
                text: 'Gentle breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { 
            from: 40,
            to: 50,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'Moderate breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { 
            from: 50,
            to: 60,
            color: 'rgba(138, 222, 29, 0.2)',
            label: {
                text: 'Fresh breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { 
            from: 60,
            to: 70,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'Strong breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { 
            from: 70,
            to: 80,
            color: 'rgba(222, 190, 29, 0.2)',
            label: {
                text: 'High wind',
                style: {
                    color: '#606060'
                }
            }
        }, { 
            from: 80,
            to: 90,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'High wind',
                style: {
                    color: '#606060'
                }
            }
        }, { 
            from: 90,
            to: 100,
            color: 'rgba(222, 126, 29, 0.2)',
            label: {
                text: 'High wind',
                style: {
                    color: '#606060'
                }
            }
        }, {
            from: 100,
            to: 110,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'High wind',
                style: {
                    color: '#606060'
                }
            }
        }, { 
            from: 110,
            to: 120,
            color: 'rgba(255, 0, 0, 0.2)',
            label: {
                text: 'High wind',
                style: {
                    color: '#606060'
                }
            }
        }]
    },
    tooltip: {
        valueSuffix: '\xB0 F'
    },
    plotOptions: {
        line: {
            lineWidth:1,
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 3
                }
            },
        }
    },
    series: [{
        type: 'line',
        name: 'Historic Daily Temperature',
        color: '#006fc9',
        data: []
    },
    {
        type: 'line',
        name: 'Forecast Temperature',
        color: '#04781f',
        data: []
    }],
    navigation: {
        // menuItemStyle: {
        //     fontSize: '10px'
        // },
        buttonOptions: {
            align: 'right'
        }
    },
    scrollbar: {
        enabled: false
    },
    rangeSelector: {
        selected: 4,
        inputEnabled: false,
        buttons: [{
            type: 'day',
            count: 1,
            text: '1D',
        },
        {
            type: 'week',
            count: 1,
            text: '1W',
        },
        {
            type: 'month',
            count: 1,
            text: '1M',
        },
        {
            type: 'month',
            count: 3,
            text: '3M',
        },
        {
            type: 'all',
            count: 1,
            text: 'All',
        }]
    },
}

// function to create chart with AJAX data
function makeChart() {
    options.series[0].data = historicData;
    options.series[1].data = forecastData;
    Highcharts.stockChart('container', options);
    $("#loadingSpinner").addClass("d-none");
    let firstChart = $('#firstChart');
    firstChart.removeClass('d-none');
    firstChart.addClass("d-flex");
}

// callback function to update options to default and update data to new number of months
const updateData = () => {
    options.series = [{ 
        type: 'line',
        name: 'Historic Daily Temperature',
        color: '#006fc9',
        data: []
    },
    {
        type: 'line',
        name: 'Forecast Temperature',
        color: '#04781f',
        data: []
    }]
    options.subtitle = {
        text: `Daily temperature for ${monthsToQuery.toString()} month period and 2 day forecast`,
        align: 'center'
    }
    options.series[0].data = historicData;
    options.series[1].data = forecastData;
    Highcharts.stockChart('container', options)
    $('#newMonthButton').toggleClass("d-none")
    $('#newMonthButtonSpinner').toggleClass("d-none")
}

// click funtion to update number of months and data
$('#newMonthButton').click(function () {
    $('#newMonthButton').toggleClass("d-none")
    $('#newMonthButtonSpinner').toggleClass("d-none")
    let newNum = document.getElementById("monthNumber").value;
    monthsToQuery = parseInt(newNum);
    historicData = [];
    forecastData = [];
    detailData(updateData);
}); 

// update chart every 30 minutes
setInterval(() => {
    // console.log("update")
    historicData = [];
    forecastData = []

// function call to collect AJAX data with makeChart callback
detailData(makeChart)

}, 1800000)

// create initial chart
detailData(makeChart)
