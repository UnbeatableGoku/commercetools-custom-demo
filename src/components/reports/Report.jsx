import React, { useState } from 'react';
import { getCartsAndOrders } from '../../hooks/useReports/useReports';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import SelectInput from '@commercetools-uikit/select-input';
import { selectDateOptions } from '../../constants';
import { setDateRange } from '../../helpers';
const Report = () => {
  const [option, setOption] = useState(selectDateOptions.this_week);
  const { newMergedArry } = getCartsAndOrders(setDateRange(option, 'notLabel'));
  return (
    <div>
      <SelectInput
        name="form-field-name"
        value={option}
        onChange={(event) => {
          setOption(event.target.value);
        }}
        options={[
          {
            value: selectDateOptions.this_week,
            label: setDateRange(selectDateOptions.this_week, 'label'),
          },
          {
            value: selectDateOptions.this_month,
            label: setDateRange(selectDateOptions.this_month, 'label'),
          },
          {
            value: selectDateOptions.this_year,
            label: setDateRange(selectDateOptions.this_year, 'label'),
          },
        ]}
      />
      <ResponsiveContainer width={'90%'} height={250}>
        <AreaChart
          data={newMergedArry}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4b4b4b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4b4b4b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00b39b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00b39b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="orderCount"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            type="monotone"
            dataKey="cartCount"
            stroke="#00b39b"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Report;
