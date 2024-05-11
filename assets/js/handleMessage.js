const message = document.getElementById('message');

message.addEventListener('input', function () {
	if (message.value.length > 0) {
		enableSubmitButton();
	} else {
		disableSubmitButton();
	}
});

submit.addEventListener('click', function () {
	const imageElement = document.getElementById('image-preview');
	if (!imageElement.src) {
		hideUploadButton();
		handleGeminiInteraction('https://notdiego7.pythonanywhere.com/pro', message.value, false);
	};
});	