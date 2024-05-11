function hideUploadButton() {
    const uploadButton = document.getElementById('image-input')
    uploadButton.disabled = true;
    uploadButton.style.display = 'none';
};