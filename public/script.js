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
const blankBreakChart = document.getElementById('break-chart').getContext('2d')
const blankFocusChart = document.getElementById('focus-chart').getContext('2d')

//const blankDayChart = document.getElementById('day-chart').getContext('2d')

const blankPieChartTen = document.getElementById('pie-chart-10').getContext('2d')
const blankPieChartDay = document.getElementById('pie-chart-day').getContext('2d')

const blankFocusWeek = document.getElementById('focus-time-week-chart').getContext('2d')
const blankMouseWeek = document.getElementById('mouse-week-chart').getContext('2d')
const blankKeysWeek = document.getElementById('keys-week-chart').getContext('2d')
const blankStartTimeWeek = document.getElementById('startTime-week-chart').getContext('2d')

const blankFocusMouseChart = document.getElementById('focus-mouse-chart').getContext('2d')
const blankFocusKeysChart = document.getElementById('focus-keys-chart').getContext('2d')
const blankFocusScrollChart = document.getElementById('focus-scroll-chart').getContext('2d')
const blankCulFocusTimeChart = document.getElementById('cul-focus-time-chart').getContext('2d')


//create a template for each of the charts (scatter 7am - 22pm)

function chartTemplateCreation(InputLabel, yLabel, color)
{
	const chartTemplate = {

		type: 'scatter',
		data: {
			datasets: [{
				label: InputLabel,
				data: [],
				backgroundColor: color
			}]
		},
		options: {
			legend: {
				display: true
			},
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				xAxes:[{
						ticks: {
							suggestedMin: 7,
							suggestedMax: 22
						},
						scaleLabel: {
							display : true,
							labelString: 'Time (NB - time is decimal)'
						}
					}],
				yAxes: [{
					scaleLabel: {
						display : true,
						labelString: yLabel
					}
				}]
			}
		}
	}
	return chartTemplate
}

function chartComparisonTemplate(yLabel, xlabel, color, line)
{
	const chartCompTemplate = {

		type: 'scatter',
		data: {
			datasets: [{
				data: [],
				backgroundColor: color,
				showLine : line
			}]
		},
		options: {
			legend: {
				display: false
			},
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				xAxes:[{
						scaleLabel: {
							display : true,
							labelString: xlabel
						}
					}],
				yAxes: [{
					scaleLabel: {
						display : true,
						labelString: yLabel
					}
				}]
			}
		}
	}
	return chartCompTemplate
}

function barChartTemplateCreation(yLabel, color)
{
	const barChartTemplate = {

		type: 'bar',
		data: {
			datasets: [{
				label: [],
				data: [],
				backgroundColor: color
			}]
		},
		options: {
			legend: {
				display: false
			},
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				xAxes:[{
						scaleLabel: {
							display : true,
							labelString: 'Last 5 days'
						}
					}],
				yAxes: [{
					scaleLabel: {
						display : true,
						labelString: yLabel
					}
				}]
			}
		}
	}
	return barChartTemplate
}

const breakChartTemplate = {

		type: 'scatter',
		data:
		{
			labels: [],
			datasets: [{
				label: "Sitting",
				fill: true,
				lineTension: 0.1,
				backgroundColor: "rgba(0,255,0,0.4)",
				borderColor: "green", // The main line color
				// notice the gap in the data and the spanGaps: true
				data: [],
				spanGaps: true
				}]
		},
		options: {
			legend: {
				display: true
			},
			bezierCurve: false,
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				xAxes: [{
					ticks: {
						suggestedMin: 7,
						suggestedMax: 22
					},
					scaleLabel: {
						display : true,
						labelString: 'Time (NB - time is decimal)'
					}
				}],
				yAxes: [{
					scaleLabel: {
						display : true,
						labelString: 'Sitting (value of 1=sitting, 0=empty chair'
					}
				}]
			}
		}
};


//function pieChartTemplateCreation(chartTitle)
//{ 
const pieChartTemplateDay = {
	
	type:'pie',
	data: 
	{
		labels: ["Focused", "Unfocused"],
		datasets: 
		[{
			fill: true,
			data:[],
			borderColor: ['black','black'],
			backgroundColor:["green","red"]
		}]
	},
	options: 
	{
		title:
		{
			display: true,
			text: 'Focus ratio for today',
			position: 'top'
		}
	}
}

const pieChartTemplateTen = {
	
	type:'pie',
	data: 
	{
		labels: ["Focused", "Unfocused"],
		datasets: 
		[{
			fill: true,
			data:[],
			borderColor: ['black','black'],
			backgroundColor:["green","red"]
		}]
	},
	options: 
	{
		title:
		{
			display: true,
			text: 'Focus in the last 10 mins',
			position: 'top'
		}
	}
}
//}
	

//create the charts
const mouseChart = new Chart(blankMouseChart,chartTemplateCreation('mouse', 'Metres moved by cursor every 10mins', 'rgb(177,156,217,0.4)'))

