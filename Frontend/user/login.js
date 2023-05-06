const form = document.getElementById('login');

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const formData = new FormData(event.target);

    const email=formData.get("email");
    const password=formData.get("password");
   
    const data = {
        email: email,
        password:password
    };
    axios.post("http://localhost:5000/users/login-user",data)
    .then((response)=>{
        const message = response.data.message;
        const alert = document.createElement('div');
        alert.classList.add('alert', 'alert-success');
        alert.textContent = message;
        document.querySelector('#form-container').appendChild(alert);
    })
    .catch((error)=>{
        const message = error.response.data.error;
        const alert = document.createElement('div');
        alert.classList.add('alert', 'alert-danger');
        alert.textContent = message;
        document.querySelector('#form-container').appendChild(alert);
    })
})


const formContainer = document.querySelector('#form-container');

form.addEventListener('input', () => {
  // remove any existing messages
  const messages = formContainer.querySelectorAll('.alert');
  messages.forEach(message => {
    formContainer.removeChild(message);
  });
});