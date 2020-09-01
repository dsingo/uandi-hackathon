import React from 'react';
import Routes from './routes';
import './App.css';
import { UserContextWrapper } from './UserContext';

function App() {
  return (
    <UserContextWrapper>
      <div className="App">
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;600;700&display=swap" rel="stylesheet"></link>
        <Routes />
      </div>
    </UserContextWrapper>
  );
}

export default App;
