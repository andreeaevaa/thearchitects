//scanner module/package
//we cannot implement the scanning methods, as we do not have access to camera, a barcode, or a scanner as of right now. 
//however, the flow would go something like this:
//1. user finds product with a barcode
//2. user scans the barcode with the camera, which would be done through a method in this module/package
//3. product information is retrieved from the barcode, which would be done through a method in this module/package

//product module/package
function fetchProductDataWithBarcode(barcode){
    // This function should take a barcode as input and return the product data associated with that barcode.
    if (barcode === '123') {
        return ['Chips', 123,'image', '18g', ['Corn', 'Salt', 'Oil']]
    } else if (barcode === '456') {
        return ['Soda', 456, 'image', '39g', ['Carbonated Water', 'Sugar', 'Caffeine']]
    } else {
        console.log("Product not found.")
        return null
    }
}

function fetchProductDataWithSearch(productName) {
    // This function should take a product name as input and return the product data associated with that name.
    if (productName === 'Chips') {
        return ['Chips', 123, 'image', '18g', ['Corn', 'Salt', 'Oil']]
    } else if (productName === 'Soda') {
        return ['Soda',456, 'image', '39g', ['Carbonated Water', 'Sugar', 'Caffeine']]
    } else {
        console.log("Product not found.")
        return null
    }
}

function viewProduct(productName) {
    let data = fetchProductDataWithSearch(productName)
    return data[0] + " " + data[2] + " " + data[3] + " " + data[4]
}

//nutrition module/package
function getNutritionalFacts(productID){
    //this function takes the ID of the product and gives a breakdown of the nutritional score. 
    if (productID === 123) {
        return ['250 calories', '18g of carbs', '2g of protein', '10g of fat', ['Corn', 'Salt', 'Oil']]
    } 
    else if (productID === 456) {
        return ['150 calories', '39g of carbs', '0g of protein', '0g of fat', ['Carbonated Water', 'Sugar', 'Caffeine']]
    }
    else {
        console.log("Product not found.")
        return null
    }
}

function updateNutritionalData(productID, newData) {
    //this function would update the nutritional data for a product in the database, but since we do not have a database, we will just log the new data to the console.
    if (productID === 123) {
        console.log("Updating nutritional data for Chips:", newData)
    } 
    else if (productID === 456) {
        console.log("Updating nutritional data for Soda:", newData)
    } 
    else {
        console.log("Product not found.")
    }
}

//scoring module/package
function calculateNutritionalScore(productData) {
    // This function should analyze the productData and return a nutritional score.
    // For now, we'll return a dummy score based on the product name.
    if (productData[0] === 'Chips') {
        return 50
    } else if (productData[0] === 'Soda') {
        return 20
    } else {
        console.log("Product not found.")
        return 0
    }
}

function interpretNutritionalScore(score){
    //this function would interpret the score inputted and give the user a signal, like green for healthy, yellow for moderate, and red for unhealthy.
    if (score >= 80) {
        return "Green: Healthy"
    } else if (score >= 40) {
        return "Yellow: Moderate"
    } else {        
        return "Red: Unhealthy"
    }
}

//comparison module/package
function generateSideBySideComparison(scoreA, scoreB) {
    // This function should take the health scores of two products and generate a side-by-side comparison.
    if (scoreA > scoreB) {
        return `Product A is healthier than Product B.`
    } else if (scoreB > scoreA) {
        return `Product B is healthier than Product A.`
    } else {
        return "Both products have the same health score."
    } 
}

function getHealthierAlternative(productID) {
    // This function should take a product ID and return a healthier alternative from the database.
    if (productID === 123) {
        return "Baked Chips"
    } else if (productID === 456) {
        return "Sparkling Water"
    } else {
        console.log("Product not found.")
        return null
    }
}

//user module/package
function setPreferences(){
    // This function should allow the user to set their preferences, goals, and restrictions.
    console.log('User preferences have been set.')
}

function getPreferences(){
    // This function should return the user's preferences, goals, and restrictions.
    return {
        weight: 150,
        height: 65,
        age: 30,
        activityLevel: 'Moderate',
        dietaryRestrictions: ['Gluten-Free'],
        healthGoals: ['Lose Weight']
    }
}

function saveComparisonToProfile(comparisonResult){
    // This function should save the comparison result to the user's profile for future reference.
    console.log("Saving comparison result to profile:", comparisonResult)
}

//added so testharness.js can call the function getProductData
module.exports = { 
     fetchProductDataWithBarcode, 
     fetchProductDataWithSearch, 
     viewProduct, 
     getNutritionalFacts, 
     updateNutritionalData, 
     calculateNutritionalScore,
     interpretNutritionalScore,
     generateSideBySideComparison, 
     getHealthierAlternative, 
     getPreferences,
     saveComparisonToProfile,
     setPreferences
}


