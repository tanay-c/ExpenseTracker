const TransactionData = {
  name: "",
  date: "",
  amount: "",
  currency: "$",
  category: "",
};
const dateOptions = { year: "numeric", month: "long", day: "numeric" };

function loadHome() {
  let user_greeting = document.createElement("h1");
  user_greeting.innerHTML = "Hello user!";
  let root = document.getElementById("root");
  root.classList.add("d-flex");
  root.classList.add("align-items-center");
  root.classList.add("justify-content-center");
  root.appendChild(user_greeting);
}

function getPriorEntries() {
  fetch("./userData.JSON")
    .then((response) => response.json())
    .then(storeEntries);
}

function storeEntries(data) {
  let userStorage = window.sessionStorage;
  if (!userStorage.hasOwnProperty("prev_loaded")) {
    let userLogs = JSON.parse(userStorage.getItem("JSON"));
    if (userLogs === null) {
      userLogs = [];
    }
    for (item of data) {
      userLogs.push(item);
    }
    userStorage.setItem("JSON", JSON.stringify(userLogs));
    userStorage.setItem("prev_loaded", true);
  }
}

function fillTrContent() {
  getPriorEntries();
  let userStorage = window.sessionStorage;
  if (userStorage.hasOwnProperty("JSON")) {
    let userLogs = JSON.parse(userStorage.getItem("JSON"))[0];
    const username = userLogs["UserID"];
    const currentbalance = userLogs["CurrentBalance"];
    const budget = userLogs["Budget"];
    document.getElementById("tr_budget").innerHTML = "Budget: ".concat(currentbalance);  
    let transactions = userLogs["Transactions"];
    total = transactions.reduce(
      (partialsum, a) => partialsum + Number(a["amount"]),
      0
    );
    document.getElementById("tr_remaining").innerHTML = "Remaining: ".concat(
      Number(currentbalance) - total
    );
    document.getElementById("tr_total").innerHTML = "Total: ".concat(total);
    let tr_list = document.getElementById("tr_list");
    ul = document.createElement("ul");
    ul.classList.add("list-group");
    tr_list.appendChild(ul);
    for (tr of transactions) {
      let li = document.createElement("li");
      li.classList.add("list-group-item");
      let row = document.createElement("div");
      row.classList.add("row");
      let date = document.createElement("div");
      date.classList.add("col-sm-3");
      date.innerHTML = tr.date;
      let name = document.createElement("div");
      name.classList.add("col-sm-6");
      name.innerHTML = tr.name;
      let amount = document.createElement("div");
      amount.classList.add("col-sm-3");
      amount.innerHTML = tr.amount;
      row.appendChild(date);
      row.appendChild(name);
      row.appendChild(amount);
      li.appendChild(row);
      ul.appendChild(li);
    }
  }
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", dateOptions);
}

function loadTransactions() {
  getPriorEntries();
  fillTrContent();
}

function addTransaction() {
  const newEntry = Object.create(TransactionData);
  let userStorage = window.sessionStorage;
  let userLogs = JSON.parse(userStorage.getItem("JSON"))
  let Transactions = userLogs[0]["Transactions"];
  newEntry.date = formatDate(new Date());
  newEntry.name = document.getElementById("name").value;
  newEntry.category = document.getElementById("category").value;
  newEntry.amount = document.getElementById("amount").value;

  Transactions.unshift(newEntry);
  userStorage.setItem("JSON", JSON.stringify(userLogs));
  window.location.href="./tr_success.html"
}

function loadReports(){
  getPriorEntries();
  let userStorage = window.sessionStorage;
  if (userStorage.hasOwnProperty("JSON")) {
    let userLogs = JSON.parse(userStorage.getItem("JSON"))[0];
    const username = userLogs["UserID"]; 
    let transactions = userLogs["Transactions"];
    var barColors = [
    "#b91d47",
    "#00aba9",
    "#2b5797",
    "#e8c3b9",
    "#1e7145"
    ];
    var tmp_arr = {"travel":0, "restaurant":0, "shopping":0, "grocery":0, "utilites":0}
    for (tr of transactions){
      tmp_arr[tr.category] = tmp_arr[tr.category] + Number(tr.amount)
    }    
    var xValues = Object.keys(tmp_arr);
    var yValues = Object.values(tmp_arr);
    console.log(xValues)
    console.log(yValues)
  
    new Chart("myChart", {
      type: "doughnut",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        title: {
          display: true,
          text: "Expense Report"
        }
      }
    })
  }
}