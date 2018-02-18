import React, {Component} from 'react';
import {Area, AreaChart, ResponsiveContainer} from 'recharts';
import {ChartWrapper} from './styled';

export default class Chart extends Component {
  static chartStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };


  getShapedData = () => {
    const {data} = this.props;

    return data.map((value, index) => {
      return {value};
    });
  };

  onMouseLeave = () => {
    const {name, data, setActiveValue} = this.props;
    setActiveValue(name, data[data.length - 1]);
  };

  onMouseMove = (event) => {
    if (!event) {
      return;
    }

    const {activeTooltipIndex} = event;
    const {name, data, setActiveValue} = this.props;
    setActiveValue(name, data[activeTooltipIndex]);
  };

  render() {
    if (!this.props.data) {
      return null;
    }

    return (
      <ChartWrapper>
        <ResponsiveContainer width="100%" height={187} style={this.chartStyle}>
          <AreaChart
            data={this.getShapedData()}
            onMouseLeave={this.onMouseLeave}
            onMouseMove={this.onMouseMove}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#edc9f5" stopOpacity={1}/>
                <stop offset="95%" stopColor="#edc9f5" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <Area
              activeDot={true}
              isAnimationActive={false}
              type="monotone"
              dataKey="value"
              stroke="#d681e8"
              fill="url(#gradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }
}
