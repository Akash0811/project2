import os
import datetime

from flask import Flask , render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = {}

channel_title_global = ''

def apology(message, code=400):
    """Render message as an apology to user."""
    return render_template("apology.html", top=code, bottom=escape(message)), code

@app.route("/")
def index():
    return render_template("index.html" ,chan = channel_title_global , channels = channels)

@socketio.on("submit channel")
def channel(data):
    title = data["channel_name"]
    if title in channels:
        return apology("Name already assigned to other channel",400)
    channels.update( { title : [] })
    rest = { "title": title }
    emit("channel list", rest , broadcast=True)

@socketio.on("submit message")
def message(data):
    channel_title_global = data["channel_title"]
    channel_title = data["channel_title"]
    message = data["message"]
    name = data["name"]
    #print(message)
    timestamp = datetime.datetime.now()
    string = f"{name}"+" :: "f"{timestamp}" + " :: " + f"{message}"
    prev_messages = channels[channel_title]
    prev_messages.append( string )
    channels[channel_title] = prev_messages
    rest = { "title": prev_messages }
    #print(channels)
    emit("message list", rest , broadcast=True)

@socketio.on("load channel")
def load(data):
    #print(channels)
    channel_title_global = data["channel_title"]
    channel_title = data["channel_title"]
    prev_messages = channels[channel_title]
    rest = { "title": prev_messages }
    #print(rest["title"])
    emit("load list", rest , broadcast=True)