const keysChart = new Chart(blankKeysChart, chartTemplateCreation('keys', 'Number of keys pressed every 10mins', 'rgb(255,255,51,0.4)'))

const scrollChart = new Chart(blankScrollChart, chartTemplateCreation('scroll', 'Metres moved by scrolling every 10mins', 'rgb(153,253,51,0.4)'))

const focusChart = new Chart(blankFocusChart, chartTemplateCreation('focus', 'Number of minutes focused in every 10mins', 'rgb(135,206,235,0.4)'))

const breakChart = new Chart(blankBreakChart, breakChartTemplate)

const pieChartDay = new Chart(blankPieChartDay, pieChartTemplateDay)

const pieChartTen = new Chart(blankPieChartTen, pieChartTemplateTen)

const focusedTimeWeekChart = new Chart(blankFocusWeek, barChartTemplateCreation('Total minutes of focused work', 'rgb(135,206,235,0.4)'))

const keysWeekChart = new Chart(blankKeysWeek, barChartTemplateCreation('Total keys and mouse clicks', 'rgb(255,255,51,0.4)'))

const mouseWeekChart = new Chart(blankMouseWeek, barChartTemplateCreation('Total metresmoved by the cursor', 'rgb(177,156,217,0.4)'))

const startTimeWeekChart = new Chart(blankStartTimeWeek, barChartTemplateCreation('Work startTime', 'rgb(255,153,51,0.4)'))


const focusMouseChart = new Chart(blankFocusMouseChart, chartComparisonTemplate('Metres moved by cursor in 10 mins','Minutes of focus in 10 mins',  'rgb(177,156,217,1)',false))

const focusKeysChart = new Chart(blankFocusKeysChart, chartComparisonTemplate('Number of keys pressed in 10 mins','Minutes of focus in 10 mins', 'rgb(255,255,51,1)',false))

const focusScrollChart = new Chart(blankFocusScrollChart, chartComparisonTemplate('NUmber of metres scrolled in 10 mins','Minutes of focus in 10 mins', 'rgb(153,253,51,1)',false))

const culFocusTimeChart = new Chart(blankCulFocusTimeChart, chartComparisonTemplate('Culmalative minutes of focus over last 7 days', 'Time (24hr and decimal time)', 'rgb(135,206,235,1)',false))

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
const dataRefFullDay = firebase.database().ref(date + "/full_day/")
var data = {}

const dataRefStartTime = firebase.database().ref(date + "/startTime/")
const dataRefConstants = firebase.database().ref(date + "/constants/")


//Gets the html ref
const mouseDisplay = document.getElementById('mouse-display')
const keysDisplay = document.getElementById('keys-display')
const scrollDisplay = document.getElementById('scroll-display')
const startTimeDisplay = document.getElementById('start-time')
const userStateDisplay = document.getElementById('user-state')
const currentTimeDisplay = document.getElementById('current-time')
const focusedMinutes = document.getElementById('focused-minutes')
const numberBreaks = document.getElementById('number-breaks')

dataRefStartTime.on('value',snap => 
{
	var newData = snap.val();
	startTimeDisplay.innerHTML = newData.startTime
})

dataRefConstants.on('value',snap => 
{
	var newData = snap.val();
	currentTimeDisplay.innerHTML = newData.currentTime
	var sittingState = newData.present
	if (sittingState == "Sitting_In_Chair")
	{
		userStateDisplay.innerHTML = "Sitting at the desk"
	}
	else
	{
		userStateDisplay.innerHTML = "Away from the desk"
	}
})

//gather the data and push to the HTML for the constnt 
dataRefFullDay.on('value',snap => 
{
	var newData = snap.val();
	mouseDisplay.innerHTML = newData.Mouse.toFixed(1) + " m"
	keysDisplay.innerHTML = newData.Keys
	scrollDisplay.innerHTML = newData.Scroll.toFixed(1) + " m"
	
	var focusedTime = newData.FocusedTime
	var hours = Math.floor(focusedTime/60)
	var minutes = (((focusedTime/60)-hours)*60).toFixed(0)
	if(minutes < 10)
	{
		minutes = '0' + minutes
	}
	
	
	focusedMinutes.innerHTML = hours + ':' + minutes
	
	var unFocused = newData.NonFocusedTime
	var focused = newData.FocusedTime
	
	var AdjUnFocused = (100*(unFocused/(unFocused+focused))).toFixed(1)
	var AdjFocused = (100*(focused/(unFocused+focused))).toFixed(1)
	
	
	var pieChartData = [AdjFocused, AdjUnFocused]
	
	pieChartDay.data.datasets.forEach((dataset) =>
	{
		dataset.data = pieChartData;
	});
	pieChartDay.update();
})

//initially adds all the historic data

const dataRefTenMin = firebase.database().ref(date + "/10min_culmalative/")


