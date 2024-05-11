function disableSubmitButton() {
    const submit = document.querySelector('button.submit');
    submit.disabled = true;
    submit.style.cursor = "not-allowed";
}