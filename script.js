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
	
	console.log("day :", day);
	console.log("hour :", hour);
	console.log("minute :", minutes);

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

	console.log("position: ", position);
	
	// Ajout de la classe "marker" à la cellule trouvée
	cell.classList.add('marker');
	cell.innerHTML = '<div class="mark-line" style="top:' + position + '%"></div>'
}

setInterval(updateCalendar, 10000);
updateCalendar();
