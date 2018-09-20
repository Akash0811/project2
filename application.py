import os

from flask import Flask , render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []

def apology(message, code=400):
    """Render message as an apology to user."""
    return render_template("apology.html", top=code, bottom=escape(message)), code

@app.route("/")
def index():
    return render_template("index.html" , channels = channels)

@socketio.on("submit channel")
def channel(data):
    name = data["channel_name"]
    for channel in channels:
        if channel["title"] == name:
            return apology("Name already assigned to other channel" , 400)
    channels.append({ "title": name , "messages": {} })
    rest = channels[len(channels)-1:]
    emit("channel list", rest , broadcast=True)
