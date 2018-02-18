import React, {Component} from 'react';
import {MdDataUsage} from 'react-icons/lib/md';
import {
  TOGGLE_INTAKE,
  TOGGLE_EXHAUST,
  TOGGLE_WATER,
  TOGGLE_LIGHT
} from '../config/functions';
import {GrowCard, Reading, Toggle} from './styled';
import {Container, FlexRow} from './layout';
import Chart from './Chart';

const TEMP = 'Temp';
const HUMIDITY = 'Humidity';
const SOIL_MOISTURE = 'SoilMoisture';
const LIGHT_INTENSITY = 'LightIntensity';
const ACTIVE = 'active';

export default class Grow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTemp: props.data.temp,
      activeHumidity: props.data.humidity,
      activeSoilMoisture: props.data.soilMoisture,
      activeLightIntensity: props.data.lightIntensity
    };
  }

  componentWillReceiveProps({data}) {
    this.setState({
      activeTemp: this.getLatestValue(data.temp),
      activeHumidity: this.getLatestValue(data.humidity),
      activeSoilMoisture: this.getLatestValue(data.soilMoisture),
      activeLightIntensity: this.getLatestValue(data.lightIntensity)
    });
  }

  getLatestValue = (values) => {
    if (!values) {
      return 0;
    }

    return values[values.length - 1];
  };

  getReadableStatus = (status) => {
    return status ? 'On' : 'Off';
  };

  setActiveValue = (key, value) => {
    this.setState({[ACTIVE + key]: value});
  };

  isPendingAction = (contractFunction) => {
    const {pendingActions} = this.props;

    if (!pendingActions) {
      return false;
    }

    return pendingActions.indexOf(contractFunction) !== -1;
  };

  toggleGrowComponent = (growId, contractFunction) => {
    const {setStatus, addPendingAction} = this.props;

    this.props.contract[contractFunction](growId, (error, transactionHash) => {
      if (error) {
        setStatus('Something went wrong when posting that transaction. Please try again.', null);
        console.log(error);
        return;
      }

      setStatus('Transaction posted!', transactionHash);
      addPendingAction(contractFunction);
    });
  };

  render() {
    const {
      growId,
      grow,
      temp,
      humidity,
      soilMoisture,
      lightIntensity,
      intakeActive,
      exhaustActive,
      waterActive,
      lightActive
    } = this.props.data;
    const activeTemp = this.state.activeTemp || this.getLatestValue(temp);
    const activeHumidity = this.state.activeHumidity || this.getLatestValue(humidity);
    const activeSoilMoisture = this.state.activeSoilMoisture || this.getLatestValue(soilMoisture);
    const activeLightIntensity = this.state.activeLightIntensity || this.getLatestValue(lightIntensity);

    return (
      <GrowCard>
        <Container>
          <h1>{grow}</h1>
          <FlexRow>
            <Reading>
              <h2>Temp</h2>
              <div>
                <h3>{activeTemp}</h3>
                <span>&deg;F</span>
              </div>
              <Chart name={TEMP} data={temp} setActiveValue={this.setActiveValue} />
            </Reading>
            <Reading>
              <h2>Humidity</h2>
              <div>
                <h3>{activeHumidity}</h3>
                <span>%</span>
              </div>
              <Chart name={HUMIDITY} data={humidity} setActiveValue={this.setActiveValue} />
            </Reading>
          </FlexRow>
          <FlexRow>
            <Reading>
              <h2>Soil Moisture</h2>
              <div>
                <h3>{activeSoilMoisture}</h3>
                <span>%</span>
              </div>
              <Chart name={SOIL_MOISTURE} data={soilMoisture} setActiveValue={this.setActiveValue} />
            </Reading>
            <Reading>
              <h2>Light Intensity</h2>
              <div>
                <h3>{activeLightIntensity}</h3>
                <span>%</span>
              </div>
              <Chart name={LIGHT_INTENSITY} data={lightIntensity} setActiveValue={this.setActiveValue} />
            </Reading>
          </FlexRow>
          <FlexRow>
            <Toggle onClick={() => this.toggleGrowComponent(growId, TOGGLE_INTAKE)} enabled={intakeActive} disabled={this.isPendingAction(TOGGLE_INTAKE)}>
              <FlexRow>
                <h2>Intake</h2>
                {!!this.isPendingAction(TOGGLE_INTAKE) && <MdDataUsage className="icon-spin" />}
                <span>{this.getReadableStatus(intakeActive)}</span>
              </FlexRow>
            </Toggle>
            <Toggle onClick={() => this.toggleGrowComponent(growId, TOGGLE_EXHAUST)} enabled={exhaustActive} disabled={this.isPendingAction(TOGGLE_EXHAUST)}>
              <FlexRow>
                <h2>Exhaust</h2>
                {!!this.isPendingAction(TOGGLE_EXHAUST) && <MdDataUsage className="icon-spin" />}
                <span>{this.getReadableStatus(exhaustActive)}</span>
              </FlexRow>
            </Toggle>
            <Toggle onClick={() => this.toggleGrowComponent(growId, TOGGLE_WATER)} enabled={waterActive} disabled={this.isPendingAction(TOGGLE_WATER)}>
              <FlexRow>
                <h2>Water</h2>
                {!!this.isPendingAction(TOGGLE_WATER) && <MdDataUsage className="icon-spin" />}
                <span>{this.getReadableStatus(waterActive)}</span>
              </FlexRow>
            </Toggle>
            <Toggle onClick={() => this.toggleGrowComponent(growId, TOGGLE_LIGHT)} enabled={lightActive} disabled={this.isPendingAction(TOGGLE_LIGHT)}>
              <FlexRow>
                <h2>Light</h2>
                {!!this.isPendingAction(TOGGLE_LIGHT) && <MdDataUsage className="icon-spin" />}
                <span>{this.getReadableStatus(lightActive)}</span>
              </FlexRow>
            </Toggle>
          </FlexRow>
        </Container>
      </GrowCard>
    );
  }
}
