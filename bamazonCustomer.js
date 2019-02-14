const mysql = require('mysql');
const inquirer = require('inquirer');

var userTotal;


const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
	console.log('We have a connection!');
	introduction();
});

function introduction() {
	console.log('\n***  ***  ***  Welcome to BAMAZON!  ***  ***  ***\n');
	inquirer.prompt([
		{
			type: 'confirm',
			name: 'confirm',
			message: "Would you like to see what we have in stock and place an order?",
			default: true
		}
	]).then(function(answers) {
		if (answers.confirm) {
			showAllProducts();
		} else {
			console.log('\nHope to see you again soon! \n\nHave a nice day!\n');
			connection.end();
		}
	});
}

function promptUserInput() {
	inquirer.prompt([
		{	//add function to validate that user input is a number
			type: 'input',
			name: 'item',
			message: 'Which item would you like to order? Please select by ID number.',
			validate: function (val) {
                if (!isNaN(val)) {
                    return true
                } else {
                    return 'Please only enter numbers'
                }
            }
		},

		{
			type: 'input',
			name: 'itemQuantity',
			message: 'How many units would you like to purchase?',
			validate: function (val) {
                if (!isNaN(val)) {
                    return true
                } else {
                    return 'Please enter a numerical value for your purchase'
                }
            }
		}
	]).then(function(answers) {

		var sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
		var values = ['*', 'products', 'item_id', answers.item];
		sql = mysql.format(sql, values);
		connection.query(sql, function(err, results) {
			if (answers.itemQuantity <= results[0].stock_quantity) {
				console.log('\nGreat choice!\n');
				
				//update database
				var userQuantity = results[0].stock_quantity - answers.itemQuantity;
				var query = connection.query(
					'UPDATE products SET ? WHERE ?',
						[
							{
								stock_quantity: userQuantity
							},
							{
								item_id: results[0].item_id
							}
						],
					function(err, results) {
						console.log(`${results.affectedRows} product updated!`);
						promptAgain();
					}
				);

				//give user total 
				userTotal = parseFloat((results[0].price * answers.itemQuantity).toFixed(2));
				console.log(`Your total is $${userTotal}\n`);
				
				
				
			} else {
				console.log('\nNot enough in stock. \nPlease pick another item or another amount.\n');
				promptUserInput();
			}
		});		
	});
}

function showAllProducts() {
	var sql = 'SELECT ?? FROM ??';
	var values = ['*', 'products'];
	sql = mysql.format(sql, values);
	connection.query(sql, function(err, results, fields) {
		if (err) throw err;
		for (let i = 0; i < results.length; i++) {
			console.log(` \nItem ID: ${results[i].item_id}     Name: ${results[i].product_name}     Price: ${results[i].price} \n-------------------------------------------------------------------------------------- \n`);
		}
		promptUserInput();
	});
}

function promptAgain() {
	inquirer.prompt([
		{
			type: 'confirm',
			name: 'orderAgain',
			message: 'Would you like to place another order?',
			default: true
		}
	]).then(function(answers) {
		if (answers.orderAgain) {
			showAllProducts();
		} else {
			console.log('Thanks for shopping with us. yCome back soon');
			connection.end();
		}
	});
}
