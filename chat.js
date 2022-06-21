
const output = document.getElementById('output');
const message = document.getElementById('message');
const send = document.getElementById('send');
const feedback = document.getElementById('feedback');
const roomMessage = document.querySelector('.room-message');
const users = document.querySelector('.users');

//Socket server URL
const socket = io.connect('http://localhost:3000');

//Fetch URL Params from URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const UserName = urlParams.get('UserName');
const RoomName = urlParams.get('RoomName');
console.log(UserName, RoomName);

//Display the roomname the user is connected to
roomMessage.innerHTML = `Connected in room ${RoomName}`

//Emitting username and roomname of newly joined user to server
socket.emit('joined-user', {
    UserName: UserName,
    RoomName: RoomName
})

//Sending data when user clicks send
send.addEventListener('click', () =>{
    socket.emit('chat', {
        UserName: UserName,
        message: message.value,
        RoomName: RoomName
    })
    message.value = '';
})

//Sending username if the user is typing
message.addEventListener('keypress', () => {
    socket.emit('typing', {UserName: UserName, RoomName: RoomName})
})

//Displaying if new user has joined the room
socket.on('joined-user', (data)=>{
    output.innerHTML += '<p>--> <strong><em>' + data.UserName + ' </strong>has Joined the Room</em></p>';
})

//Displaying the message sent from user
socket.on('chat', (data) => {
    output.innerHTML += '<p><strong>' + data.UserName + '</strong>: ' + data.message + '</p>';
    feedback.innerHTML = '';
    document.querySelector('.chat-message').scrollTop = document.querySelector('.chat-message').scrollHeight

})

//Displaying if a user is typing
socket.on('typing', (user) => {
    feedback.innerHTML = '<p><em>' + user + ' is typing...</em></p>';
})

//Displaying online users
socket.on('online-users', (data) =>{
    users.innerHTML = ''
    data.forEach(user => {
        users.innerHTML += `<p>${user}</p>`
    });
})
