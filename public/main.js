
    var socket = io();

    let delayTimer;
    let clearWritersDelayTimer;
    var messages = document.getElementById('messages');
    var form = document.getElementById('form');
    var input = document.getElementById('input');
    var nickname = document.getElementById('nickname');
    var writers = document.getElementById('writers');
    var userList = document.getElementById('user-list');
  
  const newUserConnection = (user) => {
    userName = user || `User${Math.floor(Math.random() * 1000000)}`;
    nickname.value = userName;
    socket.emit('new user', userName);
    addUserToList(userName); 
  }

  const addUserToList = (user) => {
    if(!!getUserListItem(user)){
      return false;
    }

    let userItem = document.createElement('li');
    userItem.classList.add(`user-${user}`)
    userItem.textContent = user;
    userList.appendChild(userItem);
  }

  const clearUserFromList = () => {
    userList.innerHTML = '';
  }

  const getUserName = () => {
    return nickname.value;
  }

  const getUserListItem = (user) => {
    return document.querySelector(`.user-${user}`);
  }

  newUserConnection();

  socket.on('new user', function(data){
    clearUserFromList();
    data.map((user) => addUserToList(user));
  });

  socket.on('user disconnected', function(data){
    getUserListItem(data).remove();
  });

  nickname.addEventListener('change', function(){
    socket.emit('username change', { username: nickname.value});
  })

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        let message = {
            'user' : nickname.value,
            'message' : input.value
        }
      socket.emit('chat message', message);
      input.value = '';
    }
  });

  input.addEventListener("keyup", () => {
    socket.emit("typing", {
      isTyping: input.value.length > 0,
      nick: getUserName(),
    });
  });
  
  socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });

  socket.on("typing", function (data) {
    const { isTyping, nick } = data;
    let userListItem = getUserListItem(nick)

    if (!isTyping) {
      userListItem.innerHTML = nick;
      return;
    }
    
    userListItem.innerHTML = `${nick} <span class="typing">is typing...</span>`;
  });


  // socket.on('writing', function(msg) {
  //   var item = document.createElement('li');
  //   item.textContent = msg;
  //   writers.innerHTML = "";
  //   writers.appendChild(item);
    
  //   clearTimeout(clearWritersDelayTimer);
  //   clearWritersDelayTimer = setTimeout(function() {
  //           writers.innerHTML = "";
  //       }, 2000);
  // });
