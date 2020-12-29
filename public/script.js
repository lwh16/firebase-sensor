//script.js
//----------------------------------------------------------------------
//Luke Holland
//23rd December 2020
//----------------------------------------------------------------------
//This script will fetch the text file data from client-side javascript.
//It uses a fetch API
//This version is for deployment on firebase in particular
//Hence the contents of the API invoking functions have been removed
//----------------------------------------------------------------------

//Set the first promise in a function
const fetchData = () =>
{
	//content removed for firebase deployment
}

const fetchDataHistory = () =>
{
	//content removed for firebase deployment
}

function getParameterByName (name)
{
	//pulled from tutorial
	const url = window.location.href
	name = name.replace(/[\[\]]/g, '\\$&')
	const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
	const results = regex.exec(url)
	if (!results) 
		return null
	if (!results[2]) 
		return ''
	return decodeURIComponent(results[2].replace(/\+/g, ''))
}

const fetchDataRange = () =>
{
	//content removed for firebase deployment
}

const pushData = (arr, value, maxLen) =>
{
	arr.push(value)
	
	if (arr.length > maxLen)
	{
		arr.shift()
	}
}


const temperatureCanvasCtx = document.getElementById('temperature-chart').getContext('2d')

/**
* Create a new chart on the context we just instantiated
*/
const dataChartConfig = new Chart(temperatureCanvasCtx,
{

	type: 'line',
	data: {

		labels: [],
		datasets: [{
		  data: [],
		  backgroundColor: 'rgba(255, 205, 210, 0.5)'
		}]
	},
	options: {
		legend: {
			display: false
		},
		responsive: true,
		maintainAspectRatio: false,

		scales: {
			yAxes: [{
				ticks: {
					suggestedMin: 0,
					suggestedMax: 100
				}
			}]
		}
	}
})

if (!getParameterByName('start') && !getParameterByName('end'))
{
	setInterval(() =>
	{
		fetchData()
	},2000)
	fetchDataHistory()
}

else
{
	fetchDataRange()
}

    /**
     * Initialize a new database with the firebase.database 
    constructor
     */
    const database = firebase.database()

    /**
     * database.ref returns a reference to a key in the 
    realtime database.
     * This reference comes with a listener to read the value 
    for the first time, and execute some action everytime a 
    value is received
     */
    const temperatureListener = database.ref('temperature')

    temperatureListener.on('value', data => {
      /**
       * The contents of the listener are pretty much the
     same as the listeners in our previous chapters. The only     difference being that the value
       * of the data being read has to be accessed through     the "val" getter method,
       * rather than the data.value attribute
       */
      const now = new Date()
      const timeNow =
      now.getHours() + ':' + now.getMinutes() + ':' + 
    now.getSeconds()
      pushData(temperatureChartConfig.data.labels, timeNow,     10)
      pushData(temperatureChartConfig.data.datasets[0].data,     data.val(), 10)
      temperatureChart.update()
      temperatureDisplay.innerHTML = '<strong>' + data.val() 
    + '</strong>'
    })

    /**
     * Similarly, we add the corresponding references and     listeners for humidity
     */
    const humidityListener = database.ref('humidity')

    humidityListener.on('value', data => {
      const now = new Date()
      const timeNow =
      now.getHours() + ':' + now.getMinutes() + ':' +     now.getSeconds()
      pushData(humidityChartConfig.data.labels, timeNow, 10)
      pushData(humidityChartConfig.data.datasets[0].data,     data.val(), 10)
      humidityChart.update()
      humidityDisplay.innerHTML = '<strong>' + data.val() +     '</strong>'
    })


	
	
