import React, { useMemo, useEffect, useState } from 'react';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';
import type { Encounter, Observation } from '../types';

export interface DiagnosisItem {
  diagnosis: string;
  order: string;
}

export interface OrderItem {
  order: any;
  provider: {
    name: string;
    role: string;
  };
}

export function useVisitDiagnosesAndTreatments(patientUuid: string, providedVisitUuid?: string) {
  const [encounters, setEncounters] = useState<Encounter[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchVisitData = async () => {
      try {
        let visitUuidToUse = providedVisitUuid;
        
        // Auto-resolve active visit if not provided
        if (!visitUuidToUse && patientUuid) {
          const activeVisitsRes: any = await openmrsFetch(`${restBaseUrl}/visit?patient=${patientUuid}&includeInactive=false`);
          if (activeVisitsRes.data?.results?.length > 0) {
            visitUuidToUse = activeVisitsRes.data.results[0].uuid;
          }
        }

        if (!visitUuidToUse) {
          if (isMounted) {
             setEncounters([]);
             setIsLoading(false);
          }
           return;
        }

        const customRepresentation =
          'custom:(uuid,location,encounters:(uuid,diagnoses:(uuid,display,rank,diagnosis,voided),form:(uuid,display,name,description,encounterType,version,resources:(uuid,display,name,valueReference)),encounterDatetime,orders:full,obs:(uuid,concept:(uuid,display,conceptClass:(uuid,display)),display,groupMembers:(uuid,concept:(uuid,display),value:(uuid,display),display),value,obsDatetime),encounterType:(uuid,display,viewPrivilege,editPrivilege),encounterProviders:(uuid,display,encounterRole:(uuid,display),provider:(uuid,person:(uuid,display)))),visitType:(uuid,name,display),startDatetime,stopDatetime,patient,attributes:(attributeType:ref,display,uuid,value))';

        const apiUrl = `${restBaseUrl}/visit/${visitUuidToUse}?v=${customRepresentation}`;
        
        const res: any = await openmrsFetch(apiUrl);
        if (isMounted) {
          setEncounters(res.data?.encounters || []);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchVisitData();

    return () => {
      isMounted = false;
    };
  }, [patientUuid, providedVisitUuid]);

  const { diagnoses, medications } = useMemo(() => {
    const meds: Array<OrderItem> = [];
    const diags: Array<DiagnosisItem> = [];

    if (encounters) {
      encounters.forEach((enc: any) => {
        // Collect orders for medications
        if (enc.orders && enc.orders.length > 0) {
          meds.push(
            ...enc.orders.map((order: any) => ({
              order,
              provider: {
                name: enc.encounterProviders?.length ? enc.encounterProviders[0].provider?.person?.display || '' : '',
                role: enc.encounterProviders?.length ? enc.encounterProviders[0].encounterRole?.display || '' : '',
              },
            })),
          );
        }

        // Collect diagnoses directly from the API property
        if (enc.diagnoses && enc.diagnoses.length > 0) {
          enc.diagnoses.forEach((diag: any) => {
            if (!diag.voided) {
              let diagnosisText = diag.diagnosis?.display || diag.display || '';
              // Sometimes display is something like "Malaria (Primary)", so we can just use that
              let orderText = diag.rank === 1 ? 'Primary' : (diag.rank === 2 ? 'Secondary' : '');
              diags.push({
                diagnosis: diagnosisText,
                order: orderText,
              });
            }
          });
        }
      });
    }

    return { diagnoses: diags, medications: meds };
  }, [encounters]);

  return { diagnoses, medications, error, isLoading };
}
