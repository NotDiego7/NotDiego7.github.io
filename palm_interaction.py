from flask import Flask, request, jsonify
from google import generativeai
from flask_cors import CORS
from time import sleep
from datetime import datetime
import os



# --------------------- Hook up Py file for HTTP requests -------------------- #
app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def generate_text_api():
    text = request.json['text']

    generatedText = generate_ai_text(text)

    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
    }


    return jsonify({'text': generatedText}), 200, headers


if __name__ == '__main__':
    app.run(debug=True)

# ----------------------- Main Function to be executed ----------------------- #
def generate_ai_text(prompt):
    # PALM_KEY = os.getenv('PALM_API_KEY')
    # print(PALM_KEY)
    """
    NEED TO CHANGE THIS HARDCODE METHOD!!!!!!
    """
    # ---------------------------------------------------------------------------- #
    PALM_KEY = "AIzaSyCzeG9tUGbeeODMYCvrY9btm8UQupprjb8"
    # ---------------------------------------------------------------------------- #
    """
    NEED TO CHANGE THIS HARDCODE METHOD!!!!!!
    """

    generativeai.configure(api_key= PALM_KEY)

    PaLMs_response = generativeai.chat(prompt= [prompt])
    print(PaLMs_response.candidates[0]['content'])

    if len(PaLMs_response.candidates) > 0:
        generated_text = PaLMs_response.candidates[0]['content']
        print(generated_text)
    else:
        generated_text = "No response candidates were returned by the Google API."

    return generated_text