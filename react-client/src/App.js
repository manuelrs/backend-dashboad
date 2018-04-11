import React, { Component } from 'react';
import logo from './logo.svg';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import './App.css';
import { getAcquisitionData } from "./api";
import { getMonetizationData } from "./api";
import DatePicker from 'react-date-picker';
import moment from 'moment'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = props;
    this.retrieveData = this.retrieveData.bind(this)
  }
  state = {
    startDate: new Date(),
    endDate: new Date(),
    queryDataRetrieved: false,
    pivotData: []
  }


  onChangeStart = startDate => this.setState({ startDate })
  onChangeEnd = endDate => this.setState({ endDate })


  retrieveData = function () {

    if (this.state.startDate !== undefined && this.state.endDate !== undefined) {
      let dates = {
        startDate: moment(this.state.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.state.endDate).format("YYYY-MM-DD")
      }
      Promise.all([getAcquisitionData(dates), getMonetizationData(dates)]).then(([acquisitionQuery, monetizationQuery]) => {
        var fullData = acquisitionQuery.data.concat(monetizationQuery);
        this.setState({ pivotData: fullData })
        this.setState({ queryDataRetrieved: true })

      })
    }
  }


  render() {
    return (
      <div className="App" >
        <header className="App-header">
          <h1 className="App-title">Revenue and Cost overview</h1>
        </header>
        <div>
          <h4>Start date</h4>
          <DatePicker
            onChange={this.onChangeStart}
            value={this.state.startDate}
          />
        </div>
        <div>
          <h4>End date</h4>
          <DatePicker
            onChange={this.onChangeEnd}
            value={this.state.endDate}
          />
        </div>
        <button onClick={this.retrieveData}>
          Retrieve data
          </button>
        {
          this.state.queryDataRetrieved
          && (<div>
            <PivotTableUI
              data={
                this.state.pivotData
              }
              onChange={s => this.setState(s)}
              {...this.state}
            />
          </div>)}
      </div>
    );
  }
}

export default App;
