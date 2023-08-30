import React, { useState, useEffect } from "react";

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState("Mercury");
  const [kWh, setKWh] = useState(600);
  const [customDaily, setCustomDaily] = useState(0);
  const [customRate, setCustomRate] = useState(0);
  const [annualSavings, setAnnualSavings] = useState(0);
  
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

  const calculateCost = (daily, rate, kWh) => daily * 365 + rate * kWh * 12;

  const handleCalculate = () => {
    let plans;
    if (selectedPlan === "Mercury") plans = mercuryPlans;
    if (selectedPlan === "Genesis") plans = genesisPlans;
    if (selectedPlan === "Custom")
      plans = [{ daily: customDaily, rate: customRate }];

    const cheapestContactPlan = Math.min(
      ...contactPlans.map((plan) => calculateCost(plan.daily, plan.rate, kWh))
    );
    const currentCost = Math.min(
      ...plans.map((plan) => calculateCost(plan.daily, plan.rate, kWh))
    );

    setAnnualSavings(12*(currentCost - cheapestContactPlan));
  };
  
  useEffect(() => {
    const image = document.querySelector('img');
    let initialDistance;

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        const distance = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );

        if (!initialDistance) {
          initialDistance = distance;
        }

        const scale = distance / initialDistance;
        image.style.transform = `scale(${scale})`;
      }
    };

    image.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      image.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Every time the kWh OR provider changes, run handleCalculate
  useEffect(() => {
    handleCalculate();
  }, [kWh, selectedPlan]);

  return (
    <div className="container">
      <h1>Compare Electricity Plans</h1>
      <img src="/chart.png" alt="Electricity Plans Comparison Chart" style={{ maxWidth: '100%', touchAction: 'none' }} />
      <div>
        Current provider:
        <select onChange={(e) => setSelectedPlan(e.target.value)}>
          <option>Mercury</option>
          <option>Genesis</option>
          <option>Custom</option>
        </select>
        {selectedPlan === "Custom" && (
          <>
            <input
              type="number"
              placeholder="Daily Rate"
              onChange={(e) => setCustomDaily(e.target.value)}
            />
            <input
              type="number"
              placeholder="$/kWh"
              onChange={(e) => setCustomRate(e.target.value)}
            />
          </>
        )}

        <div>
          <label>
            Monthly kWh usage:
            <input
              type="number"
              value={kWh}
              onChange={(e) => setKWh(e.target.value)}
            />
          </label>
        </div>
        <div className="action-buttons">
          <button onClick={() => setKWh(400)}>Low usage</button>
          <button onClick={() => setKWh(600)}>Average usage</button>
          <button onClick={() => setKWh(800)}>High usage</button>
        </div>
      </div>
      <div>
        <h2> You save ${annualSavings.toFixed(2)} every year</h2>
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
