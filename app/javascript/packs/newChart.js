let hestData = [
    20, 33, 39, 51, 40, 38, 40, 50, 65, 37, 33, 64,
    69, 60, 68, 44, 40, 38, 50, 49, 92, 96, 95, 63,
    95, 108, 93, 115, 100, 102, 103, 94, 89, 106, 105, 101,
    104, 107, 96, 102, 96, 102, 111, 108, 100, 85, 75, 95,
    101
]

// function to create dates in format needed for weather url and generate url
const todaysDate = () => {
    const today = new Date();
    const year = today.getFullYear().toString();
    let day = today.getDate().toString();
    if (day.length <= 1) {
        day.padStart(2, "0")
    }
    let month = (today.getMonth() + 1).toString();
    if (month.length <= 1) {
        return `${year}-${month.padStart(2, "0")}-${day}`
    }
    return `${year}-${month}-${day}`
}

console.log(todaysDate())

const startingDate = () => {
    const today = new Date();
    const year = today.getFullYear().toString();
    let day = today.getDate().toString();
    if (day.length === 1) {
        day.padStart(2, "0")
    }
    let newMonth;
    const pastMonth = ((today.getMonth()+1) - 2).toString()
    if (pastMonth <= 0) {
        newMonth = (12 - Math.abs(pastMonth)).toString()
    } else {
        newMonth = pastMonth
    }
    if (newMonth.length <= 1) {
        return `${year}-${newMonth.padStart(2, "0")}-${day}`
    }
    return `${year}-${newMonth.toString()}-${day}`
}

console.log(startingDate())

const backlogDataURL = "https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=7b0d30e53a61466396e150128211106&q=30.404251,-97.849442&date=" + startingDate() + "&enddate=" + todaysDate() + "&tp=3&data=weather&format=json"

console.log(backlogDataURL)





Highcharts.chart('container', {
    chart: {
        type: 'spline',
        scrollablePlotArea: {
            minWidth: 600,
            scrollPositionX: 1
        }
    },
    title: {
        text: 'Weather for Austin HQ',
        align: 'center'
    },
    subtitle: {
        text: 'Daily High\'s and Low\'s for 2 month period but 2 day forcast',
        align: 'right'
    },
    xAxis: {
        type: 'linear',
        labels: {
            overflow: 'justify'
        }
    },
    yAxis: {
        title: {
            text: 'Temperatures (f)'
        },
        minorGridLineWidth: 0,
        gridLineWidth: 0,
        alternateGridColor: null,
        plotBands: [{ // Light air
            from: 10,
            to: 20,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'Light air',
                style: {
                    color: '#606060'
                }
            }
        }, { // Light breeze
            from: 20,
            to: 30,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'Light breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { // Gentle breeze
            from: 30,
            to: 40,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'Gentle breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { // Moderate breeze
            from: 40,
            to: 50,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'Moderate breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { // Fresh breeze
            from: 50,
            to: 60,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'Fresh breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { // Strong breeze
            from: 60,
            to: 70,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'Strong breeze',
                style: {
                    color: '#606060'
                }
            }
        }, { // High wind
            from: 70,
            to: 80,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'High wind',
                style: {
                    color: '#606060'
                }
            }
        }, { // High wind
            from: 80,
            to: 90,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'High wind',
                style: {
                    color: '#606060'
                }
            }
        }, { // High wind
            from: 90,
            to: 100,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'High wind',
                style: {
                    color: '#606060'
                }
            }
        }, { // High wind
            from: 100,
            to: 110,
            color: 'rgba(0, 0, 0, 0)',
            label: {
                text: 'High wind',
                style: {
                    color: '#606060'
                }
            }
        }, { // High wind
            from: 110,
            to: 120,
            color: 'rgba(68, 170, 213, 0.1)',
            label: {
                text: 'High wind',
                style: {
                    color: '#606060'
                }
            }
        }]
    },
    tooltip: {
        valueSuffix: ' m/s'
    },
    plotOptions: {
        spline: {
            lineWidth: 4,
            states: {
                hover: {
                    lineWidth: 5
                }
            },
            marker: {
                enabled: false
            },
            pointInterval: 3600000, // one hour
            pointStart: Date.UTC(2018, 1, 13, 0, 0, 0)
        }
    },
    series: [{
        name: 'Hestavollane',
        data: hestData

    }, {
        name: 'Vik',
        data: [
            0.2, 0.1, 0.1, 0.1, 0.3, 0.2, 0.3, 0.1, 0.7, 0.3, 0.2, 0.2,
            0.3, 0.1, 0.3, 0.4, 0.3, 0.2, 0.3, 0.2, 0.4, 0.0, 0.9, 0.3,
            0.7, 1.1, 1.8, 1.2, 1.4, 1.2, 0.9, 0.8, 0.9, 0.2, 0.4, 1.2,
            0.3, 2.3, 1.0, 0.7, 1.0, 0.8, 2.0, 1.2, 1.4, 3.7, 2.1, 2.0,
            1.5
        ]
    }],
    navigation: {
        menuItemStyle: {
            fontSize: '10px'
        }
    }
});