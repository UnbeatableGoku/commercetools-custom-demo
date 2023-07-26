import {
  useMcLazyQuery,
  useMcMutation,
  useMcQuery,
} from '@commercetools-frontend/application-shell';
import getProducts from './fetch-all-products.ctp.graphql';
import singleProduct from './fetch-single-product.ctp.graphql';
import productsId from './fetch-all-products-id.ctp.graphql';
import updateProuduct from './update-product.ctp.graphql';
import { GRAPHQL_TARGETS } from '@commercetools-frontend/constants';
import {
  checkStatusOfProducts,
  convertToActionData,
  createGraphQlUpdateActions,
  extractErrorFromGraphQlResponse,
} from '../../helpers';
import { createSyncProducts } from '@commercetools/sync-actions';

export const useAllProductsFetcher = ({
  page,
  perPage,
  tableSorting,
  searchKeyword,
}) => {
  const { data, error, loading, refetch } = useMcQuery(getProducts, {
    variables: {
      limit: perPage.value,
      offset: (page.value - 1) * perPage.value,
      sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
      searchKeyword,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });

  return { allProducts: data?.products, error, loading, refetch };
};

export const useSingleProductFetcher = ({ id }) => {
  const { data, error, loading, refetch } = useMcQuery(singleProduct, {
    variables: {
      id,
    },
    context: {
      target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
    },
  });
  return {
    singleProduct: data?.product,
    error,
    loading,
    singleProductRefetch: refetch,
  };
};

export const useProductStatusUpdater = () => {
  const [ProductStatusUpdate, { data, loading, error }] =
    useMcMutation(updateProuduct);

  const handleFilterProductStatus = async (
    products,
    type,
    refetch = null,
    handleAllProduct = null,
    setAllChecked = null,
    handleStatusNotification = null
  ) => {
    const filteredProducts = checkStatusOfProducts(products, type);

    if (filteredProducts) {
      const statusType =
        type === 'published'
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
        refetch ? null : null;
        handleAllProduct ? handleAllProduct(false) : null;
        setAllChecked ? setAllChecked(false) : null;
        handleStatusNotification ? handleStatusNotification(type) : null;
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

  const syncStores = createSyncProducts();
  const execute = async (
    { originalDraft, nextDraft },
    singleProductRefetch,
    handleNotification
  ) => {
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
      const data = await updateProductDetails({
        variables: {
          id: originalDraft.id,
          version: originalDraft.version,
          actions: createGraphQlUpdateActions(actions),
        },
        context: {
          target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
        },
      });
      if (data) {
        singleProductRefetch();
        handleNotification();
      }
      return data;
    } catch (error) {
      console.log(error);
      throw extractErrorFromGraphQlResponse(error);
    }
  };
  return {
    execute,
  };
};

export const useFetchSearchItemsId = () => {
  const [handleGetIdOfProducts, { data, error }] = useMcLazyQuery(productsId);

  if (error) {
    console.log(error);
  }
  const arrayOfId = data?.productProjectionSearch?.results?.map(
    (item) => `"${item.id}"`
  );
  return {
    handleGetIdOfProducts,
    data,
    arrayOfId,
  };
};
