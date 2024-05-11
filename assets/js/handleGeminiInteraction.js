async function handleGeminiInteraction(endpoint, text, imageBase64) {
	try {
		const requestBody = { prompt: text };

		if (imageBase64) {
			requestBody.imageBase64 = localStorage.getItem('imageBase64');
		}

		const pyServerResponse = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		});

		const responseMarkup = await pyServerResponse.text();
		responseReceived = true; // submitButtonLoadingAnimation.js

		// Convert Markdown to HTML using marked.js
		const generatedHTML = marked.parse(responseMarkup);

		// Render the generated HTML
		const bodyText = document.getElementById('body-text');
		bodyText.style.display = 'block';
		bodyText.innerHTML = generatedHTML;

		// Scroll to the top of the response
		bodyText.style.paddingTop = '54px'; // Adjust for header height
		bodyText.scrollIntoView({ behavior: 'smooth', block: 'start' });

	} catch (error) {
		console.error(`Error: ${error}`);
		responseReceived = false; // submitButtonLoadingAnimation.js
		disableSubmitButton();

		// Display error message modal
		document.getElementById('modal').style.display = 'block';
		document.getElementById('close-button').style.display = 'none';
		document.querySelector('div#modal-content p').innerHTML = "Oops! Something went wrong. Please refresh and try again.";
	}
}