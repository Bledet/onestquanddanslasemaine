// Obtenir la date et le jour actuels
const date = new Date();
const day = date.getDay();
const hour = date.getHours();
const minutes = date.getMinutes();

// Ajouter le préfixe approprié en fonction de l'heure actuelle
let prefix = "";
if (hour >= 0 && hour < 12) {
	prefix = "C'est le début ";
} else if (hour >= 12 && hour < 14) {
	prefix = "C'est le milieu ";
} else if (hour >= 14 && hour < 24) {
	prefix = "C'est la fin ";
}

// Afficher le message approprié en fonction du jour de la semaine
if (day === 0) {
	document.getElementById("message").innerHTML = prefix + " de la fin du weekend...";
} else if (day === 1) {
	document.getElementById("message").innerHTML = prefix + "du début du début de la semaine.";
} else if (day === 2) {
	document.getElementById("message").innerHTML = prefix + "de la fin du début de la semaine.";
} else if (day === 3) {
	document.getElementById("message").innerHTML = prefix + "du milieu de la semaine.";
} else if (day === 4) {
	document.getElementById("message").innerHTML = prefix + "du début de la fin de la semaine.";
} else if (day === 5) {
	document.getElementById("message").innerHTML = prefix + "de la fin de la fin de la semaine.";
} else if (day === 6) {
	document.getElementById("message").innerHTML = prefix + "du début du weekend.";
}


let latitude;
let longitude;

// navigator.geolocation.getCurrentPosition(function (position) {
//   latitude = position.coords.latitude;
//   longitude = position.coords.longitude;

//   console.log("Latitude : " + latitude + ", longitude : " + longitude);

//   getCityFromCoordinates(latitude, longitude).then((city) => {
// 	console.log("city :", city);
// 	getWeather(city);
//   });
  
// });

