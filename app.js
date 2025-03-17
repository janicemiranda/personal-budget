//Globally store transaction objects
const transactions = [];

//Store transaction form element
const form = document.querySelector('form');

//Trasaction history table element
const table = document.getElementById('transactionTable');

//Transaction constructor
function Transaction(type, amount, description) {
	(this.type = type), (this.amount = amount), (this.description = description);
}

//Validate attributes of any new Transaction objects
Transaction.prototype.validateTransaction = function () {
	if (this.amount <= 0) {
		return {
			ok: false,
			message: 'The amount should be greater than 0.',
		};
	}
	if (this.description.trim() === '') {
		return {
			ok: false,
			message: 'Please enter a description.',
		};
	}
	if (!['income', 'expense'].includes(this.type)) {
		return {
			ok: false,
			message: 'Incorrecr value entered.',
		};
	}
	return {
		ok: true,
		message: 'Transaction successfully validated.',
	};
};

//Extract data from the transaction form
function getDataFromForm() {
	const formData = new FormData(form);
	const description = formData.get('description');
	const amount = formData.get('amount');
	const type = formData.get('type');

	return {
		description,
		amount,
		type,
	};
}

//Add created transaction to the transaction history table
function addTransactionToTable(transaction) {
	//Remove placeholder row when there were no previous transactions
	if (table.rows.length === 1 && table.rows[0].cells.length === 1) {
		table.innerHTML = '';
	}

	//Create a new row and assign class
	const newRow = table.insertRow();
	newRow.classList.add('transaction-row');

	//Store created transaction content and class names
	const columns = [
		{ text: new Date().toLocaleDateString(), className: 'transaction-date' },
		{ text: transaction.description, className: 'transaction-desc' },
		{ text: `$${parseFloat(transaction.amount).toFixed(2)}`, className: 'transaction-amount' },
		{ text: transaction.type, className: 'transaction-type' },
	];

	//Add transaction info to the new row
	columns.forEach(({ text, className }, index) => {
		const cell = newRow.insertCell(index);
		cell.textContent = text;
		cell.classList.add(className);

		//Green or Red in the "Amount" column depending on transaction type
		if (index === 2) {
			cell.classList.toggle('text-green-600', transaction.type === 'income');
			cell.classList.toggle('text-red-600', transaction.type !== 'income');
			cell.classList.add('font-semibold');
		}
	});
}

//Update the balance headers
function updateTotals() {
	let totalIncome = 0;
	let totalExpense = 0;

	//Sum total expenses and income
	transactions.forEach((transaction) => {
		const amount = parseFloat(transaction.amount);
		if (transaction.type === 'expense') {
			totalExpense += amount;
		} else {
			totalIncome += amount;
		}
	});
	//Calculate total balance
	const totalBalance = totalIncome - totalExpense;

	//Update the text in the balance header elements
	document.getElementById('balance').textContent = `$${totalBalance.toFixed(2)}`;
	document.getElementById('income').textContent = `$${totalIncome.toFixed(2)}`;
	document.getElementById('expenses').textContent = `$${totalExpense.toFixed(2)}`;
}

//Create and validate transactions
function createTransaction(transaction) {
	const newTransaction = new Transaction(transaction.type, transaction.amount, transaction.description);

	const validation = newTransaction.validateTransaction();

	if (validation.ok) {
		transactions.push(newTransaction);
		alert(validation.message);
		form.reset();
	} else {
		alert(validation.message);
	}
}

/**
 * Handle form submission to create a new transaction, add to the transaction history,
 * and update totals in header
 */
form.addEventListener('submit', function (e) {
	e.preventDefault();
	const newTransaction = getDataFromForm();
	createTransaction(newTransaction);
	addTransactionToTable(newTransaction);
	updateTotals();
});

//Tooltip for users to autofill an already listed transaction (recurring transactions)
table.addEventListener('mouseover', function (event) {
	//Using if makes sure all current and future transactions have this tooltip
	if (event.target.classList.contains('transaction-desc')) {
		event.target.setAttribute('title', 'Click to autofill transaction');
		event.target.style.cursor = 'pointer';
	}
});

//Autofill form on description click
table.addEventListener('click', function (event) {
	if (event.target.classList.contains('transaction-desc')) {
		//get the parent row
		const row = event.target.closest('tr');
		//get the row's contents
		const amount = row.querySelector('.transaction-amount').textContent;
		const date = row.querySelector('.transaction-date').textContent;
		const category = row.querySelector('.transaction-category').textContent;

		//Autofill the form inputs
		document.getElementById('description').value = event.target.textContent;
		document.getElementById('amount').value = amount.replace('$', '');
		document.getElementById('date').value = date;
		document.getElementById('category').value = category;
	}
});
