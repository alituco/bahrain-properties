"use client";

import { useState } from 'react';
// Import MUI's CircularProgress
import CircularProgress from '@mui/material/CircularProgress';

export default function AddValuationPage() {
  // Local state for form fields
  const [parcelNo, setParcelNo] = useState('');
  const [valuationType, setValuationType] = useState('');
  const [valuationAmount, setValuationAmount] = useState('');
  const [agentName, setAgentName] = useState('');
  const [numOfRoads, setNumOfRoads] = useState('');
  const [listingSize, setListingSize] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddValuation = async () => {
    setLoading(true); 
    setMessage('');   
    try {
      // 1. Ensure the parcel is in the DB
      const ensureResponse = await fetch(`http://localhost:4000/ensureParcel/${parcelNo}`);
      const ensureData = await ensureResponse.json();
      if (!ensureData.success) {
        setMessage(`Property for parcel ${parcelNo} could not be fetched.`);
        return;
      }
      
      // 2. Add the valuation
      const response = await fetch('http://localhost:4000/addValuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          parcel_no: parcelNo,
          valuation_type: valuationType,
          valuation_amount: valuationAmount,
          agent_name: agentName,
          num_of_roads: numOfRoads,
          listing_size: listingSize
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage(`Success: ${data.message}`);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding valuation:', error);
      setMessage('Error adding valuation. Check console for details.');
    } finally {
      setLoading(false); 
    }
  };  

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Add New Valuation</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
        <label>
          Parcel No:
          <input
            type="text"
            value={parcelNo}
            onChange={(e) => setParcelNo(e.target.value)}
          />
        </label>

        <label>
          Valuation Type (e.g. listing_price, sold_price):
          <input
            type="text"
            value={valuationType}
            onChange={(e) => setValuationType(e.target.value)}
          />
        </label>

        <label>
          Valuation Amount:
          <input
            type="number"
            value={valuationAmount}
            onChange={(e) => setValuationAmount(e.target.value)}
          />
        </label>

        <label>
          Agent Name:
          <input
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
          />
        </label>

        <label>
          Number of Roads:
          <input
            type="number"
            value={numOfRoads}
            onChange={(e) => setNumOfRoads(e.target.value)}
          />
        </label>

        <label>
          Listing Size (sqm):
          <input
            type="number"
            value={listingSize}
            onChange={(e) => setListingSize(e.target.value)}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {/* If loading, show spinner and disable the button */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={24} />
            <span style={{ marginLeft: '8px' }}>Processing...</span>
          </div>
        ) : (
          <button onClick={handleAddValuation}>Add Valuation</button>
        )}
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}
