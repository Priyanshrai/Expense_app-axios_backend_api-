const form = document.getElementById('login');

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const formData = new FormData(event.target);

    const email=formData.get("email");
    const password=formData.get("password");
   
    const obj = {
        email: email,
        password:password
    };
    axios.post("http://localhost:5000/users/login-user",obj)
    .then((res)=>{
        console.log(res);
    })
    .catch((err)=>{
        console.log("Error adding User:",err);
        showErrorOnScreen("failed to add user, Please Try again Later.");
    })
})