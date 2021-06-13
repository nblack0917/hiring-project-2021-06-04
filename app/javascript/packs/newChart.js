let loading = true;

// function to create array of dates for weather api queries
const createDates = () => {
    let queryDates = [[],[],[]];
    const formatDate = (date, query) => {
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
      if(query === "today") {
        let day = formatDay((date.getDate() - 1).toString());
        let month = formatMonth((date.getMonth() + 1).toString());
        queryDates[2].push(`${year}-${month}-${day}`)
      } else {
        let day = formatDay(date.getDate().toString());
        let month = formatMonth((date.getMonth()+1).toString());
        if (query === "startOfThisMonth") {
          queryDates[2].unshift(`${year}-${month}-${day}`)
        } else if (query === "startOfOneMonth") {
          queryDates[1].push(`${year}-${month}-${day}`)
        } else if (query === "endOfOneMonth") {
          queryDates[1].push(`${year}-${month}-${day}`)
        } else if (query === "twoMonthsAgo") {
          queryDates[0].push(`${year}-${month}-${day}`)
        } else if (query === "endOfTwoMonths") {
          queryDates[0].push(`${year}-${month}-${day}`)
        } 
      }
    }
    const todayDate = new Date();
    let twoMonthsAgoDate = new Date();
    twoMonthsAgoDate.setMonth(todayDate.getMonth() - 2);
    let endOfTwoMonthsDate = new Date(twoMonthsAgoDate.getFullYear(), twoMonthsAgoDate.getMonth()+1, 0);
    let oneMonthAgoDate = new Date();
    oneMonthAgoDate.setMonth(todayDate.getMonth() - 1);
    let startOfOneMonthDate = new Date(oneMonthAgoDate.getFullYear(), oneMonthAgoDate.getMonth(), 1);
    let endOfOneMonthDate = new Date(oneMonthAgoDate.getFullYear(), oneMonthAgoDate.getMonth()+1, 0);
    let startOfThisMonthDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1)
  
    formatDate(todayDate, "today")
    formatDate(startOfThisMonthDate, "startOfThisMonth")
    formatDate(startOfOneMonthDate, "startOfOneMonth")
    formatDate(endOfOneMonthDate, "endOfOneMonth")
    formatDate(twoMonthsAgoDate, "twoMonthsAgo")
    formatDate(endOfTwoMonthsDate, "endOfTwoMonths")
  
    return queryDates;
  };

// // function to create dates in format needed for weather url and generate url
// const todaysDate = () => {
//     const today = new Date();
//     const year = today.getFullYear().toString();
//     let day = (today.getDate() - 1).toString();
//     if (day.length <= 1) {
//         day.padStart(2, "0")
//     }
//     let month = (today.getMonth() + 1).toString();
//     if (month.length <= 1) {
//         return `${year}-${month.padStart(2, "0")}-${day}`
//     }
//     return `${year}-${month}-${day}`
// }

// console.log(todaysDate())

// // let firstDay;
// // firstDay = new Date();
// // firstDay.setMonth(firstDay.getMonth() - 2)
// // console.log("first", firstDay)
// // let lastDayOfMonth = new Date(firstDay.getFullYear(), firstDay.getMonth()+1, 0)
// // let firstDayOfMonth = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1)
// // console.log("last", lastDayOfMonth)
// // console.log("first day", firstDayOfMonth)


// const startingDate = () => {
//     const today = firstDay
//     const year = today.getFullYear().toString();
//     let day = today.getDate().toString();
//     if (day.length === 1) {
//         day.padStart(2, "0")
//     }
//     let newMonth;
//     const pastMonth = ((today.getMonth()+1) - 1).toString()
//     if (pastMonth <= 0) {
//         newMonth = (12 - Math.abs(pastMonth)).toString()
//     } else {
//         newMonth = pastMonth
//     }
//     if (newMonth.length <= 1) {
//         return `${year}-${newMonth.padStart(2, "0")}-${day}`
//     }
//     return `${year}-${newMonth.toString()}-${day}`
// }

// console.log(startingDate())

// const backlogDataURL = "https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=7b0d30e53a61466396e150128211106&q=30.404251,-97.849442&date=" + startingDate() + "&enddate=" + todaysDate() + "&tp=1&data=weather&format=json"
// const forecastDataURL = "https://api.worldweatheronline.com/premium/v1/weather.ashx?key=7b0d30e53a61466396e150128211106&q=30.404251,-97.849442&num_of_days=2&tp=1&format=json"

