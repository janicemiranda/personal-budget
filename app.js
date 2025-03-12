function Transactions(type, amount, description) {
	(this.type = type), (this.amount = amount), (this.description = description);
}
//Validate attributes of any new Transaction objects
Transactions.prototype.validate = function () {
	if (this.amount <= 0) {
		return {
			ok: false,
			message: 'Invalid amount',
		};
	}
	if (this.description.trim() === '') {
		return {
			ok: false,
			message: 'Invalid description',
		};
	}
	if (!['1', '2'].includes(this.type)) {
		return {
			ok: false,
			message: 'Invalid type',
		};
	}
	return {
		ok: true,
		message: 'Valid transaction',
	};
};

//Globally store transaction objects
const transactions = [];

function registerTransaction() {
	while (true) {
		const description = prompt('Enter a new transaction: ');
		const typeOfTransaction = prompt(
			'Enter the type of transaction \n 1. Expense \n 2. Income \n\n Enter only the option number'
		);
		const amount = prompt('Enter the transaction amount: ');

		const transaction = new Transactions(typeOfTransaction, Number(amount), description);
		console.log(transaction);
		console.log(typeof transaction);

		const validation = transaction.validate();
		if (!validation.ok) {
			alert(validation.message);
		} else {
			transactions.push(transaction);
		}

		const confirmation = confirm('Do you want to add another transaction?');
		if (confirmation == false) {
			break;
		}
	}
	showSummary();
	listOfTransactionNames();
	expensesOver100();
	findByName();
}

function calculateTotalBalance() {
	let totalIncome = 0;
	let totalExpense = 0;
	transactions.forEach((transaction) => {
		if (transaction.type == 1) {
			totalExpense += transaction.amount;
		} else {
			totalIncome += transaction.amount;
		}
	});
	const totalBalance = totalIncome - totalExpense;
	return { totalIncome, totalExpense, totalBalance };
}

function showSummary() {
	const totalTransactions = transactions.length;
	console.log(`Transaction Summary\n-------------------------------------\n`);
	console.log(`Total Registered Transactions: ${totalTransactions}`);
	const { totalIncome, totalExpense, totalBalance } = calculateTotalBalance();
	console.log(`Total Balance: ${totalBalance}\n`);
	console.log(`Transaction Details:\n- Total Expense: ${totalExpense}\n- Total Income: ${totalIncome}\n`);
	// console.log(`Registered transaction names:\n${listOfTransactionNames()}\n`);
}

function listOfTransactionNames() {
	const names = transactions.map((item) => item.description);
	console.log(`Registered transaction names:\n${names}\n`);
}

function expensesOver100() {
	const exp = transactions.filter((item) => item.amount > 100);
	console.log(`Expenses over $100:${JSON.stringify(exp)}`);
}

function findByName() {
	const preformSearch = confirm(`Would you like to search for a transaction?`);
	if (preformSearch == true) {
		const searchedItem = prompt('Enter the name of the Transaction:');
		const searchResult = transactions.find((item) => item.description == searchedItem);
		console.log(`Found Results:\n${JSON.stringify(searchResult)}`);
	} else {
		return;
	}
}

registerTransaction();
