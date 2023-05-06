const form = document.getElementById('signUp');

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const formData = new FormData(event.target);

    const name = formData.get("name");
    const email=formData.get("email");
    const password=formData.get("password");

    const obj = {
        name: name,
        email: email,
        password:password
    };
    axios.post("http://localhost:5000/users/add-user",obj)
    .then((res)=>{
        console.log(res);
    })
    .catch((err)=>{
        console.log("Error adding User:",err);
       
    })
})