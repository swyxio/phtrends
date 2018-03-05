import React from "react";
import ReactDOM from "react-dom";
import Papa from "papaparse";
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLabel,
  VictoryPortal,
  VictoryTooltip,
  VictoryAxis,
  VictoryVoronoiContainer
} from "victory";
import { DropDown } from "./components/dropdown";

const colors = ["#c74b16", "#c7166f", "#2516c7", "#16a9c7", "#16c72e"];
const months = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec"
};
const mapDate = datestr => {
  const year = Math.floor(Number(datestr) / 100);
  const rem = datestr % 100;
  return `${months[rem]} ${year}`;
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        1: "Web App",
        2: "iPhone",
        3: "Productivity",
        4: "Design Tools",
        5: null // "Developer Tools"
      }
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.loadData = this.loadData.bind(this);
    this.changeDataType = this.changeDataType.bind(this);
  }
  changeHandler(i) {
    return newValue => {
      this.setState(prev => {
        const newState = prev.selected;
        newState[i] = newValue;
        return { selected: newState };
      });
    };
  }
  loadData(str) {
    Papa.parse(str, {
      header: true,
      download: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      // Here this is also available. So we can call our custom class method
      complete: d => {
        this.setState({ data: d.data });
      }
    });
  }
  componentDidMount() {
    this.loadData(require("./trends_counts.csv"));
  }
  changeDataType(e) {
    if (e.target.value == "votes") this.loadData(require("./votes_counts.csv"));
    else this.loadData(require("./trends_counts.csv"));
  }
  render() {
    const { data, selected } = this.state;
    const dropdowns = (
      <div className="dropdown">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i}>
            Line {i}: <span style={{ backgroundColor: colors[i - 1] }} />
            <DropDown
              defaultItem={selected[i]}
              onChange={this.changeHandler(i)}
            />
          </div>
        ))}
      </div>
    );
    return (
      <div>
        <h1>Product Hunt Trends</h1>
        <p>
          <select onChange={this.changeDataType}>
            <option value="hunts">Number of hunts</option>
            <option value="votes">Sum of votes</option>
          </select>{" "}
          in the monthly top 50 tagged with the selected topic, 2014-2018
        </p>
        {dropdowns}
        <div style={{ display: "flex" }}>
          <VictoryChart
            containerComponent={
              <VictoryVoronoiContainer
                voronoiDimension="x"
                labels={d =>
                  `${d.date ? mapDate(d.date) + "\n\n" : ""}${d.series}: ${d.y}`
                }
                labelComponent={
                  <VictoryTooltip
                    cornerRadius={0}
                    flyoutStyle={{ fill: "white" }}
                  />
                }
              />
            }
            theme={VictoryTheme.material}
            width={800}
            height={400}
          >
            <VictoryLabel
              text="Product Hunt Trends"
              x={225}
              y={30}
              textAnchor="middle"
            />
            {data &&
              [1, 2, 3, 4, 5].map(
                i =>
                  selected[i] && (
                    <VictoryLine
                      key={i}
                      animate={{
                        duration: 2000,
                        onLoad: { duration: 1000 }
                      }}
                      style={{
                        data: { stroke: colors[i - 1] },
                        parent: { border: "1px solid #ccc" },
                        labels: { fill: colors[i - 1] }
                      }}
                      data={data.map(v => ({
                        x: String(v.index),
                        y: v[selected[i]],
                        series: selected[i],
                        date: i == 1 ? String(v.index) : null
                      }))}
                    />
                  )
              )}
            <VictoryAxis
              style={{ tickLabels: { angle: -60 } }}
              tickFormat={tick =>
                tick % 100 - 1 ? tick % 100 : Math.floor(tick / 100)
              }
              tickLabelComponent={
                <VictoryPortal>
                  <VictoryLabel />
                </VictoryPortal>
              }
            />
            <VictoryAxis dependentAxis tickFormat={tick => `${tick}`} />
          </VictoryChart>
        </div>
        <div>
          See{" "}
          <a href="https://github.com/sw-yx/phtrends" target="_blank">
            Source
          </a>{" "}
          by{" "}
          <a href="https://twitter.com/swyx" target="_blank">
            @swyx
          </a>. With thanks to:{" "}
          <a href="https://reactjs.org" target="_blank">
            Facebook | React
          </a>,{" "}
          <a href="https://github.com/parcel-bundler/parcel" target="_blank">
            Parcel Bundler | Parcel
          </a>,{" "}
          <a href="http://formidable.com/open-source/victory" target="_blank">
            Formidable Labs | Victory
          </a>,{" "}
          <a href="https://github.com/paypal/downshift" target="_blank">
            Paypal | Downshift
          </a>.
        </div>
      </div>
    );
  }
}

const app = document.getElementById("app");
ReactDOM.render(<Main />, app);
