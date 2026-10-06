const dateFormattedET = function(monthType){
    let timeNow = new Date();
    let dateNow = timeNow.getDate();
    let monthNow = timeNow.getMonth();
    let yearNow = timeNow.getFullYear();
	
    const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
    const folkMonthNamesET = ["näärikuu", "küünlakuu", "paastukuu", "jürikuu", "lehekuu", "jaanikuu", "heinakuu", "lõikuskuu", "mihklikuu", "viinakuu", "talvekuu", "jõulukuu"];
    let monthName;
    if(monthType == 1){
        monthName = folkMonthNamesET[monthNow];
    } else {
        monthName = monthNamesET[monthNow];
    }
    return dateNow + ". " + monthName + " " + yearNow;
}

const weekDayET = function(){
    let timeNow = new Date();
    let dayNow = timeNow.getDay();
    const dayNamesET = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"];
    return dayNamesET[dayNow];
}

const addLeadZero = function(numValue){
    if(numValue < 10){
        numValue = "0" + numValue;
    }
    return numValue;
}

const timeFormattedET = function(){
    let timeNow = new Date();
    let hourNow = timeNow.getHours();
    let minuteNow = timeNow.getMinutes();
    let secondNow = timeNow.getSeconds();
    let timeFormatted = hourNow + ":" + addLeadZero(minuteNow) + ":" + addLeadZero(secondNow);
    return timeFormatted;
}

//ekspordin kõik vajalikud funktsioonid koos mugavamate nimedega
module.exports = {time: timeFormattedET, date: dateFormattedET, weekDay: weekDayET};