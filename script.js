// Obtenir la date et le jour actuels
const date = new Date();
const day = date.getDay();
const hour = date.getHours();
const minutes = date.getMinutes();
const apiKey = '54d3c3582606489233f6becb813cce57';

const cityButtons = document.querySelectorAll(".local-buttons");

cityButtons.forEach(button => {
	button.addEventListener("click", () => {
		// Supprime la classe active de tous les boutons
		cityButtons.forEach(btn => btn.classList.remove("active"));

		// Ajoute la classe active au bouton cliqué
		button.classList.add("active");
	});
});

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


let latitude = 50.63;
let longitude = 3.06;

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

async function getHourlyWeather(latitude, longitude) {
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,wind_speed_10m,weathercode&timezone=auto`;

	try {
		const response = await fetch(url);
		const data = await response.json();
		const hourly = data.hourly;
		const hourNow = new Date().getHours() + 1;

		console.log('hourNow', hourNow);

		console.log('hourly', JSON.stringify(hourly));

		// Prépare le tableau horaire (10 prochaines heures)
		const tbody = document.getElementById('hourly-weather-body');
		tbody.innerHTML = ""; // reset

		for (let i = hourNow; i < hourNow + 10; i++) {
			const tr = document.createElement('tr');

			// Heure locale simple (HH:MM)
			const date = new Date(hourly.time[i]);
			const hourStr = date.getHours().toString().padStart(2, '0') + ":00";

			tr.innerHTML = `
		  <td id="heure">${hourStr}</td>
		  <td id="temperature">${hourly.temperature_2m[i]} °C</td>
		  <td id="condition">${weatherCodeToText(hourly.weathercode[i])}</td>  <!-- Condition texte -->
		  <td id="force-vent">${hourly.wind_speed_10m[i]} km/h</td>
		`;
			tbody.appendChild(tr);
		}
	} catch (e) {
		console.error("Erreur récupération météo horaire :", e);
	}
}

function weatherCodeToText(code) {
	switch (code) {
		case 0: return "Clair";
		case 1:
		case 2:
		case 3: return "Nuageux";
		case 45:
		case 48: return "Brouillard";
		case 51:
		case 53:
		case 55: return "Bruine";
		case 56:
		case 57: return "Bruine verglaçante";
		case 61:
		case 63:
		case 65: return "Pluie";
		case 66:
		case 67: return "Pluie verglaçante";
		case 71:
		case 73:
		case 75: return "Neige";
		case 77: return "Grains de neige";
		case 80:
		case 81:
		case 82: return "Averses de pluie";
		case 85:
		case 86: return "Averses de neige";
		case 95: return "Orage";
		case 96:
		case 99: return "Orage avec grêle";
		default: return "Inconnu";
	}
}

document.getElementById('weather-table').addEventListener('click', async () => {
	const hourlyTable = document.getElementById('hourly-weather-table');
	if (hourlyTable.style.display === 'none') {
		hourlyTable.style.display = 'table';
	} else {
		hourlyTable.style.display = 'none';
	}
});

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

function getWindDirection(degrees) {
	const directions = [
		'Nord', 'Nord-Nord-Est', 'Nord-Est', 'Est-Nord-Est',
		'Est', 'Est-Sud-Est', 'Sud-Est', 'Sud-Sud-Est',
		'Sud', 'Sud-Sud-Ouest', 'Sud-Ouest', 'Ouest-Sud-Ouest',
		'Ouest', 'Ouest-Nord-Ouest', 'Nord-Ouest', 'Nord-Nord-Ouest'
	];

	const index = Math.round(degrees / 22.5) % 16;
	return directions[index];
}

async function getWeather(city) {
	if (!city) city = 'Lille';
	console.log('city: ', city);
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${apiKey}`;

	try {
		const response = await fetch(url);
		console.log(response);
		const data = await response.json();
		console.log(data);

		const temperature = data.main.temp; // Température en Celsius
		const description = data.weather[0].main.toLowerCase(); // Description de la météo (soleil, nuageux, etc.)
		const fvent = (data.wind.speed * 3.6).toFixed(1);
		const dvent = data.wind.deg;
		const dventCard = getWindDirection(dvent);

		let absurdDescription = '';
		if (description.includes('sun')) {
			absurdDescription = `La grosse boule de feu brille très fort et tout le monde danse sous ses rayons.`;
		} else if (description.includes('clouds')) {
			absurdDescription = `Amas de petites gouttes d'eau en suspension dans l'air, qui forment des taches grisâtres ou blanches dans le ciel, parfois en masse, parfois dispersées.`;
		} else if (description.includes('rain')) {
			absurdDescription = `Chute de gouttes d'eau mouillées qui descendent du ciel, sans demander la permission, pour rendre tout un peu plus mouillé.`;
		} else if (description.includes('snow')) {
			absurdDescription = `Cristaux de glace très petits qui tombent du ciel très doucement.`;
		} else if (description.includes('clear')) {
			absurdDescription = `Boule de feu visible, sans amas de petites gouttes d'eau flottantes.`;
		} else if (description.includes('drizzle')) {
			absurdDescription = `Petites gouttes d'eau qui tombent lentement du ciel, rendant l'air légèrement humide sans que ce soit vraiment de la pluie.`;
		} else if (description.includes('mist')) {
			absurdDescription = `Toute petites gouttes d'eau en suspension dans l'air près du sol et même qu'on voit plus rien.`;
		} else if (description.includes('Thunderstorm')) {
			absurdDescription = `Un phénomène où de l'air chaud et humide rencontre de l'air froid, créant des orages accompagnés d'éclairs et de bruits forts venant du ciel.`;
		} else {
			absurdDescription = `La météo semble un peu confuse aujourd'hui.`;
		}

		document.getElementById('weather-description').innerText = absurdDescription;
		document.getElementById('temperature').innerText = `${temperature}°C`;
		document.getElementById('force-vent').innerText = `${fvent} Km/h`;
		document.getElementById('direction-vent').innerText = dventCard;
		updateCompass(dvent, fvent);
	} catch (error) {
		console.error('Erreur lors de la récupération de la météo :', error);
	}
}

