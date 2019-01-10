const googlebtn = document.querySelector('#googlebtn');
const API_URL = 'http://localhost:5000/auth/google';
googlebtn.addEventListener('click', function(event){
    event.preventDefault();
    fetch(API_URL, {
        method: "POST",

    })
});