import { lazy } from 'react';

const Products = lazy(() =>
  import('./products' /* webpackChunkName: "Products" */)
);

export default Products;
