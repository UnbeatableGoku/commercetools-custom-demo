import React from 'react'
import PropTypes from 'prop-types';
import { Route, Switch, useParams, useRouteMatch } from 'react-router';
import {
    TabHeader,
    TabularModalPage,
    useModalState,
  } from '@commercetools-frontend/application-components';
import { useSingleProductFetcher } from '../../hooks/useProducts';
import GeneralComponent from './general-component';
import { docToFormValues, formValuesToDoc } from './conversions';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import SelectInput from '@commercetools-uikit/select-input';
import { useFormik } from 'formik';
import Stamp from '@commercetools-uikit/stamp';






const ProductDetails = (props) => {


  const tabsModalState = useModalState()
  const match = useRouteMatch();

  const params = useParams();
    console.log(params);
  
    const {singleProduct,error,loading}=useSingleProductFetcher({id:params.id})
   

    console.log(singleProduct,"--------------------------------------singleProduct");
    const {dataLocale,projectLanguages}=useApplicationContext((context)=>
    ({
      dataLocale:context.dataLocale ?? '',
      projectLanguages:context.project.languages ?? []
    })
    )
    
    const initialValues=docToFormValues( singleProduct, projectLanguages)
       
      const formik= useFormik({
        initialValues:initialValues,
        onSubmit:async(formikValues)=>{
          const data=formValuesToDoc(formikValues)
          console.log(data,"this is data=------------------------");
          alert(`name: ${data.name.en}`)
        },
        enableReinitialize: true,
      })
      console.log(formik,"------------------------------formik ");
      
  if(error){
    console.log(error);
  }


  return  ( 
    <div>{singleProduct ? 

            <TabularModalPage  
              isOpen
              onClose={props.onClose||tabsModalState.closeModal}
              title={singleProduct?.masterData?.current?.nameAllLocales[0]?.value}
              formControls={
                <SelectInput
                  name="status"
                  value={formik.values.status}
                  onChange={
      (/** event */) => {
        // console.log(event.target.value)
                 }
                  }
    options={[
      { value: 'published', label: <Stamp tone="primary" label="Published" />},
      { value: 'modified', label: <Stamp tone="warning" label="Modified" />},
      { value: 'unpublished', label: <Stamp tone="critical" label="Unpublished" /> },
    ]}
  />
              } 
              tabControls={
            <>
                  <TabHeader to={`${match.url}`} exactPathMatch label="General"/>
                  <TabHeader to={`${match.url}/variants`} label="Variants"/>
                  <TabHeader to={`${match.url}/search`} label="Int. /Ext. Search"/>
                  <TabHeader to={`${match.url}/product-selection`} label="Product Selection"/>
                  
            </>
        }>

        <Switch>
         <Route path={`${match.path}`} exact>
          <div>
            {singleProduct && 
            <GeneralComponent  
            singleProduct={singleProduct}
            initialValues={docToFormValues(singleProduct, projectLanguages)}
            dataLocale={dataLocale}
            projectLanguages={projectLanguages}
            formik={formik}
            onSubmit={formik.onSubmit}
           />
            }
          </div>
         </Route>
        <Route path={`${match.path}/tab-two`}>
          <div>
            two
          </div>
        </Route>
      </Switch>
    
        </TabularModalPage>
    :<div>...loading</div>}
        
            {/* <TextField value={singleProduct?.masterData?.current?.name}/> */}
    </div>
  )
}
ProductDetails.propTypes = {
    onClose: PropTypes.func.isRequired,
  };
  
export default ProductDetails