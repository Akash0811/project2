// Set starting value of name to empty
if (!localStorage.getItem('name'))
    localStorage.setItem('name','');

// Load current value of  display_name
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#name').innerHTML = localStorage.getItem('name');

    // alert item in local storage
    document.querySelector('#display_button').onclick = () => {
        let name = document.querySelector('#display_name').value;

        localStorage.setItem('name', name);
        document.querySelector('#name').innerHTML = localStorage.getItem('name');

    };

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
      for ( let i = 0 ; i<data.length ; i++){
      li.innerHTML = `${data[i].title}`;
    };
      document.querySelector('#channels').append(li);
  });

});
