const uploadButton = document.getElementById('upload-image-button');

uploadButton.addEventListener('click', () => {
  const fileReader = new FileReader();

  // Function to handle the image data for display
  fileReader.onload = (event) => {
    const imageURL = event.target.result;
    const imageElement = document.getElementById('image-preview');
    imageElement.src = imageURL;
  };

  // Trigger the file selection dialog
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.click();

  input.addEventListener('change', () => {
    fileReader.readAsDataURL(input.files[0]); // Read as data URL for display

    // Disable further file selection
    input.disabled = true;

    // Upload image directly to Dropbox when the send button is clicked
    const sendMessageButton = document.getElementById('send-message-button');
    sendMessageButton.addEventListener('click', async () => {
      const imageFile = input.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(imageFile);


      let accessToken; // Store the access token globally
      accessToken = process.env.DBXACCESSTOKEN;

      reader.onloadend = async () => {
        try {

          // Upload image to Dropbox
          const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/octet-stream',
              'Dropbox-API-Arg': JSON.stringify({
                path: '/image.jpg',
                mode: 'overwrite'
              })
            },
            body: reader.result
          });

          // Get temporary link using /get_temporary_link
          const getTemporaryLinkResponse = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              path: '/image.jpg'
            })
          });

          const temporaryLink = await getTemporaryLinkResponse.json().link; // Get temporary link

          const text = document.getElementById('message').value;

          // Send request to serverSide proxy (Python) | CORS(request) -> Gemini API -> Response
          const pyProxyResponse = await fetch('https://notdiego7.pythonanywhere.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              prompt: text,
              temporaryLink: temporaryLink
            })
          });
          const generatedText = await pyProxyResponse.json().text;

          document.querySelector('p#ai-body-text').innerText = generatedText;
        } catch (error) {
          console.error('Error:', error);
        }
      };
    });
  });
});


























































// const uploadButton = document.getElementById('upload-image-button');

// uploadButton.addEventListener('click', () => {
//   const fileReader = new FileReader();

//   // Function to handle the image data for display
//   fileReader.onload = (event) => {
//     const imageURL = event.target.result;
//     const imageElement = document.getElementById('image-preview');
//     imageElement.src = imageURL;
//   };

//   // Trigger the file selection dialog
//   const input = document.createElement('input');
//   input.type = 'file';
//   input.accept = 'image/*';
//   input.click();

//   input.addEventListener('change', () => {
//     fileReader.readAsDataURL(input.files[0]); // Read as data URL for display

//     // Send image bytes as a Blob when the send button is clicked
//     const sendMessageButton = document.getElementById('send-message-button');
//     sendMessageButton.addEventListener('click', () => {
//       const formData = new FormData();
//       formData.append('text', document.getElementById('message').value);

//       // Read image bytes directly
//       const imageFile = input.files[0];
//       const reader = new FileReader();
//       reader.readAsArrayBuffer(imageFile);

//       reader.onloadend = () => {
//         formData.append('imageBytes', new Blob([reader.result])); // Append image bytes as a Blob

//         fetch('https://notdiego7.pythonanywhere.com/', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           },
//           body: formData
//         })
//         .then(response => response.json())
//         .then(data => {
//           document.querySelector('p#ai-body-text').innerText = data.text;
//         })
//         .catch(error => {
//           console.error('Error sending image data:', error);
//         });
//       };
//     });
//   });
// });
