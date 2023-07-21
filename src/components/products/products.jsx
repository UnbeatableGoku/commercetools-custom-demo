import Text from '@commercetools-uikit/text';
import { useAllProductsFetcher } from '../../hooks/useProducts/use-products';
import messages from "./messages"
import Spacings from '@commercetools-uikit/spacings';
import DataTable from '@commercetools-uikit/data-table';
import Stamp from '@commercetools-uikit/stamp';
import { Pagination } from '@commercetools-uikit/pagination';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import styles from "./products.module.css"
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import { useState } from 'react';
import CheckboxInput from '@commercetools-uikit/checkbox-input';
import { Switch, useHistory, useRouteMatch } from 'react-router';
import { SuspendedRoute } from '@commercetools-frontend/application-shell';
import ProductDetails from '../product-details/product-details';


const Products = () => {
  const match = useRouteMatch();
  const { push } = useHistory();

  console.log(match,"this is match ");

  const [model,setModel]= useState(false)
  const [checked,setChecked]=useState(false)
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'key', order: 'asc' });
  const {allProducts,error,loading}=useAllProductsFetcher({ page,
    perPage,
    tableSorting,})

  console.log(error);
  console.log(allProducts?allProducts.results:null);

 
  const rows = [
    { id: 'parasite', title: 'Parasite', country: 'South Korea' },
    { id: 'portrait', title: 'Portrait of a Lady on Fire', country: 'France' },
    { id: 'wat', title: 'Woman at War', country: 'Iceland' },
  ];
  const columns = [
    {label:(
        <CheckboxInput
        value="foo-radio-value"
        />
    ),shouldIgnoreRowClick:true,key:'checkBox'},
    { label: 'Product Name', key: 'name',isSortable:true},
    { label: 'Product Type', key: 'type'},
    { label:'Product Key' ,key:'key',isSortable:true},
    { label:'Status',key:'status'},
    { label:'Date Created',key:'createdAt',isSortable:true},
    { label:'Date Modified',key:'lastModifiedAt',isSortable:true}
  ];  
  const itemRenderer=(item,column)=>{
    switch(column.key){

      case 'checkBox':
      return<CheckboxInput
        value="foo-radio-value"
        onChange={(event) => setChecked(!checked)}
        isChecked={checked}
        

      >
        
      </CheckboxInput>

      case 'name':
      return item.masterData.current.name;
      
      case 'type':
      return item.productType.name

      case 'key':
      return item.key

      case 'status':
      return item.masterData.published?
      item.masterData.hasStagedChanges?
       <Stamp tone='warning' label='Modified'/>:
       <Stamp tone='primary' label='Published'/>:
       <Stamp tone='critical' label='Unpublished'/>

      case 'createdAt':
      const createdDate = new Date(item.createdAt);
      const createdDateString = `${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`;
      return createdDateString;

    case 'lastModifiedAt':
      const modifiedDate = new Date(item.lastModifiedAt);
      const modifiedDateString = `${modifiedDate.toLocaleDateString()} ${modifiedDate.toLocaleTimeString({hourCycle:'h24'})}`;
      return modifiedDateString;
        
      default:
        return item[column.key]
    }
  }
  const FallbackUI = () => {
    return <LoadingSpinner />;
  };

  return (
    <Spacings.Stack scale='xl'>
    <Text.Headline as="h2" intlMessage={messages.productTitle} />
    <div className={model?styles.model:''} >
      
    </div>
    {loading && <LoadingSpinner />}

    {allProducts?
        <Spacings.Stack scale="l">

      <DataTable
       sortDirection={tableSorting.value.order}
       sortedBy={tableSorting.value.key}
       onSortChange={tableSorting.onChange} 
       isCondensed 
       columns={columns} 
       rows={allProducts.results} 
       itemRenderer={(item,column)=>itemRenderer(item,column)} 
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
            <SuspendedRoute path={`${match.path}/:id`} fallback={<FallbackUI />}>
              <ProductDetails onClose={() => push(`${match.url}`)} />
            </SuspendedRoute>
          </Switch>
    </Spacings.Stack>

      :
  null       
    }
    </Spacings.Stack>
    
  )
}

export default Products