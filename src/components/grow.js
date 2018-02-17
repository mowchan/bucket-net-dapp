import React, {Component} from 'react';
import {
  TOGGLE_INTAKE,
  TOGGLE_EXHAUST,
  TOGGLE_WATER,
  TOGGLE_LIGHT
} from '../config/functions';
import {GrowCard, Reading, Toggle} from './styled';
import {Container, FlexRow} from './layout';
import Chart from './Chart';

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
    this.setState({
      ['active' + key]: value
    });
  };

  toggleGrowComponent = (growId, contractFunction) => {
    this.props.contract[contractFunction](growId, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }

      console.log(result);
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
              <Chart name="Temp" data={temp} setActiveValue={this.setActiveValue} />
            </Reading>
            <Reading>
              <h2>Humidity</h2>
              <div>
                <h3>{activeHumidity}</h3>
                <span>%</span>
              </div>
              <Chart name="Humidity" data={humidity} setActiveValue={this.setActiveValue} />
            </Reading>
          </FlexRow>
          <FlexRow>
            <Reading>
              <h2>Soil Moisture</h2>
              <div>
                <h3>{activeSoilMoisture}</h3>
                <span>%</span>
              </div>
              <Chart name="SoilMoisture" data={soilMoisture} setActiveValue={this.setActiveValue} />
            </Reading>
            <Reading>
              <h2>Light Intensity</h2>
              <div>
                <h3>{activeLightIntensity}</h3>
                <span>%</span>
              </div>
              <Chart name="LightIntensity" data={lightIntensity} setActiveValue={this.setActiveValue} />
            </Reading>
          </FlexRow>
          <FlexRow>
            <Toggle onClick={() => this.toggleGrowComponent(growId, TOGGLE_INTAKE)} enabled={intakeActive}>
              <FlexRow>
                <h2>Intake</h2>
                <span>{this.getReadableStatus(intakeActive)}</span>
              </FlexRow>
            </Toggle>
            <Toggle onClick={() => this.toggleGrowComponent(growId, TOGGLE_EXHAUST)} enabled={exhaustActive}>
              <FlexRow>
                <h2>Exhaust</h2>
                <span>{this.getReadableStatus(exhaustActive)}</span>
              </FlexRow>
            </Toggle>
            <Toggle onClick={() => this.toggleGrowComponent(growId, TOGGLE_WATER)} enabled={waterActive}>
              <FlexRow>
                <h2>Water</h2>
                <span>{this.getReadableStatus(waterActive)}</span>
              </FlexRow>
            </Toggle>
            <Toggle onClick={() => this.toggleGrowComponent(growId, TOGGLE_LIGHT)} enabled={lightActive}>
              <FlexRow>
                <h2>Light</h2>
                <span>{this.getReadableStatus(lightActive)}</span>
              </FlexRow>
            </Toggle>
          </FlexRow>
        </Container>
      </GrowCard>
    );
  }
}
