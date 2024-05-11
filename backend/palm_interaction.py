import os
from dotenv import load_dotenv

from flask import Flask, request, jsonify, Response
from google import generativeai
from flask_cors import CORS
from io import BytesIO
from PIL import Image
import requests, base64


load_dotenv()
API_KEY = os.environ.get('API_KEY')

# -------------------------------- WebApp API -------------------------------- #
app = Flask(__name__)
CORS(app)

@app.route('/pro_vision', methods=['POST'])
def gemini_pro_vision():
    """
    Fulfills POST requests.
    Responds with Google (AI) Gemini Pro Vision generated text (JSON).
    """
    try:
        request_data = request.get_json()

        image_base64 = request_data['imageBase64']
        prompt = request_data['prompt']

        image = parse_and_open_image(image_base64)

        try:
            response = generate_ai_text(prompt, image)

        except Exception as e:
            raise Exception(f"Server-Google error: {e}")

        headers = {'Content-Type': 'text/plain'}
        return Response(response, headers=headers, status=200)

    except KeyError as e:
        return jsonify({'error': f'Missing key in request data: {str(e)}'}), 400

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500



@app.route('/pro', methods=['POST'])
def gemini_pro():
    """
    Fulfills POST requests.
    Responds with Google (AI) Gemini Pro generated text (JSON).
    """
    try:
        request_data = request.get_json()

        prompt = request_data['prompt']

        try:
            response = generate_ai_text(prompt, None)
        except Exception as e:
            raise Exception(f"Server-Google error: {e}")

        headers = {'Content-Type': 'text/plain'}
        return Response(response, headers=headers, status=200)

    except KeyError as e:
        return jsonify({'error': f'Missing key in request data: {str(e)}'}), 400

    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500




if __name__ == '__main__':
    app.run(debug=True)


# -------------------------------- Middleware -------------------------------- #
def generate_ai_text(prompt, image):
    generativeai.configure(api_key= API_KEY)
    
    if image is None:
        model = generativeai.GenerativeModel('gemini-pro')
        prompt = f"MUST-DO: STRICTLY FORMAT YOUR RESPONSE IN MARKDOWN. The response should start with a title, followed by the rest of the response. The prompt is: {prompt}"
        response = model.generate_content(prompt)
    else:
        model = generativeai.GenerativeModel('gemini-pro-vision')
        prompt = f"MUST-DO: STRICTLY FORMAT YOUR RESPONSE IN MARKDOWN. The response should start with a title, followed by the rest of the response. The prompt is: {prompt}"
        response = model.generate_content([prompt, image])

    return response.text


def parse_and_open_image(image_base64):
    image_blob = base64.b64decode(image_base64)
    image_data = BytesIO(image_blob)
    image = Image.open(image_data)
    return image





# ----------------------- Markdown Formatting (Legacy) ----------------------- #
# from mistletoe import markdown

# def to_markdown(text):
#   text = text.replace('•', '  *')
#   return markdown(text)