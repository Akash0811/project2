// load messages specifc to channel
function load(){
  var socket0 = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  socket0.on('connect', () => {
      const channel_title = localStorage.getItem('channel_title');
      socket0.emit('load channel', {'channel_title': channel_title});
      });
  if ('null' == document.querySelector('#messages') )
      {document.querySelector('#messages').innerHTML=""}
  socket0.on('load list', data => {
      document.querySelector('#messages').innerHTML="";
      for (i =0 ; i<data.title.length ; i++){
        const li = document.createElement('li');
        li.innerHTML = `${data.title[i]}`;
        document.querySelector('#messages').append(li);
      }
    });
}

// Set starting value of name to empty
if (!localStorage.getItem('name'))
    localStorage.setItem('name','');

// Set starting value of channel to empty
if (!localStorage.getItem('channel_title'))
    localStorage.setItem('channel_title','');

//load all messages when client requests
else{
  load();
};

document.addEventListener('DOMContentLoaded', () => {
    // Load current value of  display_name
    document.querySelector('#name').innerHTML = localStorage.getItem('name');

    // alert item in local storage
    document.querySelector('#display_button').onclick = () => {
        let name = document.querySelector('#display_name').value;

        localStorage.setItem('name', name);
        document.querySelector('#name').innerHTML = localStorage.getItem('name');

    };

    function current_channel(){
      // reset messages
      document.querySelector('#messages').innerHTML="";
    //Load curent value of channel title
    document.querySelector('#channel_title').innerHTML = localStorage.getItem('channel_title');

    // alert item in local storage
    document.querySelectorAll('li.list').forEach(li => {
      li.onclick = () => {
          let channel_title = li.innerHTML;

          localStorage.setItem('channel_title', channel_title);
          document.querySelector('#channel_title').innerHTML = localStorage.getItem('channel_title');
          load();
        };

    });

  }
    current_channel();

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // create channels
  socket.on('connect', () => {

      // Create button should emit a "submit channel" event
      document.querySelector('#create_channel_button').onclick = () => {
              const channel_name = document.querySelector('#create_channel').value;
              socket.emit('submit channel', {'channel_name': channel_name});
          };

      });

  socket.on('channel list', data => {
      const li = document.createElement('li');
      li.innerHTML = `${data.title}`;
      li.classList.toggle("list");
      document.querySelector('#channels').append(li);
      current_channel();
  });

  // Create messages for different channels

  var socket2 = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  socket2.on('connect', () => {

      // Create button should emit a "submit channel" event
      document.querySelector('#send_button').onclick = () => {
              const name = document.querySelector('#name').innerHTML;
              const message = document.querySelector('#message_text').value;
              const channel = document.querySelector('#channel_title').innerHTML;
              socket2.emit('submit message', { 'name': name ,'channel_title': channel ,'message': message});
          };

      });


  socket2.on('message list', data => {
      document.querySelector('#messages').innerHTML="";
      for (i =0 ; i<data.title.length ; i++){
        const li = document.createElement('li');
        li.innerHTML = `${data.title[i]}`;
        document.querySelector('#messages').append(li);
      }

  });



});
