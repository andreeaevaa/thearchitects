//for whoever is doing the test stuff!!!
//this should be the flow:
//1. getProductData for each of the things in the above database.
//2. calculateHealthScore for each of the things in the above database (this takes the data from getProductData)
//3. viewProduct for each of the things in the above database
//4. compareProducts for the two products in the above database.

//note: only use the strings "Chips" and "Soda". That's how it's hardcoded rn.
//make sure to look at what the methods take so you put the right things as input

//my testing code starts here:


const HealthModel = require('./HealthScoreModel');

// 1. Mapping aliases correctly
const getProductData = HealthModel.fetchProductDataWithSearch;
const calculateHealthScore = HealthModel.calculateNutritionalScore;
const compareProducts = HealthModel.generateSideBySideComparison;
const viewProduct = HealthModel.viewProduct;
const getProductByBarcode = HealthModel.fetchProductDataWithBarcode;

function runHealthTests() {
console.log("Starting HealthScore testing");
}

//1. getProductData for each of the things in the above database
console.log("\nStep 1: getProductData");
const chipsData = getProductData("Chips");
const sodaData = getProductData("Soda");

//testing barcode function
const barcodeChips = getProductByBarcode('123');

//make sure data exists before processing
if (!chipsData || !sodaData) {
console.error("Error: couldn't retrieve product data");
return;
}

console.log("Data for chips:", chipsData);
console.log("Data for soda:" , sodaData);
console.log("Verification from Barcode (123):" , barcodeChips[0]);

//2. calculateHealthScore for each of the things in above database, taking data from getProductData
console.log("\nStep2: calculateHealthScore");

const chipsScore = calculateHealthScore(chipsData);
const sodaScore = calculateHealthScore(sodaData);

console.log("Health score for chips:" , chipsScore);
console.log("Health Score for soda:" , sodaScore);

//3. viewProduct for each of the things in above database
console.log("\nStep 3: viewProduct");
const chipsView = viewProduct("Chips");
const sodaView = viewProduct("Soda");

console.log("View chips:", chipsView);
console.log("View soda:", sodaView);

//4. compareProducts for the two products in above database
console.log("\nStep 4: compareProducts");
const comparisonResult = compareProducts(chipsScore, sodaScore);

console.log("Comparison results:", comparisonResult);
console.log("\n Test flow complete!");

//calling the function to run the tests
runHealthTests();