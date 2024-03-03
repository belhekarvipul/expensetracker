const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const form = document.getElementById('form');
const planId = document.getElementById('planId');
const month = document.getElementById('month');
const year = document.getElementById('year');
const description = document.getElementById('description');
const plannedAmount = document.getElementById('plannedAmount');
const actualAmount = document.getElementById('actualAmount');
const dvActualAmount = document.getElementById('dvActualAmount');
const totalPlanned = document.getElementById('totalPlanned');
const totalActual = document.getElementById('totalActual');
const btnAddNewPlan = document.getElementById('btnAddNewPlan');
const list = document.getElementById('list');

const localStoragePlans = JSON.parse(localStorage.getItem('plans'));
let Plans = localStorage.getItem('plans') !== null ? localStoragePlans : [];

function navigateToTracker()
{
	window.location.href = window.location.href.replace('planner','index');
}

function validateForm(isSearch)
{
	var isValid = true;
	var msg = 'Please provide';
	
	if(month.value == "-- Select --"){
		isValid = false;
		msg += ' Month,';
	}
	
	if(year.value == "-- Select --"){
		isValid = false;
		msg += ' Year,';
	}
	
	if(!isSearch){
		if(description.value.trim() == ""){
			isValid = false;
			msg += ' Description,';			
		}
		
		if(plannedAmount.value.trim() == ""){
			isValid = false;
			msg += ' planned Amount,';
		}
	}
	
	if(!isValid){
		alert(msg.slice(0, -1));
    }
	return isValid;
}

function showHistory()
{
	list.innerHTML="";
	var _totalPlanned = 0;
	var _totalActual = 0;
	var filteredPlans = Plans;
	
	if(validateForm(true))
	{
		if(filteredPlans == null || filteredPlans.length <= 0){
			alert("No Plan found for the selected month!");
		}
		else{
			filteredPlans = filteredPlans.filter(plan => plan.month == month.value && plan.year == year.value);
		
			if(filteredPlans.length <= 0){
				alert("No Plan found for the selected month!");
			}
			else{
				filteredPlans.forEach((plan)=>{
					const item = document.createElement('li');
					item.innerHTML = `
					<span>${plan.month}</span>
					<span>${plan.year}</span>
					<span class="description">${plan.description}</span>
					<span>&#x20b9;${plan.plannedAmount}</span>
					<span>&#x20b9;${plan.actualAmount}</span>
					<button class="delete-btn" onClick="removePlan('${plan.id}')">x</button>
					<button class="edit-btn" onClick="editPlan('${plan.id}')"><i class="fa fa-edit"></i></button>`;
					list.appendChild(item);
					_totalPlanned += Number(plan.plannedAmount);
					_totalActual += Number(plan.actualAmount);
				});
			}
		}
	}
	
	totalPlanned.innerHTML = `&#x20b9;${_totalPlanned}`;
	totalActual.innerHTML = `&#x20b9;${_totalActual}`;
}

function addPlan(e){
    e.preventDefault();
    if(validateForm()){
		const plan = {
			id: generateId(),
			month: month.value,
			year: year.value,
			description:description.value,
			plannedAmount:plannedAmount.value,
			actualAmount:0
        };
        Plans.push(plan);
		showHistory();
		updateLocalStorage();

        description.value = "";
        plannedAmount.value = "";
        description.focus();
    }
}

function editPlan(e){
	var selectedPlan = Plans;
	selectedPlan = selectedPlan.filter(plan => plan.id == e)[0];
	planId.innerText = selectedPlan.id;
	month.value = selectedPlan.month;
	year.value = selectedPlan.year;
	description.value = selectedPlan.description;
	plannedAmount.value = selectedPlan.plannedAmount;
	actualAmount.value = selectedPlan.actualAmount;	

	dvActualAmount.style.display = "block";
	btnAddNewPlan.style.display = "none";
	actualAmount.focus();
}

function updatePlan(){
	var selectedPlan = Plans;
	selectedPlan = selectedPlan.filter(plan => plan.id == planId.innerText)[0];
	selectedPlan.month = month.value;
	selectedPlan.year = year.value;
	selectedPlan.description = description.value;
	selectedPlan.plannedAmount = plannedAmount.value;
	selectedPlan.actualAmount = actualAmount.value;
	showHistory();
	updateLocalStorage();
	resetForm();
}

function resetForm(){
	planId.innerText = "";
	description.value = "";
	plannedAmount.value = "";
	actualAmount.value = "";
	dvActualAmount.style.display = "none";
	btnAddNewPlan.style.display = "block";
}

function generateId(){
    return new Date().toLocaleString().replaceAll(' ','').replaceAll('/','').replaceAll(':','').replaceAll(',',''); //Math.floor(Math.random()*100000000);
}

function removePlan(id){
    Plans = Plans.filter(plan => plan.id != id);
    updateLocalStorage();
    showHistory();
}

function updateLocalStorage(){
    localStorage.setItem("plans", JSON.stringify(Plans));
}

function bindMonths()
{
	month.innerHTML = "";
	
	var item = document.createElement('option');
		item.innerHTML = "-- Select --";
		item.value = "-- Select --";
		month.appendChild(item);
		
	months.forEach((value)=>{
		var item = document.createElement('option');
		item.innerHTML = value;
		item.value = value;
		month.appendChild(item);
	});
}

function bindYears()
{
	year.innerHTML = "";
	var item = document.createElement('option');
		item.innerHTML = "-- Select --";
		item.value = "-- Select --";
		year.appendChild(item);
		
	var minYear = 1970;
	var maxYear = 2070;
	while(minYear <= maxYear)
	{
		var item = document.createElement('option');
		item.innerHTML = minYear;
		item.value = minYear;
		year.appendChild(item);
		minYear++;
	}
}

function init(){
	bindMonths();
	bindYears();
	month.value = months[new Date().getMonth()];
	year.value = new Date().getFullYear();
	showHistory();
}

init();
form.addEventListener("submit",addPlan);