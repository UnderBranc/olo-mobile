import logo from './logo2.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
function App() {

  const [count, setCount] = useState(0);

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  },[]);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <code>Thanks for notifying us!</code>
        </p>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
    </div>
  );
}

export default App;
