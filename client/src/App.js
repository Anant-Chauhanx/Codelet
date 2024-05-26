import React, { useState } from "react";
import Header from "./components/header";
import { SubmissionsProvider } from "./context/SubmissionsContext";
import Form from "./components/Form";
import Submissions from "./components/Submissions";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isButtonClicked, setIsButtonClicked] = useState(null);

  return (
    <SubmissionsProvider>
      <div className="App">
        <Header onButtonClick={setIsButtonClicked} />
        <Form isButtonClicked={isButtonClicked} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Submissions />
      </div>
    </SubmissionsProvider>
  );
}

export default App;
