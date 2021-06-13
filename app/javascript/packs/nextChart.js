// // $.ajax({
// //     url: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json',
// //     dataType: 'json',
// //     success:function(result){
// //         console.log(result)
// //     },
// //     error: function(xhr, status, error) {
// //         console.log(error)
// //     }
// // });

// // function to create dates in format needed for weather url and generate url
// const todaysDate = () => {
//     const today = new Date();
//     const year = today.getFullYear().toString();
//     let day = today.getDate().toString();
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

// const startingDate = () => {
//     const today = new Date();
//     const year = today.getFullYear().toString();
//     let day = today.getDate().toString();
//     if (day.length === 1) {
//         day.padStart(2, "0")
//     }
//     let newMonth;
//     const pastMonth = ((today.getMonth()+1) - 2).toString()
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

// const backlogDataURL = "https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=7b0d30e53a61466396e150128211106&q=30.404251,-97.849442&date=" + startingDate() + "&enddate=" + todaysDate() + "&tp=3&data=weathertp=1&&format=json"

// console.log(backlogDataURL)

// $.ajax({
//     type: "GET",
//     url: backlogDataURL,
//     success: function(result) {
//         let detailChart;

//         // create the detail chart
//         function createDetail(result) {
//             // prepare the detail chart
//             var detailData = [];
//             var weatherData = result.data.weather;

            
//             weatherData.forEach(day => {
//                 let weatherDetail = [];
//                 let day = day.date
//                 weatherData.hourly.forEach(temp => {
//                     weatherDetail.push(day);
//                     weatherDetail.push(temp.tempF);
//                 });
//                 detailData.push(weatherDetail)
//             })

//             // create a detail chart referenced by a global variable
//             detailChart = Highcharts.chart('detail-container', {
//                 chart: {
//                     marginBottom: 120,
//                     reflow: false,
//                     marginLeft: 50,
//                     marginRight: 20,
//                     style: {
//                         position: 'absolute'
//                     }
//                 },
//                 credits: {
//                     enabled: false
//                 },
//                 title: {
//                     text: 'Historical USD to EUR Exchange Rate',
//                     align: 'left'
//                 },
//                 subtitle: {
//                     text: 'Select an area by dragging across the lower chart',
//                     align: 'left'
//                 },
//                 xAxis: {
//                     type: 'datetime'
//                 },
//                 yAxis: {
//                     title: {
//                         text: null
//                     },
//                     maxZoom: 0.1
//                 },
//                 tooltip: {
//                     formatter: function () {
//                         var point = this.points[0];
//                         return '<b>' + point.series.name + '</b><br/>' + Highcharts.dateFormat('%A %B %e %Y', this.x) + ':<br/>' +
//                             '1 USD = ' + Highcharts.numberFormat(point.y, 2) + ' EUR';
//                     },
//                     shared: true
//                 },
//                 legend: {
//                     enabled: false
//                 },
//                 plotOptions: {
//                     series: {
//                         marker: {
//                             enabled: false,
//                             states: {
//                                 hover: {
//                                     enabled: true,
//                                     radius: 3
//                                 }
//                             }
//                         }
//                     }
//                 },
//                 series: [{
//                     name: 'USD to EUR',
//                     pointStart: detailStart,
//                     pointInterval: 24 * 3600 * 1000,
//                     data: detailData
//                 }],

//                 exporting: {
//                     enabled: false
//                 }

//             }); // return chart
//         }

//         // create the master chart
//         function createMaster() {
//             Highcharts.chart('master-container', {
//                 chart: {
//                     reflow: false,
//                     borderWidth: 0,
//                     backgroundColor: null,
//                     marginLeft: 50,
//                     marginRight: 20,
//                     zoomType: 'x',
//                     events: {

//                         // listen to the selection event on the master chart to update the
//                         // extremes of the detail chart
//                         selection: function (event) {
//                             var extremesObject = event.xAxis[0],
//                                 min = extremesObject.min,
//                                 max = extremesObject.max,
//                                 detailData = [],
//                                 xAxis = this.xAxis[0];

//                             // reverse engineer the last part of the data
//                             this.series[0].data.forEach(point => {
//                                 if (point.x > min && point.x < max) {
//                                     detailData.push([point.x, point.y]);
//                                 }
//                             });

//                             // move the plot bands to reflect the new detail span
//                             xAxis.removePlotBand('mask-before');
//                             xAxis.addPlotBand({
//                                 id: 'mask-before',
//                                 from: data[0][0],
//                                 to: min,
//                                 color: 'rgba(0, 0, 0, 0.2)'
//                             });

//                             xAxis.removePlotBand('mask-after');
//                             xAxis.addPlotBand({
//                                 id: 'mask-after',
//                                 from: max,
//                                 to: data[data.length - 1][0],
//                                 color: 'rgba(0, 0, 0, 0.2)'
//                             });


//                             detailChart.series[0].setData(detailData);

//                             return false;
//                         }
//                     }
//                 },
//                 title: {
//                     text: null
//                 },
//                 accessibility: {
//                     enabled: false
//                 },
//                 xAxis: {
//                     type: 'datetime',
//                     showLastTickLabel: true,
//                     maxZoom: 14 * 24 * 3600000, // fourteen days
//                     plotBands: [{
//                         id: 'mask-before',
//                         from: data[0][0],
//                         to: data[data.length - 1][0],
//                         color: 'rgba(0, 0, 0, 0.2)'
//                     }],
//                     title: {
//                         text: null
//                     }
//                 },
//                 yAxis: {
//                     gridLineWidth: 0,
//                     labels: {
//                         enabled: false
//                     },
//                     title: {
//                         text: null
//                     },
//                     min: 0.6,
//                     showFirstLabel: false
//                 },
//                 tooltip: {
//                     formatter: function () {
//                         return false;
//                     }
//                 },
//                 legend: {
//                     enabled: false
//                 },
//                 credits: {
//                     enabled: false
//                 },
//                 plotOptions: {
//                     series: {
//                         fillColor: {
//                             linearGradient: [0, 0, 0, 70],
//                             stops: [
//                                 [0, Highcharts.getOptions().colors[0]],
//                                 [1, 'rgba(255,255,255,0)']
//                             ]
//                         },
//                         lineWidth: 1,
//                         marker: {
//                             enabled: false
//                         },
//                         shadow: false,
//                         states: {
//                             hover: {
//                                 lineWidth: 1
//                             }
//                         },
//                         enableMouseTracking: false
//                     }
//                 },

//                 series: [{
//                     type: 'area',
//                     name: 'USD to EUR',
//                     pointInterval: 24 * 3600 * 1000,
//                     pointStart: data[0][0],
//                     data: data
//                 }],

//                 exporting: {
//                     enabled: false
//                 }

//             }, result => {
//                 createDetail(result);
//             }); // return chart instance
//         }

//         // make the container smaller and add a second container for the master chart
//         const container = document.getElementById('container');
//         container.style.position = 'relative';
//         container.innerHTML += '<div id="detail-container"></div><div id="master-container"></div>';

//         // create master and in its callback, create the detail chart
//         createMaster();
//     },
//     error: function(xhr, status, error) {
//         console.log(error)
//     }
// });
