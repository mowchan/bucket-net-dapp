import React, {Component} from 'react';
import {MdAdd} from 'react-icons/lib/md';
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
import {AddGrow, Container, Header, FlexRow} from './components/layout';
import Grow from './components/Grow';

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
      default:
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

    return Object.keys(grow).map(growId => {
      const data = {
        growId,
        grow: grow[growId],
        temp: temp[growId],
        humidity: humidity[growId],
        soilMoisture: soilMoisture[growId],
        lightIntensity: lightIntensity[growId],
        intakeActive: intakeActive[growId],
        exhaustActive: exhaustActive[growId],
        waterActive: waterActive[growId],
        lightActive: lightActive[growId]
      };

      return <Grow key={growId} contract={this.contract} data={data} />;
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
            <FlexRow>
              <h1>BucketNet</h1>
              <AddGrow onClick={() => console.log('add grow')}>
                New Grow <MdAdd />
              </AddGrow>
            </FlexRow>
          </Container>
        </Header>
        {!web3 && this.renderDisconnected()}
        {!!web3 && this.renderConnected()}
      </div>
    );
  }
}

export default App;
