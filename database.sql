DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE products;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Acoustic Guitar", "Strings", 120, 7);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Electric Guitar", "Strings", 380.89, 15);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Drums Set", "Percussion", 475.99, 3);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Keyboard", "Piano", 280.64, 20);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Violin", "Strings", 750.46, 9);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bass", "Strings", 219.99, 10);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Saxophone", "Woodwind", 799.95, 4);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Guitar Multi-effects", "Accessories", 315.16, 30);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Microphone", "Accessories", 87.32, 43);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Amplifier", "Accessories", 366.87, 21);