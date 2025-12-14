// =====================
// SELECT ELEMENTS
// =====================
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const addBtn = document.getElementById("addBtn");
const tableBody = document.querySelector("#expenseTable tbody");
const totalSpan = document.getElementById("total");

let expenses = [];
let total = 0;

// =====================
// ADD EXPENSE
// =====================
addBtn.addEventListener("click", () => {
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value.trim();
    const date = dateInput.value;

    if (!amount || !category || !date) {
        alert("Please fill in all the data");
        return;
    }

    // Add expense to array
    const expense = { amount, category, date };
    expenses.push(expense);

    // Update table
    addRowToTable(expense);

    // Update total
    total += amount;
    totalSpan.textContent = total.toFixed(2);

    // Update chart
    updateChart();

    // Clear inputs
    amountInput.value = "";
    categoryInput.value = "";
    dateInput.value = "";
});

// =====================
// ADD ROW TO TABLE
// =====================
function addRowToTable(expense) {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td>${expense.amount.toFixed(2)}</td>
    <td>${expense.category}</td>
    <td>${expense.date}</td>
    <td><button class="delete-btn">Delete</button></td>`;

    // Delete button action
    tr.querySelector("button").addEventListener("click", () => {
        total -= expense.amount;
        totalSpan.textContent = total.toFixed(2);

        tableBody.removeChild(tr);

        expenses = expenses.filter(e => e !== expense);
        updateChart();
    });

    tableBody.appendChild(tr);
}

// =====================
// PIE CHART
// =====================
let pieChart = null;

function updateChart() {
    const categoryTotals = {};

    expenses.forEach(exp => {
        if (!categoryTotals[exp.category]) {
            categoryTotals[exp.category] = 0;
        }
        categoryTotals[exp.category] += exp.amount;
    });

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    if (pieChart !== null) {
        pieChart.destroy();
    }

    const ctx = document.getElementById("pieChart");
    pieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#1f7ae0", "#23c48e", "#ff6b6b", "#ffa600",
                    "#7b2cbf", "#ff9f1c", "#2a9d8f"
                ]
            }]
        }
    });
}

// =====================
// CALCULATOR
// =====================
const calcDisplay = document.getElementById("calcDisplay");
const buttons = document.querySelectorAll(".btn");
let current = "";

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const val = btn.getAttribute("data-val");

        if (val) {
            current += val;
            calcDisplay.textContent = current;
        }
    });
});

document.getElementById("equals").addEventListener("click", () => {
    try {
        current = eval(current).toString();
        calcDisplay.textContent = current;
    } catch {
        calcDisplay.textContent = "Error";
    }
});

document.getElementById("clear").addEventListener("click", () => {
    current = "";
    calcDisplay.textContent = "0";
});

document.getElementById("del").addEventListener("click", () => {
    current = current.slice(0, -1);
    calcDisplay.textContent = current || "0";
});
