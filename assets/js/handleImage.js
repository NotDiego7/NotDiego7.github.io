uploadButton = document.getElementById('image-input');
uploadButton.addEventListener('click', handleImage);

function handleImage() {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = 'image/*';
	input.click();

	input.addEventListener('change', async () => {
		hideUploadButton();
		enableSubmitButton();
		// Display Image
		const file = input.files[0];
		const imageURL = URL.createObjectURL(file);

		const imageElement = document.getElementById('image-preview');

		imageElement.src = imageURL;
		imageElement.style.display = 'block';

		// File to send to server-side
		const imageBlob = file.slice(0, file.size, file.type);
		const reader = new FileReader();

		reader.onloadend = function () {
			const imageBase64 = reader.result.split(',')[1];
			localStorage.setItem('imageBase64', imageBase64);

			const submit = document.querySelector('button.submit');
			submit.addEventListener('click', function () {
				handleGeminiInteraction('https://notdiego7.pythonanywhere.com/pro_vision', message.value, true);
			});
		};
		reader.readAsDataURL(imageBlob);
	});
}