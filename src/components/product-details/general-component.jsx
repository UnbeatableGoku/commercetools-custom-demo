import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import LocalizedTextInput from '@commercetools-uikit/localized-text-input';
import { useFormik } from 'formik';
import { docToFormValues, formValuesToDoc } from './conversions';
import FieldLabel from '@commercetools-uikit/field-label';
import { WarningIcon } from '@commercetools-uikit/icons';
import { defineMessage, FormattedMessage } from 'react-intl';
import messages from './messages';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { InformationIcon } from '@commercetools-uikit/icons';



const GeneralComponent = (props) => {

  return (
    <Spacings.Stack scale='xl'>
      <CollapsiblePanel
      header={<Text.Headline as='h3'>General Information</Text.Headline>}
      >
      <form  onSubmit={props.formik.handleSubmit}>
          <Spacings.Stack scale='m'> 
         <FieldLabel
      title={<FormattedMessage {...messages.labelTitle} />}
      hasRequiredIndicator={true}
      hintIcon={<WarningIcon />}
      htmlFor="sampleInput"
      horizontalConstraint={7}
        />
      <LocalizedTextInput 
      name='name'
      selectedLanguage={props.dataLocale}
      value={props.formik.values.name}
      horizontalConstraint="12" 
      onChange={props.formik.handleChange}
      onBlur={props.formik.handleBlur}
      />
      <FieldLabel
      title={<FormattedMessage {...messages.labelTitle} />}
      hasRequiredIndicator={true}
      hintIcon={<WarningIcon />}
      htmlFor="sampleInput"
      horizontalConstraint={7}
  />
      </Spacings.Stack>
      <Spacings.Stack scale='m'> 

      <LocalizedTextInput 
      name='description'
      selectedLanguage={props.dataLocale}
      value={props.formik.values.description}
      horizontalConstraint="12" 
      onChange={props.formik.handleChange}
      onBlur={props.formik.handleBlur}
      o
      />
      </Spacings.Stack>
      <PrimaryButton
        type="submit"
        label="Submit"
      />
      </form>
      </CollapsiblePanel>
    </Spacings.Stack>
  )
}

export default GeneralComponent