//this adds data everytime its added
dataRefTenMin.on("child_added", function(data)
{
	var newData = data.val()
	var decTime = newData.decTime

	addDataScatter(mouseChart,newData.decTime, newData.mouse)
	addDataScatter(scrollChart,newData.decTime, newData.scroll)
	addDataScatter(keysChart,newData.decTime, newData.keys)
	
	//now update the piechart
	//correct the vlaues for potential erros - slight cheat here ;)
	var unFocused = newData.nonFocusedPercent
	var focused = newData.focusedPercent

	var AdjUnFocused = (100*(unFocused/(unFocused+focused))).toFixed(1)
	var AdjFocused = (100*(focused/(unFocused+focused))).toFixed(1)
	
	var focusMins = ((AdjFocused/100)*10).toFixed(1)
	addDataScatter(focusChart,newData.decTime,focusMins)
	
	var pieChartData = [AdjFocused, AdjUnFocused]
	
	pieChartTen.data.datasets.forEach((dataset) =>
	{
		dataset.data = pieChartData;
	});
	pieChartTen.update();
	
})


		
//add the break data for the initial push
const dataRefChairState = firebase.database().ref(date + "/chairState/")


var count = 0;
//this adds data everytime its added
dataRefChairState.on("child_added", function(data)
{
	count++;
	var numBreaks = Math.floor(count/4)
	
	
	numberBreaks.innerHTML = numBreaks
	
	var chairData = data.val()
	var time = chairData.decTime
	var value = chairData.Sitting
	
	addDataScatter(breakChart, time, value)
})

const dataRefWeek = firebase.database().ref()

dataRefWeek.once("value").then(function(snapshot)
{
	//access todays date
	//massive bug - this will only work in Jan!!!
	const now = new Date()
	var today = (now.getDate())
	var oldDate = snapshot.val()
	
	//compare the last 5 days
	startDay = today - 4
	var labelsWeek = []
	var focusTimeWeek = []
	var mouseWeek =[]
	var keysWeek = []
	var startTimeWeek = []
	var aveFocusTime = {}
	
	for (i=0; i<5;i++)
	{
		var day = (startDay + i) + '-1'
		labelsWeek.push(day)
		focusTimeWeek.push((oldDate[day]["full_day"]["FocusedTime"])/60)
		mouseWeek.push(oldDate[day]["full_day"]["Mouse"])
		keysWeek.push(oldDate[day]["full_day"]["Keys"])
		var startHour = ((oldDate[day]["startTime"]["startTime"]).split(":"))[0]/1
		var startMin = ((oldDate[day]["startTime"]["startTime"]).split(":"))[1]/60
		startTimeWeek.push(startHour + startMin)
		addData(focusedTimeWeekChart, day, ((oldDate[day]["full_day"]["FocusedTime"])/60))
		addData(keysWeekChart, day, oldDate[day]["full_day"]["Keys"])
		addData(mouseWeekChart, day, oldDate[day]["full_day"]["Mouse"])
		addData(startTimeWeekChart, day, (startHour + startMin))
		
		//then do the comparative scores
		var tenMinCuls = oldDate[day]["10min_culmalative"]
		for (var key in tenMinCuls)
		{
			if (tenMinCuls.hasOwnProperty(key))
			{
				var focus = (tenMinCuls[key]["focusedPercent"]/100)*10 //minutes unit
				if (focus > 10)
				{
					focus = 10
					//check for mistakes
				}
				var mouse = tenMinCuls[key]["mouse"]
				var keys = tenMinCuls[key]["keys"]
				var scroll = tenMinCuls[key]["scroll"]
				var decTime = tenMinCuls[key]["decTime"]
				var decTimeStr = decTime.toString()
				
				if (aveFocusTime.hasOwnProperty(decTimeStr))
				{
					aveFocusTime[decTimeStr].culFocus += focus
					aveFocusTime[decTimeStr].count += 1
					//aveFocusTime.decTime.culFocus += focus
					//aveFocusTime.decTime.count += 1
				}
				else
				{
					aveFocusTime[decTimeStr] = {"culFocus":focus, "count" : 1}
					//aveFocusTime.push({{"decTime" : decTime}, {"culFocus" : focus, "count" : 1})
					//aveFocusTime.decTime.culFocus = focus
					//aveFocusTime.decTime.count = 1
				}
				
				addDataScatter(focusMouseChart, focus, mouse)
				addDataScatter(focusKeysChart, focus, keys)
				addDataScatter(focusScrollChart, focus, scroll)
				
			}
				
		}
		

	}
	
	
	for (var dT in aveFocusTime)
	{
		dTstr = dT.toString()
		if (aveFocusTime.hasOwnProperty(dTstr))
		{
			addDataScatter(culFocusTimeChart, dT, (aveFocusTime[dTstr].culFocus/aveFocusTime[dTstr].count))
		}
	}

	
})
		
		
	
