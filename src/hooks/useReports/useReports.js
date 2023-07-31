import { useMcQuery } from '@commercetools-frontend/application-shell';
import reportData from './fetch-data-for-reports..graphql';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import { changeDateFormat } from '../../helpers';
import dayjs from 'dayjs';

export const getCartsAndOrders = ({ lowerLimit, upperLimit }) => {
  console.log(lowerLimit, upperLimit);
  const cartLowerLimit = dayjs(lowerLimit)
    .subtract(14, 'd')
    .format('YYYY-MM-DD');
  const cartUpperLimit = dayjs(upperLimit)
    .subtract(14, 'd')
    .format('YYYY-MM-DD');

  const orderWhere = `createdAt > "${lowerLimit}" and createdAt < "${upperLimit}" `;
  const cartWhere = `lastModifiedAt > "${cartLowerLimit}" and lastModifiedAt < "${cartUpperLimit}"  and ( cartState = "Active"  )`;
  const { data, error } = useMcQuery(reportData, {
    variables: {
      orderWhere,
      cartWhere,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });
  if (error) {
    console.log(error);
  }
  if (data) {
    console.log(data);
  }
  console.time('value');
  const { newMergedArry } = changeDateFormat(data ? data : null);
  console.timeEnd('value');

  return {
    newMergedArry,
  };
};