// console.log(backlogDataURL)

let historicData = [];
let forecastData = [];


const detailData = async function (callback) {
    let dateParameters = createDates()
    // console.log("dats", dateParameters)
    let backLogDataURLArray = []

    const updateHistoricData = (weatherData) => {
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
                    // console.log("change time")
                    newTime = armyTime.padStart(4, "0").slice(0,2)
                } else {
                    newTime = armyTime.slice(0,2)
                }
                // console.log("time", newTime)
                // weatherDetail.push(`${month}/${date}/${year}`);
                weatherDetail.push(Date.UTC(year, (month - 1).toString(), date, newTime, 0, 0));
                weatherDetail.push(parseFloat(temp.tempF));
                // weatherDetail.push(temp.tempF);
                historicData.push(weatherDetail)
                // currentData.push(parseFloat(temp.tempF))
            });
        })
    }

    
    const forecastDataURL = "https://api.worldweatheronline.com/premium/v1/weather.ashx?key=7b0d30e53a61466396e150128211106&q=30.404251,-97.849442&num_of_days=2&tp=1&format=json"

   

    dateParameters.forEach(dates => {
        let backlogDataURL = "https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=7b0d30e53a61466396e150128211106&q=30.404251,-97.849442&date=" + dates[0] + "&enddate=" + dates[1] + "&tp=1&data=weather&format=json"
        backLogDataURLArray.push(backlogDataURL)
    })

    try {
            await $.ajax({
                type: "GET",
                url: backLogDataURLArray[0],
                dataType: "json",
                success: function(result) {
                    var weatherData = result.data.weather;
                    console.log("result", result)

                    updateHistoricData(weatherData)

                }
            });
            console.log(historicData)
    } catch (error) {
        console.error(error);
    }
    try {
            await $.ajax({
                type: "GET",
                url: backLogDataURLArray[1],
                dataType: "json",
                success: function(result) {
                    var weatherData = result.data.weather;
                    console.log("result", result)

                    updateHistoricData(weatherData)
                }
            });
            console.log(historicData)
    } catch (error) {
        console.error(error);
    }
    try {
            await $.ajax({
                type: "GET",
                url: backLogDataURLArray[2],
                dataType: "json",
                success: function(result) {
                    var weatherData = result.data.weather;
                    console.log("result", result)

                    updateHistoricData(weatherData)
                }
            });
            console.log(historicData)
    } catch (error) {
        console.error(error);
    }

    console.log(historicData)

    try {
        await $.ajax({
            type: "GET",
            url: forecastDataURL,
            dataType: "json",
            success: function(result) {
                var weatherData = result.data.weather;

                console.log("result", result)

                    
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
                            // console.log("change time")
                            newTime = armyTime.padStart(4, "0").slice(0,2)
                        } else {
                            newTime = armyTime.slice(0,2)
                        }
                        // console.log("time", newTime)
                        // weatherDetail.push(`${month}/${date}/${year}`);
                        weatherDetail.push(Date.UTC(year, (month - 1).toString(), date, newTime, 0, 0));
                        weatherDetail.push(parseFloat(temp.tempF));
                        // weatherDetail.push(temp.tempF);
                        forecastData.push(weatherDetail)
                        // currentData.push(parseFloat(temp.tempF))
                    });

                })

                console.log(forecastData)
                callback()
            }
        });
    } catch (error) {
        console.error(error);
    }

}

let options = {
    chart: {
        zoomType: 'x'
        
    },
    title: {
        text: 'Weather for Austin HQ',
        align: 'center'
    },
    subtitle: {
        text: 'Daily temperature for 2 month period and 2 day forecast',
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
        area: {
            fillOpacity: 0.0,
            lineWidth:1,
            marker: {
                enabled: false
            },
            states: {
                hover: {
                    lineWidth: 3
                }
            },
            threshold: null,
        }
    },
    series: [{
        type: 'area',
        name: 'Historic Daily Temperature',
        color: '#006fc9',
        data: []
    },
    {
        type: 'area',
        name: 'Forecast Temperature',
        color: '#04781f',
        data: []
    }],
    navigation: {
        menuItemStyle: {
            fontSize: '10px'
        }
    }
}


function makeChart() {
    options.series[0].data = historicData;
    options.series[1].data = forecastData;
    Highcharts.chart('container', options)
    document.getElementById('loadingSpinner').style.display = 'none'
}

detailData(makeChart)