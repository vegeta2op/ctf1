from flask import Flask, render_template, request, jsonify, session, redirect, url_for , send_from_directory, abort
import sqlite3
import os
app = Flask(__name__)


app.secret_key = 'U3VycHJpc2VfbW90aGVyZmF0aGVy' 


conn = sqlite3.connect('ctf_database.db')
conn.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)')
conn.close()

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'downloads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
def read_file(filename):
    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        with open(file_path, 'r') as file:
            content = file.read()
        return content
    except FileNotFoundError:
        return None
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        print(f"Received login request with username: {username}, password: {password}")

        # Rest of your authentication logic...

        if username == "admin":
            # Simulate a JSON-based SQL injection vulnerability in the password field
            query = f'SELECT * FROM users WHERE username="admin" AND password="{password}"'

            conn = sqlite3.connect('ctf_database.db')
            cursor = conn.cursor()
            cursor.execute(query)
            user = cursor.fetchone()
            conn.close()

            if user:
                # Store a session variable to indicate the user is authenticated
                session['authenticated'] = True
                print("Login successful")
                return jsonify({"message": "Login successful!"}), 200

        print("Login failed")
        return jsonify({"message": "Login failed. Try again."}), 401
    except Exception as e:
        print("An error occurred:", str(e))
        return jsonify({"message": "An error occurred: " + str(e)}), 500


@app.route('/dashboard')
def dashboard():
    # Check if the user is authenticated (session variable)
    if session.get('authenticated'):
        return render_template('dashboard.html')
    else:
        return redirect(url_for('index'))

@app.route('/read-file/<filename>', methods=['GET'])
def read_file(filename):
    # Check if the user is authenticated (session variable)
    if session.get('authenticated'):
        # Construct the file path
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Check if the file exists
        if os.path.exists(file_path):
            # Read and return the file content as plain text
            with open(file_path, 'r') as file:
                file_content = file.read()
            return file_content, 200, {'Content-Type': 'text/plain'}
        else:
            return "File not found", 404
    else:
        return redirect(url_for('index'))

@app.route('/list-files', methods=['GET'])
def list_files():
    # Check if the user is authenticated (session variable)
    if session.get('authenticated'):
        # Get a list of files in the 'downloads' directory
        files = []
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            if os.path.isfile(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
                files.append(filename)

        # Return the list of files as JSON response
        return jsonify({"files": files}), 200
    else:
        return redirect(url_for('index'))  
@app.route('/read-file/<filename>', methods=['GET'])
def get_file_content(filename):
    file_content = read_file(filename)
    if file_content is not None:
        return jsonify({"content": file_content})
    else:
        abort(404)  # Return a 404 error if the file is not found 
@app.route('/logout',methods=['GET'])
def logout():
    # Remove the authenticated session variable
    session.pop('authenticated', None)
    return render_template('__fL!ag-LaSSt-EArt__.html')

if __name__ == '__main__':
    app.run(debug=True)
