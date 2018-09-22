import os
import datetime

from flask import Flask , render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = {}

def apology(message, code=400):
    """Render message as an apology to user."""
    return render_template("apology.html", top=code, bottom=escape(message)), code

@app.route("/")
def index():
    #remembers messages and maps channels
    return render_template("index.html" , channels = channels)

@socketio.on("submit channel")
def channel(data):
    # listens to creation of new channel
    # broadcasts new channel
    title = data["channel_name"]
    if title in channels:
        return apology("Name already assigned to other channel",400)
    channels.update( { title : [] })
    rest = { "title": title }
    emit("channel list", rest , broadcast=True)

@socketio.on("submit message")
    # listens to creation of new messages
    # broadcasts new messages
def message(data):
    channel_title = data["channel_title"]
    message = data["message"]
    name = data["name"]
    timestamp = datetime.datetime.now()
    string = f"{name}"+" :: "f"{timestamp}" + " :: " + f"{message}"
    prev_messages = channels[channel_title]
    if len(prev_messages) == 100:
        prev_messages = prev_messages[1:]
    prev_messages.append( string )
    channels[channel_title] = prev_messages
    rest = { "title": prev_messages }
    emit("message list", rest , broadcast=True)

@socketio.on("load channel")
def load(data):
    # listens to loading of page and takes in channel title from local storage
    # broadcasts info of messages
    #print(channels)
    channel_title = data["channel_title"]
    prev_messages = channels[channel_title]
    rest = { "title": prev_messages }
    #print(rest["title"])
    emit("load list", rest , broadcast=True)

@socketio.on("delete message")
def delete(data):
    # listens to loading of page and takes in channel title from local storage
    # broadcasts info of messages
    print("hi")
    channel_title = data["channel_title"]
    message = data["message"]
    messages = channels[channel_title]
    for msg in messages:
        if msg == message :
            messages.remove(msg)
            break
    channels[channel_title] = messages
    rest = { "title": messages }
    #print(rest["title"])
    emit("load messages", rest , broadcast=True)
