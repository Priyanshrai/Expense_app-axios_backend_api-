function saveToLocalStorage(event) {
   event.preventDefault();

    const Expenses = document.getElementById('expenseAmount').value
    const Description = document.getElementById('description').value
    const Category = document.getElementById('Category').value


    const obj = {
        Expenses: Expenses,
        Description: Description,
        Category: Category
    }
    const token=localStorage.getItem('token')
    axios.post("http://localhost:5000/expense/add-expense", obj, {headers:{"Authorization":token}} )
        .then((res) => {
            console.log(res)
            showNewUserOnScreen(res.data.newExpenseDetail)
        })
        .catch((err) => {
            console.error("Error adding user:", err);
            // Assuming that there is some sort of error message displayed on the screen
            showErrorOnScreen("Failed to add user. Please try again later.");

        })
}

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
  
    axios.get("http://localhost:5000/expense/get-expense", {
      headers: { "Authorization": token }
    })
      .then((res) => {
        res.data.allExpenses.forEach((expense) => {
          showNewUserOnScreen(expense);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

function showNewUserOnScreen(user) {
    const parentNode = document.getElementById('listOfUsers');
    const userId = user.id;
    const childHTML = `<li class="list-group-item" id=${user.id}>
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <h5 class="mb-1">${user.Expenses}</h5>
        <p class="mb-1">${user.Description} - ${user.Category}</p>
      </div>
      <div>
        <button class="btn btn-danger btn-sm mr-2" onclick=deleteUser('${user.id}')>Delete</button>
        <button class="btn btn-warning btn-sm" onclick=editUserDetails('${user.Expenses}','${user.Description}','${user.Category}','${user.id}')>Edit</button>
      </div>
    </div>
  </li>` //esa likha aayga

    parentNode.innerHTML = parentNode.innerHTML + childHTML;
}
// edit User

function editUserDetails(Expenses, Description, Category, userId) {

    document.getElementById('expenseAmount').value = Expenses;
    document.getElementById('description').value = Description;
    document.getElementById('Category').value = Category;

   

    deleteUser(userId)
}

// deleteUser('abc@gmail.com')

function deleteUser(userId) {
    const token = localStorage.getItem("token");
    axios.delete(`http://localhost:5000/expense/delete-expense/${userId}`,{headers:{"Authorization":token}})
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
