from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Initialize the SQLite database
conn = sqlite3.connect('ctf_database.db')
conn.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)')
conn.execute('INSERT INTO users (username, password) VALUES ("admin", "supersecret")')
conn.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        password = data.get('password')

        # Simulate a JSON-based SQL injection vulnerability in the password field
        query = f'SELECT * FROM users WHERE username="admin" AND password="{password}"'

        conn = sqlite3.connect('ctf_database.db')
        cursor = conn.cursor()
        cursor.execute(query)
        user = cursor.fetchone()
        conn.close()

        if user:
            return jsonify({"message": "Congratulations! You found the flag."}), 200

        return jsonify({"message": "Login failed. Try again."}), 401
    except Exception as e:
        return jsonify({"message": "An error occurred: " + str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
