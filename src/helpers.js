import {
  transformLocalizedStringToLocalizedField,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';
import dayjs from 'dayjs';
import { countBy, map } from 'lodash';
import { selectDateOptions } from './constants';

export const getErrorMessage = (error) =>
  error.graphQLErrors?.map((e) => e.message).join('\n') || error.message;

export const extractErrorFromGraphQlResponse = (graphQlResponse) => {
  if (
    typeof graphQlResponse.networkError?.result !== 'string' &&
    graphQlResponse.networkError?.result?.errors?.length > 0
  ) {
    return graphQlResponse.networkError.result.errors;
  }

  if (graphQlResponse.graphQLErrors?.length > 0) {
    return graphQlResponse.graphQLErrors;
  }

  return graphQlResponse;
};

const getNameFromPayload = (payload) => ({
  name: transformLocalizedStringToLocalizedField(payload.name),
});

const getDescriptionFromPayload = (payload) => ({
  description: transformLocalizedStringToLocalizedField(payload.description),
});

const convertAction = (actionName, actionPayload) => ({
  [actionName]:
    actionName === 'changeName'
      ? getNameFromPayload(actionPayload)
      : actionName === 'setDescription'
      ? getDescriptionFromPayload(actionPayload)
      : actionPayload,
});

export const createGraphQlUpdateActions = (actions) =>
  actions.reduce(
    (previousActions, { action: actionName, ...actionPayload }) => [
      ...previousActions,
      convertAction(actionName, actionPayload),
    ],
    []
  );

export const convertToActionData = (draft) => ({
  ...draft,
  name: transformLocalizedFieldToLocalizedString(draft.nameAllLocales || []),
  description: transformLocalizedFieldToLocalizedString(
    draft.descriptionAllLocales || []
  ),
});

export const checkStatusOfProducts = (products, type) => {
  console.log(
    products,
    type,
    'this is status type -------------------------------------------status type '
  );

  const filteredProduct =
    type === 'published'
      ? products.filter(
          (product) => product.published === false || product.modified === true
        )
      : products.filter((product) => product.published === true);

  // console.log(filteredProduct, '============new logic array ');

  // const filteredProductsTypePublished = products.filter((product) =>
  //   type === 'published'
  //     ? product.published === false
  //       ? product.modified === true
  //       : true
  //     : false
  // );

  // const filteredProductsTypeUnpublished = products.filter((product) =>
  //   type === 'unpublished' ? product.published === true : false
  // );

  // if (
  //   filteredProductsTypePublished.length < 1 &&
  //   filteredProductsTypeUnpublished.length < 1
  // ) {
  //   return false;
  // }

  // const filteredProducts =
  //   type === 'published'
  //     ? filteredProductsTypePublished
  //     : filteredProductsTypeUnpublished;

  return filteredProduct;
};

export const checkStatusOfSingleProduct = (products, type) => {
  const filteredProduct =
    type === 'published'
      ? products.filter((product) => product.masterData.published === false)
      : products.filter((product) => product.masterData.published === true);

  return filteredProduct;
};

export const changeDateFormat = (data) => {
  const orderData = data?.orders?.results;
  const cartData = data?.carts?.results;

  const newOrderDate =
    orderData &&
    orderData.map((item) => {
      return { date: dayjs(item.createdAt).format('YYYY/MM/DD') };
    });

  const newCartDate =
    cartData &&
    cartData.map((item) => {
      return {
        date: dayjs(item.lastModifiedAt).add(14, 'd').format('YYYY/MM/DD'),
      };
    });

  const orderCounter =
    newOrderDate &&
    map(countBy(newOrderDate, 'date'), (value, date) => {
      return {
        date,
        orderCount: value,
        cartCount: 0,
      };
    });

  const cartCounter =
    newCartDate &&
    map(countBy(newCartDate, 'date'), (value, date) => {
      return {
        date,
        cartCount: value,
        orderCount: 0,
      };
    });

  const mergArr = orderCounter &&
    cartCounter && [...orderCounter, ...cartCounter];
  console.log(mergArr);

  const dateMap = new Map();
  console.log(dateMap);

  mergArr &&
    mergArr.forEach((item) => {
      if (dateMap.has(item.date)) {
        const existingItem = dateMap.get(item.date);
        existingItem.orderCount += item.orderCount;
        existingItem.cartCount += item.cartCount;
      } else {
        dateMap.set(item.date, { ...item });
      }
    });

  const mergedArray = [];
  dateMap.forEach((item) => mergedArray.push(item));

  console.log(mergedArray);
  const newMergedArry = mergedArray.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  newMergedArry.forEach((item) => {
    item.date = dayjs(item.date).format('D MMM');
  });
  console.log(newMergedArry);
  return {
    newMergedArry,
  };
};

const getWeekRange = (formatType) => {
  const lowerLimit = dayjs().startOf('week').format(formatType);
  const upperLimit = dayjs().endOf('week').format(formatType);
  switch (formatType) {
    case 'D MMM':
      return `This Week From ${lowerLimit} To ${upperLimit} `;
    default:
      return {
        lowerLimit,
        upperLimit,
      };
  }
};

const getYearRange = (formatType) => {
  const lowerLimit = dayjs().startOf('year').format(formatType);
  const upperLimit = dayjs().endOf('year').format(formatType);

  switch (formatType) {
    case 'D MMM':
      return `This Year  From ${lowerLimit} To ${upperLimit}`;
    default:
      return {
        lowerLimit,
        upperLimit,
      };
  }
};
const getMonthRange = (formatType) => {
  const lowerLimit = dayjs().startOf('month').format(formatType);
  const upperLimit = dayjs().endOf('month').format(formatType);

  switch (formatType) {
    case 'D MMM':
      return `This Month From  ${lowerLimit} To ${upperLimit}`;
    default:
      return {
        lowerLimit,
        upperLimit,
      };
  }
};

export const setDateRange = (optionValue, labelValue) => {
  const label = labelValue === 'label' ? 'D MMM' : 'YYYY-MM-DD';
  switch (optionValue) {
    case selectDateOptions.this_month:
      return getMonthRange(label);
    case selectDateOptions.this_week:
      return getWeekRange(label);
    case selectDateOptions.this_year:
      return getYearRange(label);
    default:
      getWeekRange(label);
      break;
  }
};
