class Product {
  constructor(data) {
    this.name = data.name;
    this.brand = data.brand;
  }
}

class ScoredProduct extends Product {
  constructor(data) {
    super(data);
    this.healthScore = data.healthScore;
  }
}

function createProduct(type, data) {
  switch (type) {
    case "scored":
      return new ScoredProduct(data);
    default:
      return new Product(data);
  }
}

module.exports = { createProduct };
