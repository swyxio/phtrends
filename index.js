import React from "react";
import ReactDOM from "react-dom";
// import V from "victory";
import Papa from "papaparse";

class Main extends React.Component {
  componentDidMount() {
    Papa.parse(require("./trends_counts.csv"), {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      // Here this is also available. So we can call our custom class method
      complete: console.log
    });
  }
  render() {
    return (
      <div>
        <h1>Victory Tutorial</h1>
      </div>
    );
  }
}

const app = document.getElementById("app");
ReactDOM.render(<Main />, app);
