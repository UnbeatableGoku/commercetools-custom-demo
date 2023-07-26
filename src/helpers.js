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
  const statusType = type !== 'unpublished' ? true : false;
  console.log(
    products,
    type,
    statusType,
    'this is status type -------------------------------------------status type '
  );

  const filteredProducts = products.filter(
    (product) => product.published !== statusType
  );
  if (filteredProducts.length < 1) {
    return false;
  }
  return filteredProducts;
};
// "id in (\"cd9fd6e8-3757-49da-abd5-7e6ecb73b5b4\",\"45c3f938-0996-493f-b271-25bb59376dcc\")"
