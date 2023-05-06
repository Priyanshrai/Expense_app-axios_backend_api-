const form=document.getElementById('signUp');

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
    axios
    .post("url",obj)
    .then((res)=>{
        console.log(res);
    })
    .catch((err)=>{
        console.log("Error adding User:",err);
        showErrorOnScreen("failed to add user, Please Try again Later.");
    })
})