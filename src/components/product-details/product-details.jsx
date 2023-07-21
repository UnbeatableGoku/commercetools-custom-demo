import React from 'react'
import PropTypes from 'prop-types';
import TextField from '@commercetools-uikit/text-field';
import { Route, Switch, useParams, useRouteMatch } from 'react-router';
import {
    PageNotFound,
    FormModalPage,
    TabHeader,
    TabularMainPage,
  } from '@commercetools-frontend/application-components';
import { useSingleProductFetcher } from '../../hooks/useProducts';
const ProductDetails = (props) => {
  const match = useRouteMatch();

  const params = useParams();
    console.log(params);
  const {singleProduct,error,loading}=useSingleProductFetcher({id:params.id})

  if(error){
    console.log(error);
  }
  return (
    <div>
        

        <FormModalPage
            title={singleProduct?.masterData?.current?.name}
            isOpen
            onClose={props.onClose}
            // isPrimaryButtonDisabled={
            //   formProps.isSubmitting || !formProps.isDirty || !canManage
            // }
            // isSecondaryButtonDisabled={!formProps.isDirty}
            // onSecondaryButtonClick={formProps.handleReset}
            // onPrimaryButtonClick={formProps.submitForm}
            labelPrimaryButton={FormModalPage.Intl.save}
            labelSecondaryButton={FormModalPage.Intl.revert}
          >
            <TabularMainPage title='main page tab header' tabControls={
            <>
        <TabHeader to={`${match.url}/tab-one`} label="Tab One"/>
        <TabHeader to={`${match.url}/tab-two`} label="Tab Two"/>
            </>
        }>

        <Switch>
         <Route path={`${match.path}/tab-one`}>
          <div>
            One
          </div>
         </Route>
        <Route path={`${match.path}/tab-two`}>
          <div>
            two
          </div>
        </Route>
      </Switch>
        </TabularMainPage>
            <TextField value={singleProduct?.masterData?.current?.name}/>
          </FormModalPage>
    </div>
  )
}
ProductDetails.propTypes = {
    onClose: PropTypes.func.isRequired,
  };
  
export default ProductDetails