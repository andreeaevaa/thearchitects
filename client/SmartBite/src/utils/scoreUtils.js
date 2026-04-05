export function calculatePersonalizedScore(product, profile) {
  if (!product || !product.nutrition) return product?.healthScore ?? 0;
  if (!profile || !profile.goal) return product?.healthScore ?? 0;

  const n = product.nutrition;
  const goal = profile.goal;
  const preferLowSodium = profile.preferLowSodium;
  const preferLowSugar = profile.preferLowSugar;
  const preferHighProtein = profile.preferHighProtein;
  const calTarget = profile.dailyCalorieTarget || 2000;

  let score = 50;

  const calPer100 = n.calories ?? 0;
  const calPercent = calPer100 / calTarget;
  if (goal === "lose") {
    if (calPercent < 0.1) score += 20;
    else if (calPercent < 0.2) score += 10;
    else if (calPercent < 0.3) score += 0;
    else if (calPercent < 0.4) score -= 10;
    else score -= 20;
  } else if (goal === "gain" || goal === "muscle") {
    if (calPercent > 0.3) score += 15;
    else if (calPercent > 0.2) score += 8;
    else score -= 5;
  } else {
    if (calPercent < 0.25) score += 10;
    else if (calPercent < 0.35) score += 0;
    else score -= 10;
  }

  const protein = n.protein ?? 0;
  if (goal === "muscle" || preferHighProtein) {
    if (protein >= 20) score += 25;
    else if (protein >= 10) score += 15;
    else if (protein >= 5) score += 5;
    else score -= 10;
  } else if (goal === "lose") {
    if (protein >= 15) score += 15;
    else if (protein >= 8) score += 8;
    else score += 0;
  } else {
    if (protein >= 10) score += 10;
    else if (protein >= 5) score += 5;
  }

  const sugar = n.sugar ?? 0;
  if (goal === "lose" || preferLowSugar) {
    if (sugar <= 2) score += 15;
    else if (sugar <= 5) score += 8;
    else if (sugar <= 10) score += 0;
    else if (sugar <= 20) score -= 10;
    else score -= 20;
  } else {
    if (sugar <= 5) score += 8;
    else if (sugar <= 15) score += 0;
    else score -= 10;
  }

  const sodium = n.sodium ?? 0;
  if (preferLowSodium) {
    if (sodium <= 100) score += 15;
    else if (sodium <= 300) score += 5;
    else if (sodium <= 600) score -= 5;
    else score -= 15;
  } else {
    if (sodium <= 200) score += 8;
    else if (sodium <= 500) score += 0;
    else score -= 8;
  }

  const fat = n.fat ?? 0;
  const satFat = n.saturatedFat ?? 0;
  if (goal === "lose") {
    if (fat <= 5) score += 10;
    else if (fat <= 10) score += 5;
    else if (fat <= 20) score -= 5;
    else score -= 12;
  } else if (goal === "muscle") {
    if (fat <= 15) score += 5;
    else if (fat <= 25) score += 0;
    else score -= 5;
  }

  if (satFat >= 5) score -= 8;
  else if (satFat >= 3) score -= 4;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getScoreColor(score) {
  if (score >= 75) return "#2a9d8f";
  if (score >= 55) return "#90be6d";
  if (score >= 40) return "#fcbf49";
  if (score >= 25) return "#f77f00";
  return "#d62828";
}

export function getScoreMessage(score) {
  if (score >= 80) return "Excellent choice!";
  if (score >= 65) return "Good choice.";
  if (score >= 50) return "Decent choice, not the best for your goals.";
  if (score >= 35) return "Not healthyl; not ideal for your goals.";
  return "Not healthy";
}