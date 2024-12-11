// Fuel data: calorific value (CV) and cost per kg/liter
const fuelData = {
  lpg: {calorificValue: 12000, cost: 0},
  wood: {calorificValue: 2500, cost: 0},
  diesel: {calorificValue: 11400, cost: 0},
  png: {calorificValue: 9000, cost: 0},
  furnaceOil: {calorificValue: 10500, cost: 0},
  blackOil: {calorificValue: 10500, cost: 0},
  ldo: {calorificValue: 10500, cost: 0},
  pellet: {calorificValue: 4100, cost: 0},
};

const modelData = {
  'IB-150': 150000,
  'IB-200': 200000,
  'IB-300': 300000,
  'IB-400': 400000,
  'IB-600': 600000,
  'IB-800': 800000,
  'IB-1000': 1000000,
  'IB-1200': 1200000,
  'IB-1600': 1600000,
  'IB-2000': 2000000,
};

async function fetchFuelCosts () {
  try {
    const response = await fetch (
      'https://fuel-api-z7or.onrender.com/fuel-costs'
    );
    if (!response.ok) {
      throw new Error ('Failed to fetch fuel costs');
    }
    const costData = await response.json ();

    // Update fuelData with fetched costs
    for (const fuel in costData) {
      if (fuelData[fuel]) {
        fuelData[fuel].cost = costData[fuel];
      }
    }

    console.log ('Fuel costs updated:');
  } catch (error) {
    console.error ('Error fetching fuel costs:', error);
    alert ('Unable to fetch fuel costs. Please try again later.');
  }
}

// Function to find the appropriate burner model with max capacity
function findBurnerModel (requiredCapacity) {
  for (const model in modelData) {
    if (modelData[model] >= requiredCapacity) {
      // Return model name with its max capacity
      return `${model} ( ${modelData[model].toLocaleString ()} KCAL/HR )`;
    }
  }
  return 'No suitable model found'; // Fallback if no model matches
}

// Function to reset table
function resetTable () {
  document.getElementById ('fuel-name').textContent = '--';
  document.getElementById ('calorific-value').textContent = '--';
  document.getElementById ('fuel-consumption').textContent = '--';
  document.getElementById ('pellet-consumption').textContent = '--';
  document.getElementById ('burner-model').textContent = '--';
  document.getElementById ('hourly-saving').textContent = '--';
  document.getElementById ('monthly-saving').textContent = '--';
  document.getElementById ('yearly-saving').textContent = '--';
}

// Function to calculate and update savings
function calculateSavings () {
  const fuel = document.getElementById ('fuel').value;
  const usage = parseFloat (document.getElementById ('usage').value);

  // Reset table if no fuel is selected or usage is invalid
  if (!fuel || !usage || usage <= 0) {
    alert ('Please select a fuel type and enter a valid fuel usage value.');
    resetTable ();
    return;
  }

  // Get data for the selected fuel and wood pellets
  const selectedFuel = fuelData[fuel];
  const pellet = fuelData['pellet'];

  // Calculate required capacity (Kcal/hr)
  const requiredCapacity = usage * selectedFuel.calorificValue;

  // Calculate wood pellet consumption to match heat generation
  const pelletConsumption = requiredCapacity / pellet.calorificValue;

  // Find the appropriate burner model
  const burnerModel = findBurnerModel (requiredCapacity);

  // Calculate savings
  const hourlySaving =
    usage * selectedFuel.cost - pelletConsumption * pellet.cost;
  const monthlySaving = hourlySaving * 24 * 30; // Assuming 24 hours daily
  const yearlySaving = hourlySaving * 24 * 365; // Assuming 24 hours daily

  // Update table
  document.getElementById ('fuel-name').textContent = fuel.toUpperCase ();
  document.getElementById (
    'calorific-value'
  ).textContent = `${selectedFuel.calorificValue} CV`;
  document.getElementById ('fuel-consumption').textContent = `${usage} KG/HR`;
  document.getElementById (
    'pellet-consumption'
  ).textContent = `${pelletConsumption.toFixed (2)} KG/HR`;
  document.getElementById ('burner-model').textContent = burnerModel;
  document.getElementById (
    'hourly-saving'
  ).textContent = `${hourlySaving.toFixed (2)} RS`;
  document.getElementById (
    'monthly-saving'
  ).textContent = `${monthlySaving.toFixed (2)} RS`;
  document.getElementById (
    'yearly-saving'
  ).textContent = `${yearlySaving.toFixed (2)} RS`;
  document.getElementById (
    'fuel-cost'
  ).textContent = `${fuelData[fuel].cost} Rs`;
  document.getElementById (
    'pellet-cost'
  ).textContent = `${fuelData['pellet'].cost} Rs`;
}

// Reset table on page load
resetTable ();

// Validate fuel usage input
document.getElementById ('usage').addEventListener ('input', function (e) {
  const value = parseFloat (e.target.value);
  if (value < 0) {
    e.target.value = 0;
  }
});

window.onload = function () {
  fetchFuelCosts ();
};
