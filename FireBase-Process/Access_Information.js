//Access_Information.js
//----------------------------------------------------------------------
//Luke Holland
//22nd December 2020
//----------------------------------------------------------------------
//Function that pulls information from the text file and returns it
//----------------------------------------------------------------------

//Access the file library needed
const fs = require('fs')

//Create a function which does this

const accessInformation = (callback) =>
{
	fs.readFile('test.txt', 'utf-8', (err, data) =>
	{
		//If there's an error, return that error
		if (err)
		{
			return callback(err)
		}
		//if nothing goes back return the callback with the data
		callback(null, data)
	})
}

//Then export the function so it can be used elsewhere
module.exports = accessInformation


