const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("You are successfully connected to the Database");
    startingQuestions();
});


function startingQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'Please select one of the following options: ',
            choices: ['View Products for sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product',
                'Exit' 
            ]
        }
    ]).then(function (answer) {
        console.log('-------- ' + answer.choice.toUpperCase() + ' --------')

        switch (answer.choice) {
            case 'View Products for sale':
                showAllProducts();
                break;

            case 'View Low Inventory':
                viewLowInventory();
                break;

            case 'Add to Inventory':
                addToInventory();
                break;

            case 'Add New Product':
                addNewProduct();
                break;

            case 'Exit':
                console.log("Have a nice day!")
                connection.end();
                break;
        }
    })
}


//**************Function to view products*****************/

function showAllProducts() {
    var sql = 'SELECT ?? FROM ??';
    var values = ['*', 'products'];
    sql = mysql.format(sql, values);
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            console.log(` \nItem ID: ${results[i].item_id}     Name: ${results[i].product_name}    Department: ${results[i].department_name}    Price: ${results[i].price}    Stock Quantity: ${results[i].stock_quantity} \n-------------------------------------------------------------------------------------- \n`);
        }
        startingQuestions();
    });
}


//**************Function to view Low Inventory (Where stock Qty is less than 5)****************/

function viewLowInventory() {

    var lowInventoryArr = [];

    var sql = 'SELECT ?? FROM ??';
    var values = ['*', 'products'];
    sql = mysql.format(sql, values);
    connection.query(sql, function (err, results, fields) {

        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            if (results[i].stock_quantity < 6) {
                lowInventoryArr.push(results[i]);
            }
        }

        if (lowInventoryArr.length <= 0) {
            console.log('\nNo Low Inventory! Time to start selling more!\n');
        } else {
            for (let i = 0; i < lowInventoryArr.length; i++) {
                console.log(`\nItem ID: ${lowInventoryArr[i].item_id}     Name: ${lowInventoryArr[i].product_name}     Price: ${lowInventoryArr[i].price}     In Stock: ${lowInventoryArr[i].stock_quantity} \n-------------------------------------------------------------------------------------- \n`);
            }
        }

        startingQuestions();
    });
}


//***********Function to Add more to a specific product************/

function addToInventory() {

    inquirer.prompt([
        {
            type: 'input',
            name: 'item',
            message: 'Enter the Item ID to add more: ',
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
            name: 'amount',
            message: 'How much are you adding to the inventory? ',
            validate: function (val) {
                if (!isNaN(val)) {
                    return true
                } else {
                    return 'Please only enter numbers'
                }
            }
        }

    ]).then(function (answer) {

        console.log('Updating Product...\n');

        let sql = 'SELECT ?? FROM ?? WHERE ?? = ?';
        let values = ['*', 'products', 'item_id', answer.item];
        sql = mysql.format(sql, values);
        connection.query(sql, function (err, results) {
            let updatedAmount = results[0].stock_quantity + parseInt(answer.amount);

            let query = connection.query(
                'UPDATE products SET ? WHERE ?',
                [
                    {
                        stock_quantity: updatedAmount
                    },

                    {
                        item_id: results[0].item_id
                    }
                ],

                function (err, res) {
                    console.log(res.affectedRows + " Product updated!\n");
                    startingQuestions();
                }
            )
        })
    });
}


//***************Function to add a new product to the database*******************/

function addNewProduct() {

    inquirer.prompt([
        {
            type: 'input',
            name: 'productName',
            message: "What is the new product's name?"
        },

        {
            type: 'list',
            name: 'productDept',
            message: 'Which department does this product belong to?',
            choices: ['Strings', 'Percussion', 'Piano', 'Woodwind', 'Accessories']
        },

        {
            type: 'input',
            name: 'productPrice',
            message: 'What is the price of this product?'
        },

        {
            type: 'input',
            name: 'productQuantity',
            message: 'How much of this product do we have in stock?',
            validate: function (val) {
                if (!isNaN(val)) {
                    return true
                } else {
                    return 'Please only enter numbers'
                }
            }
        }
    ]).then(function(answers) {
        var query = connection.query(
            'INSERT INTO products SET ?',
                {
                    product_name: answers.productName,
                    department_name: answers.productDept,
                    price: answers.productPrice,
                    stock_quantity: answers.productQuantity
                },
                function(err, results) {
                    console.log(`\n${results.affectedRows} product created!\n`);
                    startingQuestions();
                } 
            );
    });

}