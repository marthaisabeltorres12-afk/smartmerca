from flask import Flask, render_template, request, redirect, session
from flask_mysqldb import MySQL
import bcrypt

app = Flask(__name__)
app.secret_key = "secret123"

app.config["MYSQL_HOST"] = "127.0.0.1"
app.config["MYSQL_USER"] = "root"
app.config["MYSQL_PASSWORD"] = ""
app.config["MYSQL_DB"] = "smartmerca"
app.config["MYSQL_PORT"] = 3307

mysql = MySQL(app)

# ================= LOGIN =================
@app.route("/", methods=["GET","POST"])
def login():

    if request.method=="POST":
        email=request.form["email"]
        password=request.form["password"]

        cur=mysql.connection.cursor()
        cur.execute("SELECT * FROM usuarios WHERE email=%s",[email])
        user=cur.fetchone()

        if user and bcrypt.checkpw(password.encode(), user[3].encode()):
            session["id"]=user[0]
            session["rol"]=user[4]

            if user[4]=="admin":
                return redirect("/admin")
            else:
                return redirect("/user")

    return render_template("login.html")

# ================= REGISTRO =================
@app.route("/register", methods=["GET","POST"])
def register():

    if request.method=="POST":
        nombre=request.form["nombre"]
        email=request.form["email"]
        password=request.form["password"]
        rol=request.form["rol"]

        hash=bcrypt.hashpw(password.encode(),bcrypt.gensalt())

        cur=mysql.connection.cursor()
        cur.execute("INSERT INTO usuarios(nombre,email,password,rol) VALUES(%s,%s,%s,%s)",
        (nombre,email,hash,rol))
        mysql.connection.commit()

        return redirect("/")

    return render_template("register.html")

# ================= ADMIN =================
@app.route("/admin")
def admin():

    if "rol" not in session or session["rol"]!="admin":
        return redirect("/")

    cur=mysql.connection.cursor()
    cur.execute("SELECT * FROM usuarios")
    usuarios=cur.fetchall()

    return render_template("admin.html",usuarios=usuarios)

# ================= USER =================
@app.route("/user")
def user():

    if "rol" not in session:
        return redirect("/")

    return render_template("user.html")

# ================= DELETE =================
@app.route("/delete/<id>")
def delete(id):

    cur=mysql.connection.cursor()
    cur.execute("DELETE FROM usuarios WHERE id=%s",[id])
    mysql.connection.commit()

    return redirect("/admin")

    # ================= EDIT =================
@app.route("/edit/<id>", methods=["GET","POST"])
def edit(id):

    if "rol" not in session or session["rol"]!="admin":
        return redirect("/")

    cur = mysql.connection.cursor()

    if request.method == "POST":
        nombre = request.form["nombre"]
        email = request.form["email"]
        rol = request.form["rol"]

        cur.execute("""
            UPDATE usuarios 
            SET nombre=%s, email=%s, rol=%s
            WHERE id=%s
        """, (nombre,email,rol,id))

        mysql.connection.commit()
        return redirect("/admin")

    cur.execute("SELECT * FROM usuarios WHERE id=%s",[id])
    usuario = cur.fetchone()

    return render_template("edit.html", usuario=usuario)

# ================= LOGOUT =================
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

if __name__=="__main__":
    app.run(debug=True)