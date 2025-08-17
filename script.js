let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editIndex = null;

const form = document.getElementById("transaction-form");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const transactionList = document.getElementById("transaction-list");

const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const netBalanceEl = document.getElementById("net-balance");

function renderTransactions(filter = "all") {
  transactionList.innerHTML = "";
  const filtered = transactions.filter(t => filter === "all" || t.type === filter);

  filtered.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = "flex justify-between p-2";
    li.innerHTML = `
      <span class="${t.type === 'income' ? 'text-green-600' : 'text-red-600'}">
        ${t.description} - ₹${t.amount}
      </span>
      <div class="space-x-2">
        <button class="text-blue-500" onclick="editTransaction(${index})">Edit</button>
        <button class="text-red-500" onclick="deleteTransaction(${index})">Delete</button>
      </div>
    `;
    transactionList.appendChild(li);
  });

  updateSummary();
}

function updateSummary() {
  let income = transactions.filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  let expense = transactions.filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  totalIncomeEl.textContent = `₹${income}`;
  totalExpenseEl.textContent = `₹${expense}`;
  netBalanceEl.textContent = `₹${income - expense}`;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = document.querySelector('input[name="type"]:checked').value;

  if (!description || isNaN(amount)) return;

  if (editIndex !== null) {
    transactions[editIndex] = { description, amount, type };
    editIndex = null;
  } else {
    transactions.push({ description, amount, type });
  }

  localStorage.setItem("transactions", JSON.stringify(transactions));
  form.reset();
  renderTransactions(document.querySelector('input[name="filter"]:checked').value);
});

function editTransaction(index) {
  const t = transactions[index];
  descInput.value = t.description;
  amountInput.value = t.amount;
  document.querySelector(`input[name="type"][value="${t.type}"]`).checked = true;
  editIndex = index;
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  renderTransactions(document.querySelector('input[name="filter"]:checked').value);
}

document.querySelectorAll('input[name="filter"]').forEach(radio => {
  radio.addEventListener("change", e => {
    renderTransactions(e.target.value);
  });
});

renderTransactions();
