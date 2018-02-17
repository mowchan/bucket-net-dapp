import React, {Component} from 'react';
import Web3 from 'web3';
import {concat} from 'lodash';
import {CONTRACT_ADDRESS, CONTRACT_ABI} from './config/contract';
import {
  GROW_ADDED,
  TEMP_CHANGE,
  HUMIDITY_CHANGE,
  SOIL_MOISTURE_CHANGE,
  LIGHT_INTENSITY_CHANGE,
  INTAKE_TOGGLED,
  EXHAUST_TOGGLED,
  WATER_TOGGLED,
  LIGHT_TOGGLED
} from './config/events';
import {
  TOGGLE_INTAKE,
  TOGGLE_EXHAUST,
  TOGGLE_WATER,
  TOGGLE_LIGHT
} from './config/functions';
import {Container, Header, FlexRow} from './components/layout';
import {GrowCard, Reading, Toggle} from './components/grow';
import Chart from './components/Chart';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grow: {},
      temp: {},
      humidity: {},
      soilMoisture: {},
      lightIntensity: {},
      intakeActive: {},
      exhaustActive: {},
      waterActive: {},
      lightActive: {},
      web3: null
    };

    this.contractInterface = null
    this.contract = null;
  }

  componentWillMount() {
    const {web3} = window;

    if (typeof web3 !== 'undefined') {
      console.log('web3 connected!');
      this.setState({web3: new Web3(web3.currentProvider)});
    } else {
      console.log('No web3');
      return;
    }

    this.contractInterface = web3.eth.contract(CONTRACT_ABI);
    this.contract = this.contractInterface.at(CONTRACT_ADDRESS);
    this.contract.allEvents({fromBlock: 0, toBlock: 'latest'}).watch((error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      this.handleEvent(result);
    });
  }

  handleEvent = ({event, args}) => {
    const {web3} = window;
    const growId = web3.toDecimal(args.id);

    switch (event) {
      case GROW_ADDED:
        this.setState(prevState => ({
          grow: Object.assign(prevState.grow, {[growId]: args.name})
        }));
        break;
      case TEMP_CHANGE:
        this.setState(prevState => ({
          temp: Object.assign(prevState.temp, {[growId]: this.setDeepArray(prevState.temp[growId], args.temp)})
        }));
        break;
      case HUMIDITY_CHANGE:
        this.setState(prevState => ({
          humidity: Object.assign(prevState.humidity, {[growId]: this.setDeepArray(prevState.humidity[growId], args.humidity)})
        }));
        break;
      case SOIL_MOISTURE_CHANGE:
        this.setState(prevState => ({
          soilMoisture: Object.assign(prevState.soilMoisture, {[growId]: this.setDeepArray(prevState.soilMoisture[growId], args.soilMoisture)})
        }));
        break;
      case LIGHT_INTENSITY_CHANGE:
        this.setState(prevState => ({
          lightIntensity: Object.assign(prevState.lightIntensity, {[growId]: this.setDeepArray(prevState.lightIntensity[growId], args.lightIntensity)})
        }));
        break;
      case INTAKE_TOGGLED:
        this.setState(prevState => ({
          intakeActive: Object.assign(prevState.intakeActive, {[growId]: args.intakeActive})
        }));
        break;
      case EXHAUST_TOGGLED:
        this.setState(prevState => ({
          exhaustActive: Object.assign(prevState.exhaustActive, {[growId]: args.exhaustActive})
        }));
        break;
      case WATER_TOGGLED:
        this.setState(prevState => ({
          waterActive: Object.assign(prevState.waterActive, {[growId]: args.waterActive})
        }));
        break;
      case LIGHT_TOGGLED:
        this.setState(prevState => ({
          lightActive: Object.assign(prevState.lightActive, {[growId]: args.lightActive})
        }));
        break;
    };
  };

  setDeepArray = (array, newValue) => {
    const {web3} = window;

    if (!array) {
      return [web3.toDecimal(newValue)];
    }

    return concat(array, web3.toDecimal(newValue));
  };

  getLatestValue = (array) => {
    if (!array) {
      return 'n/a';
    }

    return array[array.length - 1];
  };

  getReadableStatus = (status) => {
    return status ? 'On' : 'Off';
  };

  toggleGrowComponent = (growId, contractFunction) => {
    const {web3} = window;

    this.contract[contractFunction](growId, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      console.log(result);
    });
  };

  renderConnected = () => {
    const {
      grow,
      temp,
      humidity,
      soilMoisture,
      lightIntensity,
      intakeActive,
      exhaustActive,
      waterActive,
      lightActive
    } = this.state;

    return Object.keys(grow).map(key => {
      return <GrowCard key={key}>
        <Container>
          <h1>{grow[key]}</h1>
          <FlexRow>
            <Reading>
              <h2>Temp</h2>
              <span>{this.getLatestValue(temp[key])}</span>
            </Reading>
            <Reading>
              <h2>Humidity</h2>
              <span>{this.getLatestValue(humidity[key])}</span>
            </Reading>
            <Reading>
              <h2>Soil Moisture</h2>
              <span>{this.getLatestValue(soilMoisture[key])}</span>
            </Reading>
            <Reading>
              <h2>Light Intensity</h2>
              <span>{this.getLatestValue(lightIntensity[key])}</span>
            </Reading>
          </FlexRow>
          <FlexRow>
            <Toggle onClick={() => this.toggleGrowComponent(key, TOGGLE_INTAKE)} enabled={intakeActive[key]}>
              <h2>Intake</h2>
            </Toggle>
            <Toggle onClick={() => this.toggleGrowComponent(key, TOGGLE_EXHAUST)} enabled={exhaustActive[key]}>
              <h2>Exhaust</h2>
            </Toggle>
            <Toggle onClick={() => this.toggleGrowComponent(key, TOGGLE_WATER)} enabled={waterActive[key]}>
              <h2>Water</h2>
            </Toggle>
            <Toggle onClick={() => this.toggleGrowComponent(key, TOGGLE_LIGHT)} enabled={lightActive[key]}>
              <h2>Light</h2>
            </Toggle>
          </FlexRow>
          <Chart data={temp[key]} />
        </Container>
      </GrowCard>;
    });
  };

  renderDisconnected = () => {
    return (
      <div>
        Metamask Not Connected
      </div>
    );
  };

  render() {
    const {web3} = this.state;

    return (
      <div>
        <Header>
          <Container>
            <h1>BucketNet</h1>
          </Container>
        </Header>
        {!web3 && this.renderDisconnected()}
        {!!web3 && this.renderConnected()}
      </div>
    );
  }
}

export default App;
