const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expenses-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Debug: Log current transactions to understand the data
console.log("Current transactions:", transactions);
console.log("Transaction amounts:", transactions.map(t => t.amount));

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
  e.preventDefault();

  // get form values
  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  transactions.push({
    id: Date.now(),
    description,
    amount,
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();

  transactionFormEl.reset();
}

function updateTransactionList() {
  transactionListEl.innerHTML = "";

  const sortedTransactions = [...transactions].reverse();

  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);
  });
}

function createTransactionElement(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");

  li.innerHTML = `
    <span>${transaction.description}</span>
    <span>${formatCurrency(transaction.amount)}<button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button></span>
  `;

  return li;
}

function updateSummary() {
  console.log("=== UPDATESUMMARY DEBUG ===");
  console.log("All transactions:", transactions);
  console.log("Number of transactions:", transactions.length);

  // 100, -50, 200, -200 => 50
  const balance = transactions.reduce((acc, transaction) => {
    console.log(`Balance: ${acc} + ${transaction.amount} = ${acc + transaction.amount}`);
    return acc + transaction.amount;
  }, 0);

  const incomeTransactions = transactions.filter((transaction) => transaction.amount > 0);
  const income = incomeTransactions.reduce((acc, transaction) => {
    console.log(`Income: ${acc} + ${transaction.amount} = ${acc + transaction.amount}`);
    return acc + transaction.amount;
  }, 0);

  const expenseTransactions = transactions.filter((transaction) => transaction.amount < 0);
  console.log("Expense transactions found:", expenseTransactions);

  const expenses = expenseTransactions.reduce((acc, transaction) => {
    console.log(`Expenses: ${acc} + ${transaction.amount} = ${acc + transaction.amount}`);
    return acc + transaction.amount;
  }, 0);

  const finalExpenses = Math.abs(expenses);
  console.log(`Final expenses (abs): ${finalExpenses}`);

  // Debug: Log calculations
  console.log("=== FINAL RESULTS ===");
  console.log("Balance:", balance);
  console.log("Income:", income);
  console.log("Expenses:", finalExpenses);

  // update ui => todo: fix the formatting
  if (balanceEl) balanceEl.textContent = formatCurrency(balance);
  if (incomeAmountEl) incomeAmountEl.textContent = formatCurrency(income);
  if (expenseAmountEl) expenseAmountEl.textContent = formatCurrency(finalExpenses);
}

function formatCurrency(number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);
}

function removeTransaction(id) {
  // filter out the one we wanted to delete
  transactions = transactions.filter((transaction) => transaction.id !== id);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();
}

// Add a function to clear data for testing
window.clearAllData = function() {
  localStorage.removeItem("transactions");
  transactions = [];
  updateTransactionList();
  updateSummary();
  console.log("All data cleared");
};

// initial render
updateTransactionList();
updateSummary();