function setCity(ville) {
	if (ville === 'geoloc') {
		navigator.geolocation.getCurrentPosition(function (position) {
			latitude = position.coords.latitude;
			longitude = position.coords.longitude;

			console.log("Latitude : " + latitude + ", longitude : " + longitude);
			getCityFromCoordinates(latitude, longitude).then((city) => {
				getWeather(city);
				getHourlyWeather(latitude, longitude);
				document.getElementById('local-button-geoloc').innerText = city;
			});


		});
	} else if (ville === 'calais') {
		getWeather(ville);
		getHourlyWeather(50.9513, 1.8587)
		document.getElementById('local-button-geoloc').innerText = 'Géoloc';
	} else {
		getWeather(ville);
		getHourlyWeather(latitude, longitude);
		document.getElementById('local-button-geoloc').innerText = 'Géoloc';
	}
}

function toggleCompass() {
	const compass = document.getElementById('compass');
	const button = document.getElementById('toggle-compass-button');
	if (compass.style.display === 'none') {
		compass.style.display = 'block';
		button.innerText = `J'ai compris`;
		document.getElementById("compass").scrollIntoView({ behavior: "smooth" });
	} else {
		compass.style.display = 'none';
		button.innerText = `J'ai pas compris`;
	}
}

function updateCompass(degree, speed) {
	document.getElementById("wind-arrow").setAttribute("transform", `translate(150,150) rotate(${degree})`);
	document.getElementById("wind-speed").textContent = `${speed} km/h`;
}

const dictons = [
	"On ne beurre pas les épinards avec une promesse.",
	"Mieux vaut un pigeon dans la cave qu’un chameau sur le toit.",
	"Qui mange son ombre finit par roter la lumière.",
	"Quand le tournevis miaule, les papillons récitent l’alphabet à l’envers.",
	"Il ne faut pas peigner les nuages avec une cuillère.",
	"Les horloges fondent plus vite quand elles écoutent du jazz bulgare.",
	"Ne confonds jamais ton chausson et ton ambition.",
	"On ne fait pas de sieste avec un tambour dans le slip.",
	"À trop flatter la mouette, elle te pique ton sandwich.",
	"Si le vent souffle trop fort, attache ta soupe.",
	"Le parapluie du doute n’arrête pas la pluie de saucisson.",
	"Un parapluie en colère peut facilement renverser un empire de confiture.",
	"Le cactus n’a pas besoin de wifi pour organiser un concert de flûte.",
	"Un citron motivé sera toujours plus ou moins jaune.",
	"Celui qui cherche midi à minuit finit par dîner froid.",
	"La mouette qui rase l’autoroute n’a pas peur des dragons.",
	"On ne tricote pas l’avenir avec des spaghettis froids.",
	"Il faut savoir écouter le silence qui ne fait pas de bruit.",
	"Quand l'ours fait la vaisselle, et bah c'est bien.",
	"Une botte de foin n’est jamais en retard pour le bal.",
	"Ne laisse jamais un poulpe gérer ton agenda.",
	"Si la rivière chante, c’est que les poissons s’ennuient.",
	"On ne grimpe pas à la montagne avec un escabeau gonflable.",
	"Il ne faut pas jongler avec des avocats quand le vent sent le caramel.",
	"Un escargot ambitieux vaut mieux qu’un trombone déguisé.",
	"Mieux vaut un parapluie en feu qu’une boussole perdue.",
	"Être fort c'est comme être nul mais en fait non.",
	"On apprivoise pas l'ours avec le dos de la tempête",
	"On ne confie pas ses rêves à une passoire distraite.",
	"Les crayons cassés ne marche plus.",
	"Qui vole une banane est un voleur."
];

function getDailyDicton() {
	const today = new Date();
	const day = today.getDate(); // 1 à 31
	return dictons[(day - 1) % dictons.length];
  }

document.getElementById("dicton").innerText = "\""+getDailyDicton()+"\"";

// setInterval(updateCalendar, 60000);
updateCalendar();
setCity('lille');
