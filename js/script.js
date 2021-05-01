const API_URL_ISS = 'https://api.wheretheiss.at/v1/satellites/25544'; // ISS API

window.addEventListener('load', gonow);

function gonow() {
	var DateTime = document.getElementById("time");

	//FUNCTION THAT DISPLAYS THE TIME
	var formatTime = time => ("0" + time).slice(-2);

	function displayTime() {
		let today = new Date();
		DateTime.textContent = formatTime(today.getMonth()) + "-" + formatTime(today.getDate()) + "-" + formatTime(today.getFullYear()) + " " +
			formatTime(today.getHours()) + ":" + formatTime(today.getMinutes()) + ":" + formatTime(today.getSeconds());
	}
	setInterval(displayTime, 1000);
}

//Function to fetch data
async function fetchData(url) {
	const response = await fetch(url);
	const data = await response.json();
	return data;
}

//Function to fetch iss data
async function getISSData() {
	const data = await fetchData(API_URL_ISS);
	const issData = {
		lat: data.latitude,
		lng: data.longitude,
		alt: data.altitude,
		vel: data.velocity
	};
	return issData;
}

//Function to iss properties
function updateISSDataOnDOM(lat, lng, alt, vel) {
	document.getElementById('latitude').textContent = lat;
	document.getElementById('longitude').textContent = lng;
	document.getElementById('altitude').textContent = alt;
	document.getElementById('velocity').textContent = vel;
}

//Function for map marker
function updateMarkerPosition(coords, marker) {
	const newPosition = new google.maps.LatLng(coords.lat, coords.lng);
	marker.setPosition(newPosition);
}

//Function to init map
function initMap() {
	const initCoords = {
		lat: 32,
		lng: -97
	};

	updateISSDataOnDOM('loading lattitude...', 'loading longitude...',
		'loading altitude...', 'loading velocity...');

	const map = new google.maps.Map(
		document.getElementById('map'), {
			zoom: 4,
			center: initCoords,
			streetViewControl: false,
			mapTypeId: 'hybrid'
		}
	);

	const marker = new google.maps.Marker({
		title: 'ISS',
		position: initCoords,
		map: map,
		clickable: true,
		icon: {
			url: 'images/sattelite-icon.png',
			scaledSize: new google.maps.Size(45, 45)
		}
	});

	setInterval(() => {
		const promise = getISSData();
		promise.then(issData => {
			const coords = {
				lat: issData.lat,
				lng: issData.lng
			};
			map.setCenter(coords);
			updateISSDataOnDOM(issData.lat, issData.lng, issData.alt, issData.vel);
			updateMarkerPosition(coords, marker);
		});
	}, 2000);


	var TrackerMap;
	window.onload = TrackerMap;
     
    //Function to show tracker and  map
	function TrackerMap() {
		var submit = document.getElementById("submit");
		submit.onclick = run;

		function run() {
			var display_TrackerMap = document.getElementById("clickme");
			display_TrackerMap.style.display = "block";
			return false;
		}
	}
}
window.onload = () => initMap();