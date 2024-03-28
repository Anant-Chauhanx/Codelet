import React, { useState } from 'react';
import Header from './components/header';
import { SubmissionsProvider } from './context/SubmissionsContext';
import Form from './components/Form';
import Submissions from './components/Submissions';
import './App.css';

function App() {
  const [isButtonClicked, setIsButtonClicked] = useState(null);

  return (
    <SubmissionsProvider>
      <div className="App">
        <Header onButtonClick={setIsButtonClicked} />
        <Form isButtonClicked={isButtonClicked} />
        <Submissions />
      </div>
    </SubmissionsProvider>
  );
}

export default App;

