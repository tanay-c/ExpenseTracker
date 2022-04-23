const userDataObj = {
  UserID: "",
  CurrentBalance: "",
  Budget: "",
  Transactions: [],
};
const dateOptions = { year: "numeric", month: "long", day: "numeric" };

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
    document.getElementById("tr_budget").innerHTML = "Budget: ".concat(budget);
    document.getElementById("tr_remaining").innerHTML = "Remaining: ".concat(currentbalance);

    let transactions = userLogs["Transactions"];
    total = transactions.reduce((partialsum, a) => partialsum + Number(a["amount"]), 0);
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

function loadHome() {
  let user_greeting = document.createElement("h1");
  user_greeting.innerHTML = "Hello user!";
  let root = document.getElementById("root");
  root.classList.add("d-flex");
  root.classList.add("align-items-center");
  root.classList.add("justify-content-center");
  root.appendChild(user_greeting);
}

function loadTransactions() {
  getPriorEntries();
  fillTrContent();
}
