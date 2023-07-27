import React from 'react';
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
import {
  useProductStatusUpdater,
  useProductUpdater,
} from '../../hooks/useProducts/use-products';
import { transformErrors } from '../channel-details/transform-errors';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
  NOTIFICATION_KINDS_PAGE,
} from '@commercetools-frontend/constants';

const ProductDetails = (props) => {
  const { handleFilterProductStatus } = useProductStatusUpdater();
  const tabsModalState = useModalState();
  const match = useRouteMatch();
  const params = useParams();

  const showNotification = useShowNotification();

  const handleNotification = () => {
    showNotification({
      kind: NOTIFICATION_KINDS_SIDE.success,
      domain: DOMAINS.SIDE,
      text: `Changes Save Successfully.`,
    });
  };
  const handleStatusNotification = (type) => {
    showNotification({
      kind: NOTIFICATION_KINDS_SIDE.success,
      domain: DOMAINS.SIDE,
      text: ` Product Have Been ${
        type === 'published' ? 'Published' : 'Unpublished'
      }`,
    });
  };
  const { singleProduct, error, loading, singleProductRefetch } =
    useSingleProductFetcher({ id: params.id });

  const { execute } = useProductUpdater();

  const { dataLocale, projectLanguages } = useApplicationContext((context) => ({
    dataLocale: context.dataLocale ?? '',
    projectLanguages: context.project.languages ?? [],
  }));
  const initialValues = docToFormValues(singleProduct, projectLanguages);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (formikValues) => {
      const data = formValuesToDoc(formikValues);
      console.log(data, 'this is data=------------------------');
      try {
        await execute(
          {
            originalDraft: singleProduct,
            nextDraft: data,
          },
          singleProductRefetch,
          handleNotification
        );
      } catch (error) {
        const transformedErrors = transformErrors(error);
        console.log(transformedErrors);
      }
    },
    enableReinitialize: true,
  });

  if (error) {
    console.log(error);
  }

  return (
    <div>
      {singleProduct ? (
        <TabularModalPage
          isOpen
          onClose={props.onClose || tabsModalState.closeModal}
          title={singleProduct?.masterData?.staged?.nameAllLocales[0]?.value}
          formControls={
            <SelectInput
              name="status"
              value={formik.values.status}
              onChange={(event) => {
                console.log(event.target.value);
                {
                  event.target.value !== 'modified'
                    ? handleFilterProductStatus(
                        'single',
                        [singleProduct],
                        event.target.value,
                        singleProductRefetch,
                        handleStatusNotification
                      )
                    : null;
                }
              }}
              options={[
                {
                  value: 'published',
                  label: <Stamp tone="primary" label="Published" />,
                },
                {
                  value: 'modified',
                  label: <Stamp tone="warning" label="Modified" />,
                },
                {
                  value: 'unpublished',
                  label: <Stamp tone="critical" label="Unpublished" />,
                },
              ]}
            />
          }
          tabControls={
            <>
              <TabHeader to={`${match.url}`} exactPathMatch label="General" />
              <TabHeader to={`${match.url}/variants`} label="Variants" />
              <TabHeader to={`${match.url}/search`} label="Int. /Ext. Search" />
              <TabHeader
                to={`${match.url}/product-selection`}
                label="Product Selection"
              />
            </>
          }
        >
          <Switch>
            <Route path={`${match.path}`} exact>
              <div>
                {singleProduct && (
                  <GeneralComponent
                    singleProduct={singleProduct}
                    initialValues={docToFormValues(
                      singleProduct,
                      projectLanguages
                    )}
                    dataLocale={dataLocale}
                    projectLanguages={projectLanguages}
                    formik={formik}
                    onSubmit={formik.onSubmit}
                  />
                )}
              </div>
            </Route>
            <Route path={`${match.path}/tab-two`}>
              <div>two</div>
            </Route>
          </Switch>
        </TabularModalPage>
      ) : (
        <div>...loading</div>
      )}

      {/* <TextField value={singleProduct?.masterData?.current?.name}/> */}
    </div>
  );
};
ProductDetails.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ProductDetails;
