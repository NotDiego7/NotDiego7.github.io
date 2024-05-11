let clicked = false;
let responseReceived = false;
const submit = document.querySelector('.submit');

submit.addEventListener("click", function () {
	clicked = true;
	disableSubmitButton(); // disableSubmitButton.js
	if (clicked === true) {
		submit.classList.remove("return");
		submit.blur();
		document.querySelector('.loading-dock').classList.add('loaded');
		document.getElementById('load').style.display = 'initial';
		document.getElementById('load-b').style.display = 'initial';
		setTimeout(function () {
			document.getElementById('load').style.opacity = 1;
		}, 750);
		setTimeout(function () {
			document.getElementById('load-b').style.opacity = 1;
		}, 900);

		// Check every (50)ms if the response has been received
		const checkResponseInterval = setInterval(function () {
			if (responseReceived) {
				clearInterval(checkResponseInterval);
				setTimeout(function () {
					document.querySelector('.loading-dock').classList.remove('loaded');
					document.getElementById('load').style.display = 'none';
					document.getElementById('load-b').style.display = 'none';
					document.getElementById('load').style.opacity = 0;
					document.getElementById('load-b').style.opacity = 0;
					let submit = document.querySelector('.submit');
					submit.classList.add("popout");
					submit.innerHTML = "";
					setTimeout(function () {
						document.getElementById('check').style.display = "block";
					}, 300);
				}, 50); // Original timeout was 3600ms

				//reset all
				setTimeout(function () {
					submit.classList.remove("popout");
					submit.classList.add("return");
					submit.innerHTML = "Submit";
					document.getElementById('check').style.display = "none";
					clicked = false;
					submit.style.backgroundColor = "grey";
					submit.style.color = "white";
					submit.style.border = "none";
				}, 700); // Original timeout was 5300ms
			}
		}, 50);
	}
});