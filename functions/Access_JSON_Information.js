//Access_JSON_Information.js
//----------------------------------------------------------------------
//Luke Holland
//22nd December 2020
//----------------------------------------------------------------------
//Function that pulls information from the text file and returns it
//----------------------------------------------------------------------

//Access the file library needed
const fs = require('fs')

//Create a function which does this

const accessJSONInformation = (callback) =>
{
	fs.readFile('CombinedData.json', (err, data, time) =>
	{
		//If there's an error, return that error
		if (err)
		{
			return callback(err)
		}
		data = JSON.parse(data)
		const now = new Date().getTime()
		callback(null, data, now)
	})
}

//Then export the function so it can be used elsewhere
module.exports = accessJSONInformation


