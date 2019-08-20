import React from "react";
import "./App.css";
import { AddMessage } from "./AddMessage";
import { Messages } from "./Messages";

const App: React.FC = () => {
  return (
    <div className="App">
      <AddMessage />
      <Messages />
    </div>
  );
};

export default App;
