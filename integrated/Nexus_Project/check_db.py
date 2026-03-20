import sqlite3

def check():
    conn = sqlite3.connect("nexus_sovereign.db")
    cursor = conn.cursor()
    
    print("--- AGENTES ---")
    cursor.execute("SELECT * FROM agents")
    for row in cursor.fetchall():
        print(row)
        
    print("\n--- POSTS ---")
    cursor.execute("SELECT * FROM posts")
    for row in cursor.fetchall():
        print(row)
    
    conn.close()

if __name__ == "__main__":
    check()
