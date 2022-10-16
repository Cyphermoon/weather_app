function formatTime(time) {
    if (time < 10) return `0${time}`;
    return time
}

function displayDate(date) {
    return date;
}

function getCurrentDate() {
    const instance_time = document.querySelector("p.instance_time");

    let currentDate = new Date()
    let minutes = formatTime(currentDate.getMinutes());
    let hours = formatTime(currentDate.getHours());

    let formattedDate = `${hours}:${minutes}`;
    instance_time.textContent = formattedDate;
}

window.addEventListener("load", (e) => {
    //Getting values from the dom
    const main_container = document.querySelector("#main_container");
    const user_input = document.querySelector("form.user_input_form")
    const instance_state = document.querySelector("h3.instance_state");
    const weather_details = document.querySelector("ul.weather_details");
    const temp_value = document.querySelector("p.temp_value")
    const weather_icon = document.querySelector("img.weather_icon");
    const weather_icon_description = document.querySelector("strong.weather_icon_description");
    const CELSUIS = "c";


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude
            let long = position.coords.longitude

            let apiKey = "YOUR_API_KEY"
            let proxy = "https://cors-anywhere.herokuapp.com/"
            let apiUrl = `${proxy}api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}`

            //User_input
            user_input.addEventListener("submit", (e) => {
                e.preventDefault();
                const user_input = e.target.querySelector("input.user_input");

                let cityName = user_input.value;
                let countryUrl = `${proxy}api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`

                fetch(countryUrl)
                    .then((res) => {
                        if (res.ok) return res.json();
                        else console.log("Something is wrong")
                    })
                    .then((data) => {
                        displayCountryData(data);
                    })
                    .catch((e) => { throw new Error(e) })

                user_input.value = "";
                function displayCountryData(data) {
                    let { name, main, wind, sys, weather } = data;
                    let icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
                    let humidity = main.humidity;
                    let pressure = main.pressure;
                    let windSpeed = Math.round(wind.speed * 3.6);
                    let temperature = Math.round(main.temp - 273.15);

                    let instance = document.querySelector("section.api_country")

                    instance.innerHTML =
                        `<div class="container spacing">
                    <div class="row1 row">
                        <div class="state_container">
                            <p class="instance_time"></p>
                            <h3 class="instance_state">${name}</h3>
                        </div>

                        <div class="icon_container">
                            <img src="${icon}" alt="wearther_icon" class="weather_icon">
                            <strong class="weather_icon_description">${weather[0].description}</strong>
                        </div>
                    </div>

                    <div class="row2 row">
                        <ul class="weather_details">
                            <li>Humidity:<span>${humidity}%</span></li>
                            <li>pressure:<span>${pressure} hPa</span></li>
                            <li>Wind:<span>${windSpeed}km/h</span></li>
                        </ul>

                        <div class="temperature">
                            <p class="temp_value">${temperature}</p> <sup class="temp_unit">c</sup>
                        </div>
                </div>
                </div>`
                    instance.classList.remove("hidden")
                    setTemperatrue()
                }
            })


            //Displaying default country
            fetch(apiUrl)
                .then((res) => {
                    if (res.ok) return res.json();
                    else console.log("something went wrond")
                })
                .then((data) => {
                    displayData(data)
                })
                .catch((e) => { throw new Error(e) })
        })

        //Callback function
        function displayData(data) {
            let { name, main, wind, sys, weather } = data;
            let icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
            let humidity = main.humidity;
            let pressure = main.pressure;
            let windSpeed = Math.round(wind.speed * 3.6);
            let temperature = Math.round(main.temp - 273.15)

            setInterval(getCurrentDate, 1000);

            instance_state.textContent = name;

            weather_details.innerHTML = `
                <ul class="weather_details">
                    <li>Humidity:<span>${humidity}%</span></li>
                    <li>pressure:<span>${pressure}hPa</span></li>
                    <li>Wind:<span>${windSpeed}km/h</span></li>
                </ul>
                `

            temp_value.textContent = temperature
            weather_icon_description.textContent = weather[0].description;
            weather_icon.setAttribute("src", icon);
            setTemperatrue()
        }


        function setTemperatrue() {
            const temperature_container = document.querySelectorAll("div.temperature");

            for (let i = 0; i < temperature_container.length; i++) {
                temperature_container[i].addEventListener("click", (e) => {
                    const current_temp_value = temperature_container[i].querySelector("p.temp_value")
                    const current_temp_unit = temperature_container[i].querySelector("sup.temp_unit")

                    if (current_temp_unit.textContent.toLowerCase() === CELSUIS) {
                        current_temp_unit.textContent = "F"
                        current_temp_value.textContent = Math.round(celsiusToFahrenheit(parseInt(current_temp_value.textContent)))

                    }

                    else {
                        current_temp_unit.textContent = "C"
                        current_temp_value.textContent = Math.round(fahrenheitToCelsius(parseInt(current_temp_value.textContent)))
                    }
                })
            }
        }
    }


    // Utility Functions 
    function celsiusToFahrenheit(temperature) {
        console.log(temperature + " from celsuis to fahrenheit")
        return ((temperature * 9) / 5) + 32;
    }

    function fahrenheitToCelsius(temperature) {
        console.log(temperature + " from fahrenheit to celsiurs")
        return (temperature - 32) * .5556
    }
})

