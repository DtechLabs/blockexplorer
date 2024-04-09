import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockDetails, setBlockDetails] = useState({});
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      if (blockNumber) {
        const block = await alchemy.core.getBlock(blockNumber);
        setBlockDetails({
          hash: block.hash,
          parentHash: block.parentHash,
          timestamp: block.timestamp,
          nonce: block.nonce,
          difficulty: block.difficulty,
          gasLimit: block.gasLimit.toString(),
          gasUsed: block.gasUsed.toString(),
          miner: block.miner,
          extraData: block.extraData,
          baseFeePerGas: block.baseFeePerGas?.toString() || 'N/A' // Handle case where baseFeePerGas might not be present
        });

        setTransactions(block.transactions);
      }
    };

    fetchBlockDetails();
  }, [blockNumber]); // This effect runs when blockNumber changes

  alchemy.ws.on("block", (blockNumber) => { 
    setBlockNumber(blockNumber);
    console.log("New block", blockNumber);
  });

  return (
    <div className="App">
      <div className="container">
        <label htmlFor="info">Last block:</label>
        <span id="info">{blockNumber}</span>
      </div>
      <div className="container table-responsive">
        <table className="table">
          <tbody>
            {Object.entries(blockDetails).map(([key, value]) => (
              <tr key={key}>
                <td className="detail-label">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}:</td>
                <td className="detail-value">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="container table-container">
        <h5>Transactions</h5>
        <div className="scrollable-table">
          <table className="table table-striped">
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td>{tx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
