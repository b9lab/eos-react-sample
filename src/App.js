import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Eos from "eosjs";

import {EosContext} from "./eos-context.js"

import SurveyList from './SurveyList.js';

const eos = Eos({keyProvider: "5Kb71WKbheKKjHUjUHQ3cBugHB4k6q4HhxFLdAAeP4DqUiF9GaG"});

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Surveys</h1>
        </header>
        <EosContext.Provider value={eos} >
          <SurveyList props={{eos:eos}} />
        </EosContext.Provider>
      </div>
    );
  }
}

export default App;