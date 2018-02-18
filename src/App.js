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
import {
  TOGGLE_INTAKE,
  TOGGLE_EXHAUST,
  TOGGLE_WATER,
  TOGGLE_LIGHT
} from './config/functions';
import {
  AddGrow,
  Container,
  Header,
  FlexRow,
  StatusHref,
  StatusNoHref
} from './components/layout';
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
      web3: null,
      status: {
        message: null,
        transactionHash: null
      },
      pendingActions: []
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

    this.removePendingAction(event);

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

  setStatus = (message, transactionHash) => {
    this.setState({
      status: {
        message,
        transactionHash
      }
    }, () => {
      setTimeout(() => {
        this.setState({
          status: {
            message: null,
            transactionHash: null
          }
        });
      }, 10000);
    });
  };

  addPendingAction = (contractFunction) => {
    this.setState(prevState => ({
      pendingActions: concat(prevState.pendingActions, contractFunction)
    }));
  };

  removePendingAction = (event) => {
    let contractFunction;

    switch (event) {
      case INTAKE_TOGGLED:
        contractFunction = TOGGLE_INTAKE;
        break;
      case EXHAUST_TOGGLED:
        contractFunction = TOGGLE_EXHAUST;
        break;
      case WATER_TOGGLED:
        contractFunction = TOGGLE_WATER;
        break;
      case LIGHT_TOGGLED:
        contractFunction = TOGGLE_LIGHT;
        break;
      default:
        break;
    }

    this.setState(prevState => ({
      pendingActions: prevState.pendingActions.filter(action => {
        return action !== contractFunction;
      })
    }));
  }

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
      lightActive,
      pendingActions
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

      return <Grow
        addPendingAction={this.addPendingAction}
        pendingActions={pendingActions}
        key={growId}
        contract={this.contract}
        data={data}
        setStatus={this.setStatus}
      />;
    });
  };

  renderDisconnected = () => {
    return (
      <div>
        Metamask Not Connected
      </div>
    );
  };

  renderStatus = () => {
    const {message, transactionHash} = this.state.status;

    if (transactionHash) {
      const href = 'https://rinkeby.etherscan.io/tx/' + transactionHash;

      return (
        <StatusHref href={href} target="_blank">
          <Container>
            {message} {transactionHash}
          </Container>
        </StatusHref>
      );
    }

    return (
      <StatusNoHref>
        <Container>
          {message}
        </Container>
      </StatusNoHref>
    );
  };

  render() {
    const {web3, status} = this.state;

    return (
      <div>
        <Header>
          {!!status.message && this.renderStatus()}
          <Container>
            <FlexRow>
              <h1>Bucket&middot;Net</h1>
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
