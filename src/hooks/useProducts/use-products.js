import { useMcQuery } from '@commercetools-frontend/application-shell';
import getProducts from './fetch-all-products.ctp.graphql';
import singleProduct from './fetch-single-product.ctp.graphql';

import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';

export const useAllProductsFetcher = ({ page, perPage, tableSorting }) => {
  console.log(page, perPage, tableSorting);
  const { data, error, loading } = useMcQuery(getProducts, {
    variables: {
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return { allProducts: data?.products, error, loading };
};

export const useSingleProductFetcher = ({ id }) => {
  console.log(id);
  const { data, error, loading } = useMcQuery(singleProduct, {
    variables: {
      id,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return { singleProduct: data?.product, error, loading };
};