async function getCityFromCoordinates(latitude, longitude) {
	try {
	  const response = await fetch(
		`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
	  );
	  const data = await response.json();
  
	  if (data && data.address) {
		// Rechercher les informations sur la ville dans les données de l'adresse
		const city = data.address.city || data.address.town || data.address.village;
  
		if (city) {
		  return city;
		} else {
		  return "City not found";
		}
	  } else {
		return "City not found";
	  }
	} catch (error) {
	  console.error("Error:", error);
	  return "Error retrieving city";
	}
  }

function hourConverter(hour, minutes) {
    if (hour < 8 || hour >= 18) {
        return -300; // Hors de la plage horaire -> cache le curseur
    }

    let percentage;

    if (hour < 12) {
        // Matin (8h-12h) → 0% à 100%
        const totalMinutes = (12 - 8) * 60; // 240 min
        const currentMinutes = (hour - 8) * 60 + minutes;
        percentage = (currentMinutes / totalMinutes) * 100;
    } else if (hour < 14) {
        // Midi (12h-14h) → 0% à 100%
        const totalMinutes = (14 - 12) * 60; // 120 min
        const currentMinutes = (hour - 12) * 60 + minutes;
        percentage = (currentMinutes / totalMinutes) * 100;
    } else {
        // Après-midi (14h-18h) → 0% à 100%
        const totalMinutes = (18 - 14) * 60; // 240 min
        const currentMinutes = (hour - 14) * 60 + minutes;
        percentage = (currentMinutes / totalMinutes) * 100;
    }

    return percentage;
}


function updateCalendar() {

	const position = hourConverter(hour, minutes);

	let cell;

	if (hour < 8 || hour > 18) {
		document.getElementById("avertissement").innerHTML = '(Tu ne devrais pas être là)'
	}

	// Recherche de la cellule correspondante à l'heure et au jour actuel
	switch (day) {
		case 1: // Lundi
			if (hour < 12) {
				cell = document.getElementById('debut-debut-debut');
			} else if (hour >= 12 && hour < 14) {
				cell = document.getElementById('milieu-debut-debut');
			} else if (hour >= 14) {
				cell = document.getElementById('fin-debut-debut');
			}
			break;
		case 2: // Mardi
			if (hour < 12) {
				cell = document.getElementById('debut-fin-debu');
			} else if (hour >= 12 && hour < 14) {
				cell = document.getElementById('milieu-fin-debu');
			} else if (hour >= 14) {
				cell = document.getElementById('fin-fin-debu');
			}
			break;
		case 3: // Mercredi
			if (hour < 12) {
				cell = document.getElementById('debut-milieu');
			} else if (hour >= 12 && hour < 14) {
				cell = document.getElementById('milieu-milieu');
			} else if (hour >= 14) {
				cell = document.getElementById('fin-milieu');
			}
			break;
		case 4: // Jeudi
			if (hour < 12) {
				cell = document.getElementById('debut-debut-fin');
			} else if (hour >= 12 && hour < 14) {
				cell = document.getElementById('milieu-debut-fin');
			} else if (hour >= 14) {
				cell = document.getElementById('fin-debut-fin');
			}
			break;
		case 5: // Vendredi
			if (hour < 12) {
				cell = document.getElementById('debut-fin-fin');
			} else if (hour >= 12 && hour < 14) {
				cell = document.getElementById('milieu-fin-fin');
			} else if (hour >= 14) {
				cell = document.getElementById('fin-fin-fin');
			}
			break;
		case 6: // Samedi
			if (hour < 12) {
				cell = document.getElementById('debut-debut-week');
			} else if (hour >= 12 && hour < 14) {
				cell = document.getElementById('milieu-debut-week');
			} else if (hour >= 14) {
				cell = document.getElementById('fin-debut-week');
			}
			break;
		case 0: // Dimanche
			if (hour < 12) {
				cell = document.getElementById('debut-fin-week');
			} else if (hour >= 12 && hour < 14) {
				cell = document.getElementById('milieu-fin-week');
			} else if (hour >= 14) {
				cell = document.getElementById('fin-fin-week');
			}
			break;
	}
	
	// Ajout de la classe "marker" à la cellule trouvée
	cell.classList.add('marker');
	cell.innerHTML = '<div class="mark-line" style="top:' + position + '%"></div>'
}

async function getWeather() {
    const apiKey = '54d3c3582606489233f6becb813cce57';
    const city = 'Lille';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${apiKey}`;

    try {
        const response = await fetch(url);
		console.log(response);
        const data = await response.json();
		console.log(data);

        const temperature = data.main.temp; // Température en Celsius
        const description = data.weather[0].main.toLowerCase(); // Description de la météo (soleil, nuageux, etc.)

        let absurdDescription = '';
        if (description.includes('sun')) {
            absurdDescription = `La grosse boule de feu brille très fort et tout le monde danse sous ses rayons. Température : ${temperature}°C.`;
        } else if (description.includes('clouds')) {
            absurdDescription = `Amas de petites gouttes d'eau en suspension dans l'air, qui forment des taches grisâtres ou blanches dans le ciel, parfois en masse, parfois dispersées. Température : ${temperature}°C.`;
        } else if (description.includes('rain')) {
            absurdDescription = `Chute de gouttes d'eau mouillées qui descendent du ciel, sans demander la permission, pour rendre tout un peu plus mouillé. Température : ${temperature}°C.`;
        } else if (description.includes('snow')) {
            absurdDescription = `Cristaux de glace très petits qui tombent du ciel très doucement. Température : ${temperature}°C.`;
        } else if (description.includes('clear')) {
            absurdDescription = `Boule de feu visible, sans amas de petites gouttes d'eau flottantes. Température : ${temperature}°C.`;
        } else if (description.includes('drizzle')) {
            absurdDescription = `Petites gouttes d'eau qui tombent lentement du ciel, rendant l'air légèrement humide sans que ce soit vraiment de la pluie. Température : ${temperature}°C.`;
        } else if (description.includes('mist/fog')) {
            absurdDescription = `Petites gouttes d'eau en suspension dans l'air près du sol et même qu'on voit plus rien. Température : ${temperature}°C.`;
        } else if (description.includes('Thunderstorm')) {
            absurdDescription = `Un phénomène où de l'air chaud et humide rencontre de l'air froid, créant des orages accompagnés d'éclairs et de bruits forts venant du ciel. Température : ${temperature}°C.`;
        } else {
            absurdDescription = `La météo semble un peu confuse aujourd'hui. Température : ${temperature}°C.`;
        }

        document.getElementById('weather-description').innerText = absurdDescription;
    } catch (error) {
        console.error('Erreur lors de la récupération de la météo :', error);
    }
}

// setInterval(updateCalendar, 60000);
updateCalendar();
getWeather();
