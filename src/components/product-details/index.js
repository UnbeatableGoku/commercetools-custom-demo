import { lazy } from 'react';

const ProductDetails = lazy(() =>
  import('./product-details' /* webpackChunkName: "channel-details" */)
);

export default ProductDetails;
