const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let Transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function navigateToPlanner()
{
	window.location.href = window.location.href.replace('index','planner');
}

function addTransaction(e){
    e.preventDefault();
    if(text.value.trim() == "" ||
    amount.value.trim() == ""
    ){
        alert('Please enter Text and Value');
    }    
    else{
        const transaction = {
            id: generateId(),
            text: text.value,
            amount: +amount.value
        };
        Transactions.push(transaction);
        addTransactionDOM(transaction);
        updateLocalStorage();
        updateValues();
        text.value = "";
        amount.value = "";
        text.focus();
    }
}

function generateId(){
    return Math.floor(Math.random()*100000000);
}

function addTransactionDOM(transaction){
    const sign = transaction.amount < 0 ? "-":"+";
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? "minus":"plus");
    item.innerHTML = `
    ${transaction.text}<span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>`;

    list.appendChild(item);
}

function removeTransaction(id){
    Transactions = Transactions.filter(transaction => transaction.id != id);
    updateLocalStorage();
    init();
}

function updateValues(){
    const amounts = Transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc,item) => (acc += item),0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item),0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item),0)*-1).toFixed(2);

    balance.innerHTML = '&#x20b9;' + `${total}`;
    money_plus.innerHTML = '&#x20b9;' + `${income}`;
    money_minus.innerHTML = '&#x20b9;' + `${expense}`;
}

function updateLocalStorage(){
    localStorage.setItem("transactions", JSON.stringify(Transactions));
}

function init(){
    list.innerHTML = "";
    Transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

form.addEventListener("submit",addTransaction);