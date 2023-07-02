function saveToLocalStorage(event) {
  event.preventDefault();

  const Expenses = document.getElementById("expenseAmount").value;
  const Description = document.getElementById("description").value;
  const Category = document.getElementById("Category").value;

  const obj = {
    Expenses: Expenses,
    Description: Description,
    Category: Category,
  };
  const token = localStorage.getItem("token");
  axios
    .post("http://localhost:5000/expense/add-expense", obj, {
      headers: { Authorization: token },
    })
    .then((res) => {
      console.log(res);
      showNewUserOnScreen(res.data.newExpenseDetail);
    })
    .catch((err) => {
      console.error("Error adding user:", err);
      // Assuming that there is some sort of error message displayed on the screen
      showErrorOnScreen("Failed to add user. Please try again later.");
    });
}

window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  axios
    .get("http://localhost:5000/expense/get-expense", {
      headers: { Authorization: token },
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
  const parentNode = document.getElementById("listOfUsers");
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
  </li>`; //esa likha aayga

  parentNode.innerHTML = parentNode.innerHTML + childHTML;
}
// edit User

function editUserDetails(Expenses, Description, Category, userId) {
  document.getElementById("expenseAmount").value = Expenses;
  document.getElementById("description").value = Description;
  document.getElementById("Category").value = Category;

  deleteUser(userId);
}

// deleteUser('abc@gmail.com')

function deleteUser(userId) {
  const token = localStorage.getItem("token");
  axios
    .delete(`http://localhost:5000/expense/delete-expense/${userId}`, {
      headers: { Authorization: token },
    })
    .then(() => {
      removeUserFromScreen(userId);
    })
    .catch((err) => {
      console.log(err);
    });
}

function removeUserFromScreen(userId) {
  const parentNode = document.getElementById("listOfUsers");
  const childNodeToBeDeleted = document.getElementById(userId);

  parentNode.removeChild(childNodeToBeDeleted);
}

window.addEventListener("DOMContentLoaded", async function () {
  
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:5000/purchase/premiumstatus",
      {
        headers: { Authorization: token },
      }
    );

    console.log(response);

    if (response.data.isPremiumUser) {
      
      
      // User is a premium user, hide the "Buy Premium" button
      const buyPremiumButton = document.getElementById("rzp-button");
      buyPremiumButton.style.display = "none";

      // Display the premium user message
      const premiumMessage = document.getElementById("premium-message");
      premiumMessage.textContent = "You are a Premium User";

      //Display the LeaderBoard Button
      const parent_Node = document.getElementById("leaderboard-button-parent");
      const child_HTML = `  <button id="leaderboard-button" class="btn btn-outline-secondary btn-sm">Show Leaderboard</button>`;
      parent_Node.innerHTML = parent_Node.innerHTML + child_HTML;

      {
        document
          .getElementById("leaderboard-button")
          .addEventListener("click", async function () {
            try {
              const token = localStorage.getItem("token");
              const response = await axios.get(
                "http://localhost:5000/premium/leaderboard",
                {
                  headers: { Authorization: token },
                }
              );

              // Process the leaderboard data and display it on the page
              const table = document.createElement("table");
              table.classList.add("table", "table-striped", "table-hover","table-bordered","border-primary");
              
              // Create the table header
              const thead = document.createElement("thead");
              const headerRow = document.createElement("tr");
              
              const nameHeader = document.createElement("th");
              nameHeader.textContent = "Name of Users";
              
              const expenseHeader = document.createElement("th");
              expenseHeader.textContent = "Total Expenses";
              
              headerRow.appendChild(nameHeader);
              headerRow.appendChild(expenseHeader);
              
              thead.appendChild(headerRow);
              table.appendChild(thead);
              
              // Create the table body
              const tbody = document.createElement("tbody");
              response.data.forEach((item) => {
                const row = document.createElement("tr");
              
                const nameCell = document.createElement("td");
                nameCell.textContent = item.name;
              
                const expenseCell = document.createElement("td");
                expenseCell.textContent = item.totalExpense;
              
                row.appendChild(nameCell);
                row.appendChild(expenseCell);
              
                tbody.appendChild(row);
              });
              
              table.appendChild(tbody);
              
              // Assuming there is a div element with id "table-container" in your HTML where you want to append the table.
              const tableContainer = document.getElementById("leaderboard-list");
              tableContainer.appendChild(table);
              
              console.log(response.data);
              

              
              // ... handle the leaderboard data and display it as needed
            } catch (err) {
              console.error(err);
              alert("Something Went Wrong");
            }
          });
      }
    } else {
      // User is not a premium user, display the "Buy Premium" button
      const buyPremiumButton = document.getElementById("rzp-button");
      buyPremiumButton.style.display = "block";
      //Hide the leader board Button
      const leaderBoardButton = document.getElementById(
        "leaderboard-button-parent"
      );
      leaderBoardButton.style.display = "none";
      // Hide the premium user message
      const premiumMessage = document.getElementById("premium-message");
      premiumMessage.style.display = "none";
    }
  } catch (err) {
    console.error(err);
    alert("Something Went Wrong");
  }
});

document.getElementById("rzp-button").onclick = async function (e) {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:5000/purchase/premiummembership",
      {
        headers: { Authorization: token },
      }
    );

    console.log(response);

    const options = {
      key: response.data.key_id,
      order_id: response.data.order.id, //For one time payment
      //This handler will handle the sucess full payment
      handler: async function (response) {
        await axios.post(
          "http://localhost:5000/purchase/updatetransactionstatus",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          {
            headers: { Authorization: token },
          }
        );

        // Replace the button with a message
        const premiumMessage = document.getElementById("premium-message");
        premiumMessage.textContent = "You are now a Premium User";
        const button = document.getElementById("rzp-button");
        button.style.display = "none"; // Hide the button
        alert("You are a Premium User Now");
        location.reload();
      },
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
  } catch (err) {
    console.error(err);
    alert("Something Went Wrong");
  }
};


function download(){
  const token = localStorage.getItem("token");
  axios.get('http://localhost:5000/expense/download', {headers : {Authorization : token}})
  .then((response)=>{
    if(response.status ===200){
      //the backend is essentially sending a download link
      //which if we open in browser, the file would download
      var a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = 'myespense.csv';
      a.click();
    }else {
      throw new Error(response.data.message)
    }
  })
  .catch((err)=> {
    showError(err)
  });

};
