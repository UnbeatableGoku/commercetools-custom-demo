import Text from '@commercetools-uikit/text';
import {
  useAllProductsFetcher,
  useFetchSearchItemsId,
  useProductStatusUpdater,
} from '../../hooks/useProducts/use-products';
import messages from './messages';
import Spacings from '@commercetools-uikit/spacings';
import DataTable from '@commercetools-uikit/data-table';
import Stamp from '@commercetools-uikit/stamp';
import { Pagination } from '@commercetools-uikit/pagination';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import { useState } from 'react';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import { Switch, useHistory, useRouteMatch } from 'react-router';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import ProductDetails from '../product-details/product-details';
import SelectInput from '@commercetools-uikit/select-input';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  GRAPHQL_TARGETS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import SearchTextInput from '@commercetools-uikit/search-text-input';

const Products = () => {
  const match = useRouteMatch();
  const { push } = useHistory();

  console.log(match, 'this is match ');

  const [checked, setChecked] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [selectStatus, setSelectStatus] = useState(null);
  const { handleFilterProductStatus } = useProductStatusUpdater();
  const showNotification = useShowNotification();

  const { handleGetIdOfProducts, arrayOfId } = useFetchSearchItemsId();
  const handleCheckBox = (e, id, version, published, modified) => {
    console.log(published, 'this=================================publisheddsf');
    if (e) {
      setChecked([...checked, { id, version, published, modified }]);
    } else {
      const items = checked.filter((item) => {
        if (item.id !== id) {
          return { id: item.id, version: item.version };
        }
      });
      setChecked(items);
    }
  };

  const handleStatusNotification = (type) => {
    showNotification({
      kind: NOTIFICATION_KINDS_SIDE.success,
      domain: DOMAINS.SIDE,
      text: ` Products Have Been ${
        type === 'published' ? 'Published' : 'Unpublished'
      }`,
    });
  };
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });

  const searchKeywordValues = `id in (${arrayOfId})`;
  const { allProducts, error, loading, refetch } = useAllProductsFetcher({
    page,
    perPage,
    tableSorting,
    searchKeyword: arrayOfId ? searchKeywordValues : null,
  });

  console.log(checked, 'this is ===========================checked');

  const handleAllProduct = (value) => {
    if (value) {
      const newItems = allProducts.results.map((item) => {
        return {
          id: item.id,
          version: item.version,
          published: item.masterData.published,
          modified: item.masterData.hasStagedChanges,
        };
      });
      setChecked(newItems);
    } else {
      setChecked([]);
    }
  };
  const columns = [
    {
      label: (
        <CheckboxInput
          value="foo-radio-value"
          onChange={(event) => {
            handleAllProduct(event.target.checked);
            setAllChecked(event.target.checked);
          }}
          isChecked={allChecked}
          isIndeterminate={checked.length > 0 && checked.length < perPage.value}
        />
      ),
      shouldIgnoreRowClick: true,
      key: 'checkBox',
    },
    { label: 'Product Name', key: 'name', isSortable: true },
    { label: 'Product Type', key: 'type' },
    { label: 'Product Key', key: 'key', isSortable: true },
    { label: 'Status', key: 'status' },
    { label: 'Date Created', key: 'createdAt', isSortable: true },
    { label: 'Date Modified', key: 'lastModifiedAt', isSortable: true },
  ];

  const itemRenderer = (item, column) => {
    switch (column.key) {
      case 'checkBox':
        return (
          <CheckboxInput
            value="foo-radio-value"
            onChange={(event) =>
              handleCheckBox(
                event.target.checked,
                item.id,
                item.version,
                item.masterData.published,
                item.masterData.hasStagedChanges
              )
            }
            isChecked={checked.some(function (checkedItem) {
              if (checkedItem.id === item.id) {
                return true;
              }
            })}
          ></CheckboxInput>
        );

      case 'name':
        return item.masterData.staged.name;

      case 'type':
        return item.productType.name;

      case 'key':
        return item.key;

      case 'status':
        return item.masterData.published ? (
          item.masterData.hasStagedChanges ? (
            <Stamp tone="warning" label="Modified" />
          ) : (
            <Stamp tone="primary" label="Published" />
          )
        ) : (
          <Stamp tone="critical" label="Unpublished" />
        );

      case 'createdAt':
        const createdDate = new Date(item.createdAt);
        const createdDateString = `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`;
        return createdDateString;

      case 'lastModifiedAt':
        const modifiedDate = new Date(item.lastModifiedAt);
        const modifiedDateString = `${modifiedDate.toLocaleDateString()} ${modifiedDate.toLocaleTimeString(
          { hourCycle: 'h24' }
        )}`;
        return modifiedDateString;

      default:
        return item[column.key];
    }
  };
  const FallbackUI = () => {
    return <LoadingSpinner />;
  };

  return (
    <Spacings.Stack scale="xl">
      {console.log('render')}
      <Text.Headline as="h2" intlMessage={messages.productTitle} />
      <SearchTextInput
        horizontalConstraint={10}
        onSubmit={(text) =>
          handleGetIdOfProducts({
            variables: { text },
            context: {
              target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
            },
          })
        }
        onReset={() => console.log('reset')}
      />
      <Spacings.Inline alignItems="center">
        <SelectInput
          horizontalConstraint={5}
          name="form-field-name"
          options={[
            {
              value: 'published',
              label: 'Published',
              isDisabled: !checked.length > 0,
            },
            {
              value: 'unpublished',
              label: 'Unpublished',
              isDisabled: !checked.length > 0,
            },
          ]}
          isDisabled={false}
          onChange={(event) => {
            setSelectStatus(event.target.value);
            handleFilterProductStatus(
              'bulk',
              checked,
              event.target.value,
              refetch,
              handleAllProduct,
              setAllChecked,
              handleStatusNotification
            );
          }}
        />
        {checked.length > 0 ? (
          <>
            <Text.Detail isBold tone="primary">
              {checked.length}
            </Text.Detail>
            <Text.Detail isBold>Products Selected</Text.Detail>
          </>
        ) : null}
      </Spacings.Inline>

      {loading && <LoadingSpinner />}

      {allProducts ? (
        <Spacings.Stack scale="l">
          <DataTable
            sortDirection={tableSorting.value.order}
            sortedBy={tableSorting.value.key}
            onSortChange={tableSorting.onChange}
            isCondensed
            columns={columns}
            rows={allProducts.results}
            itemRenderer={(item, column) => itemRenderer(item, column)}
            onRowClick={(row) => push(`${match.url}/${row.id}`)}
          />
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={allProducts.total}
          />
          <Switch>
            <SuspendedRoute
              path={`${match.path}/:id`}
              fallback={<FallbackUI />}
            >
              <ProductDetails onClose={() => push(`${match.url}`)} />
            </SuspendedRoute>
          </Switch>
        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};

export default Products;
