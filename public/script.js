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

//associate the charts to the html file
const blankMouseChart = document.getElementById('mouse-chart').getContext('2d')
const blankKeysChart = document.getElementById('keys-chart').getContext('2d')
const blankScrollChart = document.getElementById('scroll-chart').getContext('2d')

//create a template for each of the charts (scatter 7am - 22pm)

function chartTemplateCreation(InputLabel)
{
	const chartTemplate = {

		type: 'scatter',
		data: {
			datasets: [{
				label: InputLabel,
				data: [],
				//backgroundColor: 'rgba(255, 205, 210, 0.5)'
			}]
		},
		options: {
			legend: {
				display: true
			},
			responsive: true,
			maintainAspectRatio: false,

			scales: {
				xAxes: [{
					ticks: {
						suggestedMin: 7,
						suggestedMax: 22
					}
				}]
			}
		}
	}
	return chartTemplate
}

//create the charts
const mouseChart = new Chart(blankMouseChart,chartTemplateCreation('mouse'))

const keysChart = new Chart(blankKeysChart, chartTemplateCreation('keys'))

const scrollChart = new Chart(blankScrollChart, chartTemplateCreation('scroll'))



const mouseDisplay = document.getElementById('mouse-display')

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


//The new Firebase functions


function addData(chart, label, data)
{
	chart.data.labels.push(label);
	chart.data.datasets.forEach((dataset) =>
	{
		dataset.data.push(data);
	});
	chart.update();
}

function removeData(chart)
{
	chart.data.datasets.forEach((dataset) =>
	{
		dataset.data.pop()
	})
	chart.update()
}

function addDataScatter(chart, time, value)
{
	//chart.data.labels.push(label);
	chart.data.datasets.forEach((dataset) =>
	{
		dataset.data.push({x:time,y:value})
	})
	chart.update()
}
		


//Plot data from today
const now = new Date()
var date = (now.getDate()).toString() +'-' + (now.getMonth() + 1).toString()
const dataRef = firebase.database().ref(date + "/")
var data = {}

dataRef.on('child_added', function(data, prevChildKey)
{
	var newEntry = data.val()
	var timeFloat = newEntry.time.split(":")
	var hour = parseFloat(timeFloat[0])
	var min = parseFloat(timeFloat[1])/60
	var time = (hour + min).toFixed(2)
	addDataScatter(mouseChart, time, newEntry.mouse)
	addDataScatter(scrollChart, time, newEntry.scroll)
	addDataScatter(keysChart, time, newEntry.keys)
	mouseDisplay.innerHTML = '<strong>' + newEntry.mouse + '</strong>'
})





/*
dataListener.on('value', data =>
{
	const now = new Date()
	const timeNow = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
	
	pushData(dataChartConfig.data.labels, timeNow, 100)
	pushData(dataChartConfig.data.datasets[0].data, data.val(), 100)
	
	dataChartConfig.update()
	
	dataDisplay.innerHTML = '<strong>' + data.val() + '</strong>'
})
*/
