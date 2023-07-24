import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { transformLocalizedFieldToLocalizedString } from '@commercetools-frontend/l10n';

export const docToFormValues = (singleProduct, languages) => ({
  name: LocalizedTextInput.createLocalizedString(
    languages,
    transformLocalizedFieldToLocalizedString(
      singleProduct?.masterData?.current?.nameAllLocales ?? []
    )
  ),
  status: singleProduct?.masterData?.published
    ? singleProduct?.masterData?.hasStagedChanges
      ? 'modified'
      : 'published'
    : 'unpublished',

    description:LocalizedTextInput.createLocalizedString(
      languages,
      transformLocalizedFieldToLocalizedString(
        singleProduct?.masterData?.current?.descriptionAllLocales ?? []
      )
    ),
});

export const formValuesToDoc = (formValues) => ({
  name: LocalizedTextInput.omitEmptyTranslations(formValues.name),
});
