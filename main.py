from flask import Flask
import requests

main = Flask(__name__)

with open(file= 'index.html', encoding='utf-8', mode= 'r') as file:
    markup_index = file.read()

@main.route('/')
def home_page():
    return markup_index

@main.route('/<username>')
def username(username):
    return f'<h1> Aurabuar {username} </h1>'

if __name__ == '__main__':
    main.run(debug= True)