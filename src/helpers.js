import {
  transformLocalizedStringToLocalizedField,
  transformLocalizedFieldToLocalizedString,
} from '@commercetools-frontend/l10n';

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
