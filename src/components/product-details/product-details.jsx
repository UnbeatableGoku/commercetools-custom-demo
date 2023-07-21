import React from 'react'
import PropTypes from 'prop-types';

import { useParams } from 'react-router';
import {
    PageNotFound,
    FormModalPage,
  } from '@commercetools-frontend/application-components';
import { useSingleProductFetcher } from '../../hooks/useProducts';
const ProductDetails = (props) => {
  const params = useParams();
    console.log(params);
  const {singleProduct,error,loading}=useSingleProductFetcher({id:params.id})

  if(error){
    console.log(error);
  }
    console.log(singleProduct);
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
          </FormModalPage>
    </div>
  )
}
ProductDetails.propTypes = {
    onClose: PropTypes.func.isRequired,
  };
  
export default ProductDetails