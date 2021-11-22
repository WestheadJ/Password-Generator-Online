# imports
from flask import Flask,request
from flask_cors import CORS
from cryptography.fernet import Fernet
import crypt,os
from dotenv import load_dotenv

# Load environment variables module
load_dotenv()

# Create a Flask application
app = Flask(__name__)
# Add CORS to allow-cross-origin access
CORS(app)

# Get authentication key
authKey = os.getenv("authentication")

# URL endpoint "/create_salt" has a get method as this is a function and doesn't take any information other than the query body.
@app.route("/create_salt",methods=["GET"])
# A function for creating a random salt
def create_salt():
    # Get the auth key from the request body
    auth = request.args.get("auth")
    # Compare to the authentication key if it is the same:
    if auth == authKey:
        # Create salt using the crypt module
        salt = crypt.mksalt(crypt.METHOD_SHA512)
        # Return the salt back
        return str(salt)
    # If it isn't:
    else:
        # Return error message
        return "Incorrect Authentication"

# URL endpoint "/create_key" has a method of GET because it doesn't carry information other than the query body.
@app.route("/create_key",methods=["GET"])
# A function for creating a random key
def create_key():
    # Get the auth key from the request body
    auth = request.args.get("auth")
    # Compare to the authentication key if it is the same:
    if auth == authKey:
        # Generate key using Fernet module
        key = Fernet.generate_key()
        # Return the key back to the user
        return key
    # If it isn't:
    else:
        # Return error message
        return "Incorrect Authentication"

# URL endpoint "/generate" has a method of GET because it doesn't carry information other than the query body.
@app.route('/generate',methods=["GET"])
# A function to create an almost random password
def generate():
    # Get the auth key from the request body
    auth = request.args.get("auth")
    # Get the phrase submitted from the user from the request body
    phrase = request.args.get("phrase")
    # Get the salt submitted from the user from the request body
    salt = request.args.get("salt")
    # Get the key submitted from the user from the request body
    key = request.args.get("key")
    # Compare to the authentication key if it is the same:
    if auth==authKey:
        # Empty string ready for each character to get it into binary
        phraseConverted = ""
        # For loop for getting each character
        for i in phrase:
            n = ord(i)
            phraseConverted += str(n)
        # Empty string ready for each character to get it into binary
        saltConverted = ""
        # For loop for getting each character
        for i in salt:
            n = ord(i)
            saltConverted += str(n)
        # Divide the binary by it's length
        b = int(phraseConverted) // len(phraseConverted)
        # Encode the phrase and salt
        phrase_encoded = str(b).encode()
        salt_encoded = str(salt).encode()
        # Add the key to Fernet function
        f = Fernet(key)
        # Encrypt the phrase with the Fernet function
        phrase_encrypted = f.encrypt(phrase_encoded)
        # Get the string of the encrypted phrase
        phrase = str(phrase_encrypted)[(len(phrase_encrypted) - 8):(len(phrase_encrypted))]
        # Encrypt the salt with the Fernet function
        salt_encrypted = f.encrypt(salt_encoded)
        # Get the string of the encrypted salt
        salt = str(salt_encrypted)[(len(salt_encrypted) - 8):(len(salt_encrypted))]
        # Create the password with the salt and phrase
        password = salt + "5%x€" + phrase
        # Return the password
        return hash(password)
    # If it isn't:
    else:
        # Return error message
        return "Incorrect Authentication"

# URL endpoint "/generate" for a worker bot.
@app.route("/worker")
def worker():
    # Return ping back to the worker bot
    return "Ping"

if __name__ == '__main__':
    app.run()
