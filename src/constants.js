// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';

export const entryPointUriPath = 'custom-demo';

export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);

export const selectDateOptions = {
  this_week: 'THIS_WEEK',
  last_week: 'LAST_WEEK',
  this_month: 'THIS_MONTH',
  last_month: 'LAST_MONTH',
  this_year: 'THIS_YEAR',
  last_year: 'LAST_YEAR',
};
