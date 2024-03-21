import React, { useEffect, useState } from "react";

function App() {
  // State for the amount entered by the user
  const [amount, setAmount] = useState(1);

  // State for the currency selected as 'from'
  const [fromCur, setFromCur] = useState("USD");

  // State for the currency selected as 'to'
  const [toCur, setToCur] = useState("INR");

  // State for the converted amount
  const [converted, setConverted] = useState("");

  // State for storing the fetched currency rates
  const [rates, setRates] = useState({});

  // State to track if data is being fetched
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch currency data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.frankfurter.app/latest?");
        const data = await response.json();
        setRates(data.rates); // Update the rates state with fetched data
        setIsLoading(false); // Update loading state to false once data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Update loading state to false in case of error
      }
    };
    fetchData(); // Call the fetchData function when component mounts
  }, []); // Dependency array is empty, so this effect only runs once after the initial render

  // Function to handle currency conversion
  useEffect(() => {
    const convertCurrency = () => {
      // Calculate the converted amount based on the entered amount, selected 'from' and 'to' currencies, and fetched rates
      const convertedAmount = (amount * rates[toCur]) / rates[fromCur];
      setConverted(convertedAmount.toFixed(2)); // Update the converted amount state, rounding to 2 decimal places
    };
    convertCurrency(); // Call the convertCurrency function whenever amount, fromCur, toCur, or rates change
  }, [amount, fromCur, toCur, rates]);

  // Function to swap 'from' and 'to' currencies
  const handleSwap = () => {
    setFromCur(toCur); // Set 'from' currency to 'to' currency
    setToCur(fromCur); // Set 'to' currency to 'from' currency
  };

  return (
    <div className="container">
      {/* Heading */}
      <h3>Currency Converter</h3>

      {/* Input field for entering amount */}
      <div className="input-container">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          disabled={isLoading} // Disable input field while data is being fetched
          placeholder="Enter amount" // Placeholder text for input field
          className="input-field" // CSS class for styling
        />
      </div>

      {/* Dropdown for selecting 'from' currency */}
      <div className="select-container">
        <select
          value={fromCur}
          onChange={(e) => setFromCur(e.target.value)}
          disabled={isLoading} // Disable select dropdown while data is being fetched
          className="select-field" // CSS class for styling
        >
          {/* Map over the fetched rates and create options for the select dropdown */}
          {Object.keys(rates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      {/* Button to swap 'from' and 'to' currencies */}
      <button className="swap-button" onClick={handleSwap}>
        <span className="swap-icon">⇅</span>
        <span className="swap-text">Swap</span>
      </button>

      {/* Dropdown for selecting 'to' currency */}
      <div className="select-container">
        <select
          value={toCur}
          onChange={(e) => setToCur(e.target.value)}
          disabled={isLoading} // Disable select dropdown while data is being fetched
          className="select-field" // CSS class for styling
        >
          {/* Map over the fetched rates and create options for the select dropdown */}
          {Object.keys(rates).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      {/* Display the converted amount */}
      <div className="result-container">
        <input
          type="text"
          value={isLoading ? "Loading..." : converted}
          disabled={isLoading} // Make the input field read-only while data is being fetched
          readOnly // Make the input field read-only
          className="result" // CSS class for styling
        />
      </div>
    </div>
  );
}

export default App;
