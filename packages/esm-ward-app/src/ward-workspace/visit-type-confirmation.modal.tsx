import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ModalBody, ModalFooter, ModalHeader } from '@carbon/react';
import { getCoreTranslation } from '@openmrs/esm-framework';

interface VisitTypeConfirmationModalProps {
  close: () => void;
  visitTypeName: string;
  onContinueWithCurrentVisit: () => void;
  onConfirmNewVisit: () => void;
}

const VisitTypeConfirmationModal: React.FC<VisitTypeConfirmationModalProps> = ({
  close,
  visitTypeName,
  onContinueWithCurrentVisit,
  onConfirmNewVisit,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <ModalHeader closeModal={close}>{t('visitTypeConfirmation', 'Visit Type Confirmation')}</ModalHeader>
      <ModalBody>
        <p>
          {t(
            'visitTypeConfirmationMessage',
            'Current visit type is {{visitTypeName}}. Do you want to close it and start a new IPD visit?',
            { visitTypeName },
          )}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button
          size="lg"
          kind="secondary"
          onClick={() => {
            close();
            onContinueWithCurrentVisit();
          }}>
          {t('continueWithCurrentVisit', 'Continue with current Visit')}
        </Button>
        <Button
          autoFocus
          kind="primary"
          onClick={() => {
            close();
            onConfirmNewVisit();
          }}
          size="lg">
          {t('yes', 'Yes')}
        </Button>
      </ModalFooter>
    </>
  );
};

export default VisitTypeConfirmationModal;
