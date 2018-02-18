import React, {Component} from 'react';
import {MdAdd, MdDataUsage} from 'react-icons/lib/md';
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
import {ERROR_MESSAGE} from './config/error';
import {
  AddGrow,
  Container,
  Header,
  FlexRow,
  MetaMask,
  Modal,
  StatusHref,
  StatusNoHref
} from './components/layout';
import Grow from './components/Grow';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      owner: {
        address: '',
        growCount: 0,
        growIds: [],
        synced: false
      },
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
      pendingActions: [],
      modalVisible: false,
      inputText: {
        name: '',
        address: ''
      }
    };

    this.contractInterface = null
    this.contract = null;
  }

  componentWillMount() {
    const {web3} = window;

    if (typeof web3 !== 'undefined') {
      console.log('web3 connected!');
      web3.eth.getCoinbase((error, address) => {
        this.setState(prevState => ({
          owner: Object.assign(prevState.owner, {address}),
          web3: new Web3(web3.currentProvider)
        }), () => {
          this.contractInterface = web3.eth.contract(CONTRACT_ABI);
          this.contract = this.contractInterface.at(CONTRACT_ADDRESS);
          this.updateOwner().then(() => {
            this.watchEvents();
          }).catch(error => {
            console.log(error);
          });
        });
      })
    } else {
      console.log('No web3');
      return;
    }
  }

  updateOwner = () => {
    const {web3} = window;
    const {address} = this.state.owner;

    return new Promise((resolve, reject) => {
      this.contract.getGrowCount(address, (error, growCount) => {
        if (error) {
          console.log(error);
          reject(error);
        }

        const growIds = [];
        let loopCounter = 0;
        growCount = web3.toDecimal(growCount);

        for (let i = 0; i < growCount; i++) {
          this.contract.getGrowIdByIndex(i, (error, growId) => {
            if (error) {
              console.log(error);
              reject(error);
            }
        
            loopCounter++;
            growIds.push(web3.toDecimal(growId));

            if (loopCounter === growCount) {
              this.setState(prevState => ({
                owner: Object.assign(prevState.owner, {
                  growCount: growCount,
                  growIds: growIds,
                  synced: true
                })
              }), () => {
                resolve(growIds);
              });
            }
          });
        }
      });
    });
  };

  watchEvents = () => {
    this.contract.allEvents({fromBlock: 0, toBlock: 'latest'}).watch((error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      this.handleEvent(result);
    });
  };

  handleEvent = ({event, args}) => {
    const {web3} = window;
    const {synced} = this.state.owner;

    if (event !== GROW_ADDED) {
      this.handleEachEvent(event, args);
      return;
    }

    if (!synced) {
      this.updateOwner().then(growIds => {
        if (growIds.indexOf(web3.toDecimal(args.id)) !== -1) {
          this.handleEachEvent(event, args);
        }
      });
      return;
    }

    if (this.state.owner.growIds.indexOf(web3.toDecimal(args.id)) !== -1) {
      this.handleEachEvent(event, args);
    }
  };

  handleEachEvent = (event, args) => {
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

  toggleModal = () => {
    this.setState(prevState => ({
      modalVisible: !prevState.modalVisible
    }));
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
        contractFunction = event;
        break;
    }

    this.setState(prevState => ({
      pendingActions: prevState.pendingActions.filter(action => {
        return action !== contractFunction;
      })
    }));
  }

  isPendingAction = (contractFunction) => {
    const {pendingActions} = this.state;

    if (!pendingActions) {
      return false;
    }

    return pendingActions.indexOf(contractFunction) !== -1;
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

      return <Grow
        addPendingAction={this.addPendingAction}
        isPendingAction={this.isPendingAction}
        key={growId}
        contract={this.contract}
        data={data}
        setStatus={this.setStatus}
      />;
    });
  };

  renderDisconnected = () => {
    return (
      <Container>
        <MetaMask>
          <h1>No Network Connection</h1>
          <p>Metamask is required to use this site. To install Metamask <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">click here</a>.</p>
        </MetaMask>
      </Container>
    );
  };

  onChangeInput = ({target}) => {
    const {value} = target;
    const fieldName = target.attributes['name'].value;

    this.setState(prevState => ({
      inputText: Object.assign(prevState.inputText, {[fieldName]: value})
    }));
  };

  onNewGrow = (event) => {
    const {name, address} = this.state.inputText;

    event.preventDefault();

    this.contract.createGrow(name, address, (error, transactionHash) => {
      if (error) {
        this.setStatus(ERROR_MESSAGE, null);
        console.log(error);
        return;
      }

      this.setStatus('Transaction posted!', transactionHash);
      this.addPendingAction(GROW_ADDED);
      this.toggleModal();
      this.setState(prevState => ({
        owner: Object.assign(prevState.owner, {synced: false}),
        inputText: Object.assign(prevState.inputText, {
          name: '',
          address: ''
        })
      }));
    });
  };

  renderModal = () => {
    const {name, address} = this.state.inputText;
    const buttonDisabled = !name || !address;

    return (
      <Modal disabled={buttonDisabled}>
        <div>
          <h1>New Grow</h1>
          <form onSubmit={this.onNewGrow}>
            <input type="text" name="name" placeholder="Grow Name" onChange={this.onChangeInput} value={name} />
            <input type="text" name="address" placeholder="Bucket Address" onChange={this.onChangeInput} value={address} />
            <button type="submit" disabled={buttonDisabled}>
              Add Grow
              <MdAdd />
            </button>
            <p>
              We require the address of the bucket in order to enable the bucket
              to update environmental data in the BucketNet contract.
            </p>
          </form>
        </div>
        <button onClick={this.toggleModal} />
      </Modal>
    );
  };

  renderStatus = () => {
    const {message, transactionHash} = this.state.status;

    if (transactionHash) {
      const href = 'https://rinkeby.etherscan.io/tx/' + transactionHash;

      return (
        <StatusHref href={href} target="_blank" rel="noopener noreferrer">
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
    const {web3, modalVisible, status} = this.state;
    const isPending = this.isPendingAction(GROW_ADDED);

    return (
      <div>
        <Header>
          {!!status.message && this.renderStatus()}
          <Container>
            <FlexRow>
              <h1>Bucket&middot;Net</h1>
              {!!web3 && <AddGrow onClick={this.toggleModal} disabled={isPending}>
                New Grow
                {!isPending && <MdAdd />}
                {!!isPending && <MdDataUsage className="icon-spin" />}
              </AddGrow>}
            </FlexRow>
          </Container>
        </Header>
        {!!modalVisible && this.renderModal()}
        {!web3 && this.renderDisconnected()}
        {!!web3 && this.renderConnected()}
      </div>
    );
  }
}

export default App;
