"use strict"

/*setting ajaxRequest variable equal to a new object from the constructor function XMLHttpRequest()*/
let ajaxRequest = new XMLHttpRequest();

/*Defining variables for AJAXrequest call*/
let date = document.getElementById("date");
let latPopulate = document.getElementById("latPopulate");
let lngPopulate = document.getElementById("lngPopulate");
let btn = document.getElementById("btn");
let sunrisePara = document.getElementById("sunrisePara");
let sunsetPara = document.getElementById("sunsetPara");
let sunriseContainer = document.getElementById("sunriseContainer");
let sunsetContainer = document.getElementById("sunsetContainer");
let cityInput = document.getElementById("cityInput");
let stateInput = document.getElementById("stateInput");
let stateContainer = document.getElementById("stateContainer");
let yesSunset = document.getElementById("yesSunset");
let sunsetYesNoContainer = document.getElementById("sunsetYesNoContainer");
let btnReset = document.getElementById("btnReset");
let commentPara = document.getElementById("commentPara");

/*Setting an EventListener to radio button yes, that when the "yes" radio button is selected, the button name changes.*/
yesSunset.addEventListener("click", function() {
  if(yesSunset.checked == true) {
    btn.innerHTML = "See time of sunrise and sunset";
  }
});
/*Setting an EventListener to radio button no, that when the "no" radio button is selected, the button name changes.*/
noSunset.addEventListener("click", function() {
    btn.innerHTML = "See time of sunrise";
})

/*Set addEventListener, so that when click button to see sunrise or sunrise and sunset times, the function declaration "load" is called. */
btn.addEventListener("click", load);

/*Set a function declaration called load. In this function we target the onreadystatechange method found in the new object we created called ajaxRequest. Within this method, we check what the readyState property value is, and based on this value, determines whether we have received the file or not.We also log out the status to confirm the file was successfully loaded, and the data is ready to use. */
function load() {
  ajaxRequest.onreadystatechange = function() {
    if(ajaxRequest.readyState == 1) {
      console.log("connected to server");
    }
    else if(ajaxRequest.readyState == 2) {
      console.log("request received");
    }
    else if(ajaxRequest.readyState == 3) {
      console.log("response received");
    }
    else if(ajaxRequest.readyState == 4) {
      console.log("data received");
      console.log(ajaxRequest.status);
      let data = JSON.parse(ajaxRequest.response);
      let sunriseText = document.createTextNode(data.results.sunrise);
      sunrisePara.innerHTML = ""; /*Set paragraph in HTML set equal to an empty string, so that our answer does not stack on top of each other. We want only one anser to display for time of sunrise.*/
      sunrisePara.appendChild(sunriseText);

      /*Next, we add an event listener: When a user clicks the "see sunrise time" or "see sunrise and sunset times" button, if the yes sunset radio button is selected, we display the sunset time; else, we do not display the sunset time, and only display the sunrise time.*/
      btn.addEventListener("click", function() {
        if(yesSunset.checked == true) {
          let sunsetText = document.createTextNode(data.results.sunset);
          sunsetPara.innerHTML = "";
          sunsetPara.appendChild(sunsetText);
        }
        else if (yesSunset.checked == false) {
          sunsetPara.innerHTML= "";
        }
      });
    }
    else {
      console.log("oops! Something went wrong");
    }
  }
  ajaxRequest.open("GET", "https://api.sunrise-sunset.org/json?lat=" + latPopulate.value + "&lng=" + lngPopulate.value + "&date=" + date.value);
  ajaxRequest.send();
  console.log(date.value);
}

/*We have created a second AJAX call, where when the user enters a city and state, the latitude and longitude autopopulate.*/
let locAjaxRequest = new XMLHttpRequest();

stateInput.addEventListener("blur", locload);

function locload() {
  locAjaxRequest.onreadystatechange = function() {
    if(locAjaxRequest.readyState == 1) {
      console.log("connected to server");
    }
    else if(locAjaxRequest.readyState == 2) {
      console.log("request received");
    }
    else if(locAjaxRequest.readyState == 3) {
      console.log("response received");
    }
    else if(locAjaxRequest.readyState == 4) {
      console.log("data received");
      console.log(locAjaxRequest.status);
      let locdata = JSON.parse(locAjaxRequest.response);
      console.log(locdata); /*Get rid of*/
      let latPara = document.createElement("p");
      let lngPara = document.createElement("p");
      let latText = document.createTextNode(locdata.results[0].geometry.location.lat);
      let lngText = document.createTextNode(locdata.results[0].geometry.location.lng);

      latPopulate.value = latText.nodeValue;
      lngPopulate.value = lngText.nodeValue;

      /*This event listener grays out city and state input elements after the user clicks on the button.*/
      btn.addEventListener("click", function() {
        cityInput.setAttribute("readonly", true);
        cityInput.style.backgroundColor = "#989898";
        stateInput.setAttribute("disabled", true);
        commentPara.innerHTML = 'Select a new date for your chosen City and State, and then reclick the "See time" button below, or select the reset button to start over.'
      });

      /*This event listener returns input elements to their page load and reload formats when the reset button is selected.*/
      btnReset.addEventListener("click",function() {
         cityInput.readOnly = false;
         cityInput.style.backgroundColor = "white";
         stateInput.disabled = false;
         stateInput.style.backgroundColor = "white";
         btn.innerHTML = "See time of sunrise";
         commentPara.innerHTML = "";
     });
   }
    else {
      console.log("oops! Something went wrong");
    }
  }
  locAjaxRequest.open("GET", "https://maps.googleapis.com/maps/api/geocode/json?address=" + cityInput.value + "," + stateInput.value + "&key=AIzaSyAoZUVaz-SRIoOYulECllMb9Yx4M4xjFHI");
  locAjaxRequest.send();
}