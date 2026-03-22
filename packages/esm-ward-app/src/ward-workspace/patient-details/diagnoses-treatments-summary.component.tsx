import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, SkeletonText } from '@carbon/react';
import classNames from 'classnames';
import { useVisitDiagnosesAndTreatments } from '../../hooks/useVisitDiagnosesAndTreatments';
import styles from './diagnoses-treatments-summary.scss';

interface DiagnosesAndTreatmentsSummaryProps {
  patientUuid: string;
  visitUuid?: string;
}

const DiagnosesAndTreatmentsSummary: React.FC<DiagnosesAndTreatmentsSummaryProps> = ({ patientUuid, visitUuid }) => {
  const { t } = useTranslation();
  const { diagnoses, medications, isLoading, error } = useVisitDiagnosesAndTreatments(patientUuid, visitUuid);

  if (error) {
    return (
      <div className={styles.summaryContainer}>
        <p className={styles.errorText}>{t('errorLoadingDiagnoses', 'Failed to load diagnoses and treatments.')}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.summaryContainer}>
        <SkeletonText width="30%" />
        <SkeletonText width="50%" />
        <SkeletonText width="40%" />
      </div>
    );
  }

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.section}>
        <p className={styles.sectionLabel}><strong>{t('diagnoses', 'Diagnoses')}</strong></p>
        <div className={styles.diagnosesList}>
          {diagnoses && diagnoses.length > 0 ? (
            diagnoses.map((diagnosis, i) => (
              <Tag key={i} type={diagnosis.order === 'Primary' ? 'blue' : 'red'}>
                {diagnosis.diagnosis}
              </Tag>
            ))
          ) : (
            <p className={classNames(styles.bodyLong01, styles.emptyText)}>
              {t('noDiagnosesFound', 'No diagnoses found')}
            </p>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionLabel}><strong>{t('treatments', 'Treatments (Medications)')}</strong></p>
        <div className={styles.medicationsList}>
          {medications && medications.length > 0 ? (
            <ul className={styles.list}>
              {medications.map((medication, i) => (
                <li key={i} className={styles.listItem}>
                  {medication.order.drug?.display || medication.order.concept?.display} - {medication.order.dose} {medication.order.doseUnits?.display} {medication.order.frequency?.display}
                </li>
              ))}
            </ul>
          ) : (
            <p className={classNames(styles.bodyLong01, styles.emptyText)}>
              {t('noTreatmentsFound', 'No active treatments found')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosesAndTreatmentsSummary;
