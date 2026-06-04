import "virtual:svg-icons-register";
import UiBottomSheet from 'components/ui/UiBottomSheet.vue';
import UiButton from 'components/ui/UiButton.vue';
import UiCheckbox from 'components/ui/UiCheckbox.vue';
import UiCodeInput from 'components/ui/UiCodeInput.vue';
import UiFileInput from 'components/ui/UiFileInput.vue';
import UiFooter from 'components/ui/UiFooter.vue';
import UiIcon from 'components/ui/UiIcon.vue';
import UiInput from 'components/ui/UiInput.vue';
import UiSpinner from 'components/ui/UiSpinner.vue';
import UiStageField from 'components/ui/UiStageField.vue';
import UiTabs from 'components/ui/UiTabs.vue';
import UiVerifiedField from 'components/ui/UiVerifiedField.vue';

const uiComponents = [
  UiBottomSheet,
  UiButton,
  UiCheckbox,
  UiCodeInput,
  UiFileInput,
  UiFooter,
  UiIcon,
  UiInput,
  UiSpinner,
  UiStageField,
  UiTabs,
  UiVerifiedField,
];

export default ({ app }) => {
  uiComponents.forEach((component) => {
    app.component(component.name, component);
  });
};
