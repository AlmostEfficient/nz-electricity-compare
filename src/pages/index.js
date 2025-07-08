import React, { useState, useEffect } from "react";

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState("Mercury");
  const [kWh, setKWh] = useState(600);
  const [customDaily, setCustomDaily] = useState(0);
  const [customRate, setCustomRate] = useState(0);
  const [annualSavings, setAnnualSavings] = useState(0);
  const [customPlans, setCustomPlans] = useState([]);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanDaily, setNewPlanDaily] = useState("");
  const [newPlanRate, setNewPlanRate] = useState("");
  
  const contactPlans = [
    { daily: 1.96, rate: 0.186 },
    { daily: 0.9, rate: 0.246 },
  ];

  const mercuryPlans = [
    { daily: 2.19, rate: 0.1914 },
    { daily: 0.9, rate: 0.2502 },
  ];

  const genesisPlans = [
    { daily: 2.64, rate: 0.23 },
    { daily: 0.69, rate: 0.32 },
  ];

  const addCustomPlan = () => {
    if (newPlanName && newPlanDaily && newPlanRate) {
      setCustomPlans([
        ...customPlans,
        {
          id: Date.now(),
          name: newPlanName,
          daily: parseFloat(newPlanDaily),
          rate: parseFloat(newPlanRate)
        }
      ]);
      setNewPlanName("");
      setNewPlanDaily("");
      setNewPlanRate("");
    }
  };

  const removeCustomPlan = (id) => {
    setCustomPlans(customPlans.filter(plan => plan.id !== id));
  };

  const calculateCost = (daily, rate, kWh) => daily * 365 + rate * kWh * 12;

  const getAllPlans = () => {
    const allPlans = [
      ...contactPlans.map((plan, idx) => ({ 
        ...plan, 
        name: `Contact Plan ${idx + 1}`,
        provider: "Contact" 
      })),
      ...mercuryPlans.map((plan, idx) => ({ 
        ...plan, 
        name: `Mercury Plan ${idx + 1}`,
        provider: "Mercury" 
      })),
      ...genesisPlans.map((plan, idx) => ({ 
        ...plan, 
        name: `Genesis Plan ${idx + 1}`,
        provider: "Genesis" 
      })),
      ...customPlans.map(plan => ({ 
        ...plan, 
        provider: "Custom" 
      }))
    ];
    return allPlans;
  };

  const getComparisonData = () => {
    const allPlans = getAllPlans();
    const usageLevels = [400, 600, 800, kWh];
    
    return allPlans.map(plan => ({
      ...plan,
      costs: usageLevels.map(usage => ({
        usage,
        cost: calculateCost(plan.daily, plan.rate, usage),
        isCurrentUsage: usage === parseInt(kWh)
      })),
      currentCost: calculateCost(plan.daily, plan.rate, kWh)
    })).sort((a, b) => a.currentCost - b.currentCost);
  };

  const handleCalculate = () => {
    const comparisonData = getComparisonData();
    const cheapestPlan = comparisonData[0];
    
    let currentProviderCost;
    if (selectedPlan === "Custom") {
      currentProviderCost = calculateCost(customDaily, customRate, kWh);
    } else {
      const providerPlans = comparisonData.filter(plan => plan.provider === selectedPlan);
      currentProviderCost = Math.min(...providerPlans.map(plan => plan.currentCost));
    }

    setAnnualSavings(currentProviderCost - cheapestPlan.currentCost);
  };
  


  // Every time the kWh OR provider OR custom plans change, run handleCalculate
  useEffect(() => {
    handleCalculate();
  }, [kWh, selectedPlan, customPlans]);

  return (
    <div className="container">
      <h1>Compare Electricity Plans</h1>
      
      {/* Dynamic Comparison Table */}
      <div className="comparison-section">
        <h3>Plan Comparison (Annual Costs)</h3>
        <div className="comparison-table">
          <div className="table-header">
            <div>Plan</div>
            <div>Daily Rate</div>
            <div>kWh Rate</div>
            <div>Low (400)</div>
            <div>Avg (600)</div>
            <div>High (800)</div>
            <div className="current-usage">Your Usage ({kWh})</div>
          </div>
          {getComparisonData().map((plan, idx) => (
            <div 
              key={`${plan.provider}-${plan.name}-${plan.id || idx}`} 
              className={`table-row ${idx === 0 ? 'cheapest' : ''} ${plan.provider === selectedPlan ? 'current-provider' : ''}`}
            >
              <div className="plan-name">
                <strong>{plan.name}</strong>
                <span className="provider">({plan.provider})</span>
              </div>
              <div>${plan.daily.toFixed(2)}</div>
              <div>${plan.rate.toFixed(3)}</div>
              <div>${calculateCost(plan.daily, plan.rate, 400).toFixed(0)}</div>
              <div>${calculateCost(plan.daily, plan.rate, 600).toFixed(0)}</div>
              <div>${calculateCost(plan.daily, plan.rate, 800).toFixed(0)}</div>
              <div className="current-cost">
                <strong>${plan.currentCost.toFixed(0)}</strong>
                {idx === 0 && <span className="badge">Cheapest</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        Current provider:
        <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
          <option>Mercury</option>
          <option>Genesis</option>
          <option>Custom</option>
        </select>
        {selectedPlan === "Custom" && (
          <>
            <input
              type="number"
              placeholder="Daily Rate"
              value={customDaily}
              onChange={(e) => setCustomDaily(parseFloat(e.target.value) || 0)}
            />
            <input
              type="number"
              placeholder="$/kWh"
              value={customRate}
              onChange={(e) => setCustomRate(parseFloat(e.target.value) || 0)}
            />
          </>
        )}

        <div>
          <label>
            Monthly kWh usage:
            <input
              type="number"
              value={kWh}
              onChange={(e) => setKWh(parseInt(e.target.value) || 0)}
            />
          </label>
        </div>
        <div className="action-buttons">
          <button onClick={() => setKWh(400)}>Low usage</button>
          <button onClick={() => setKWh(600)}>Average usage</button>
          <button onClick={() => setKWh(800)}>High usage</button>
        </div>
      </div>

      {/* Custom Plans Section */}
      <div className="custom-plans-section">
        <h3>Add Custom Plans</h3>
        <div className="add-plan">
          <input
            type="text"
            placeholder="Plan name"
            value={newPlanName}
            onChange={(e) => setNewPlanName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Daily rate ($)"
            value={newPlanDaily}
            onChange={(e) => setNewPlanDaily(e.target.value)}
            step="0.01"
          />
          <input
            type="number"
            placeholder="Rate ($/kWh)"
            value={newPlanRate}
            onChange={(e) => setNewPlanRate(e.target.value)}
            step="0.001"
          />
          <button onClick={addCustomPlan}>Add Plan</button>
        </div>
        
        {customPlans.length > 0 && (
          <div className="custom-plans-list">
            <h4>Your Custom Plans:</h4>
            {customPlans.map(plan => (
              <div key={plan.id} className="custom-plan-item">
                <span>{plan.name}: ${plan.daily}/day + ${plan.rate}/kWh</span>
                <span className="plan-cost">
                  Annual cost: ${calculateCost(plan.daily, plan.rate, kWh).toFixed(2)}
                </span>
                <button onClick={() => removeCustomPlan(plan.id)} className="remove-btn">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2>You save ${Math.abs(annualSavings).toFixed(2)} every year {annualSavings < 0 ? 'by switching' : 'with your current plan vs cheapest'}</h2>
      </div>
      
      <button
        className="cta"
        onClick={() =>
          (window.location.href = "https://contact.co.nz/friends/FRHMN95")
        }
      >
        Sign up for Contact now and get $100 in credit
      </button>

      <footer>
        <p>We receive $100 in credit if you use our link :)</p>
        <p>
          Made by <a href="https://twitter.com/almostefficient">Raza</a>, source <a href="https://github.com/almostefficient/nz-electricity-compare" target="_blank">here.</a>
        </p>
      </footer>
    </div>
  );
}
