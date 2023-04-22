function saveToLocalStorage(event) {
   

    const Expenses = document.getElementById('expenseAmount').value
    const Description = document.getElementById('description').value
    const Category = document.getElementById('Category').value

    // const Expenses = event.target.expenseAmount.value;
    // const Description = event.target.description.value;
    // const Category = event.target.Category.value;
    const obj = {
        Expenses: Expenses,
        Description: Description,
        Category: Category
    }
    // localStorage.setItem(obj.Description, JSON.stringify(obj));
    // showNewUserOnScreen(obj)
    axios.post("http://localhost:5000/expense/add-expense", obj)
        .then((res) => {
            console.log(res)
            showNewUserOnScreen(res.data.newExpenseDetail)
            showNewUserOnScreen(obj)
        })
        .catch((err) => {
            console.error("Error adding user:", err);
            // Assuming that there is some sort of error message displayed on the screen
            showErrorOnScreen("Failed to add user. Please try again later.");

        })
}

window.addEventListener("DOMContentLoaded", () => {


    axios.get("http://localhost:5000/expense/get-expense")
        .then((res) => {
            console.log(res)
            for (i = 0; i < res.data.allUsers.length; i++) {
                showNewUserOnScreen(res.data.allUsers[i])
            }
        })
        .catch((err) => {
            console.log(err)
        })

})


function showNewUserOnScreen(user) {
    const parentNode = document.getElementById('listOfUsers');
    const userId = user.id;
    const childHTML = `<li id=${user.id}>${user.Expenses} - ${user.Description} - ${user.Category}   
                            <button class="btn btn-danger btn-sm"  onclick=deleteUser('${user.id}')> Delete User </button>
                            <button class="btn btn-warning btn-sm"  onclick=editUserDetails('${user.Expenses}','${user.Description}','${user.Category}','${user.id}')>Edit User </button>
                           
                         </li>` //esa likha aayga

    parentNode.innerHTML = parentNode.innerHTML + childHTML;
}
// edit User

function editUserDetails(Expenses, Description, Category, userId) {

    document.getElementById('expenseAmount').value = Expenses;
    document.getElementById('description').value = Description;
    document.getElementById('Category').value = Category;

    // expenseAmountInput.value=Expenses;
    // descriptionInput.value=Description;
    // CategoryInput.value=Category;

    deleteUser(userId)
}

// deleteUser('abc@gmail.com')

function deleteUser(userId) {


    axios.delete(`http://localhost:5000/expense/delete-expense/${userId}`)
        .then(() => {
            removeUserFromScreen(userId);
        })
        .catch((err) => {
            console.log(err)
        })



}

function removeUserFromScreen(userId) {
    const parentNode = document.getElementById('listOfUsers');
    const childNodeToBeDeleted = document.getElementById(userId);

    parentNode.removeChild(childNodeToBeDeleted)
}
