import React, {Component} from 'react';
import {CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend} from 'recharts';

export default class Chart extends Component {
  render() {
    const {data} = this.props;

    if (!data) {
      return null;
    }

    const shapedData = data.map((tempValue, index) => {
      return {
        name: index,
        value: tempValue
      }
    });

    console.log(shapedData);

    return (
      <LineChart width={630} height={430} data={shapedData}>
        <Line type='monotone' dataKey='value' stroke='#8884d8' strokeWidth={2} />
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
      </LineChart>
    );
  }
}
