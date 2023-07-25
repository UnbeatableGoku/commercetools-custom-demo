import {
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell';
import getProducts from './fetch-all-products.ctp.graphql';
import singleProduct from './fetch-single-product.ctp.graphql';
import updateProuduct from './update-product.ctp.graphql';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import {
  checkStatusOfProducts,
  convertToActionData,
  createGraphQlUpdateActions,
  extractErrorFromGraphQlResponse,
} from '../../helpers';
import { createSyncChannels } from '@commercetools/sync-actions';

export const useAllProductsFetcher = ({ page, perPage, tableSorting }) => {
  const { data, error, loading, refetch } = useMcQuery(getProducts, {
    variables: {
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return { allProducts: data?.products, error, loading, refetch };
};

export const useSingleProductFetcher = ({ id }) => {
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

export const useProductStatusUpdater = () => {
  const [ProductStatusUpdate, { data, loading, error }] =
    useMcMutation(updateProuduct);

  const handleFilterProductStatus = async (
    products,
    type,
    refetch,
    handleAllProduct,
    setAllChecked
  ) => {
    const filteredProducts = checkStatusOfProducts(products, type);

    if (filteredProducts) {
      const statusType =
        type === true
          ? [{ publish: { scope: 'All' } }]
          : [{ unpublish: { dummy: '' } }];

      const updatedProducts = await Promise.all(
        filteredProducts.map(async (item) => {
          await ProductStatusUpdate({
            variables: {
              version: item.version,
              id: item.id,
              actions: statusType,
            },
            context: {
              target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            },
          });
        })
      );
      if (updatedProducts) {
        refetch();
        handleAllProduct(false);
        setAllChecked(false);
      }
      return updatedProducts;
    }
  };

  return {
    handleFilterProductStatus,
    data,
  };
};

export const useProductUpdater = () => {
  const [updateProductDetails, { data, error }] = useMcMutation(updateProuduct);

  const syncStores = createSyncChannels();
  const execute = async ({ originalDraft, nextDraft }) => {
    const actions = syncStores.buildActions(
      nextDraft,
      convertToActionData(originalDraft)
    );
    if (error) {
      console.log(error);
    }
    try {
      console.log(
        originalDraft,
        'this is ==================================originalDraf'
      );
      return await updateProductDetails({
        variables: {
          id: originalDraft.id,
          version: originalDraft.version,
          actions: createGraphQlUpdateActions(actions),
        },
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
      });
    } catch (error) {
      console.log(error);
      throw extractErrorFromGraphQlResponse(error);
    }
  };
  return {
    execute,
  };
};
