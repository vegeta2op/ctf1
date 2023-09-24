import sqlite3
try:
    conn = sqlite3.connect('ctf_database.db')
    print("he;;")
    conn.execute('INSERT INTO users (username, password) VALUES ("admin", "Q09bqnyvdjahd")')
    conn.commit()
    conn.close()
except sqlite3.Error as e:
    print("SQLite error:", e)