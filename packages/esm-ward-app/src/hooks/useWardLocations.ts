import { type FetchResponse, openmrsFetch, restBaseUrl, useConfig } from '@openmrs/esm-framework';
import useSWR from 'swr';
import { useMemo } from 'react';
import type { WardConfigObject } from '../config-schema';

interface LocationResponse {
  results: Array<{
    uuid: string;
    display: string;
  }>;
}

/**
 * Fetches all locations tagged as admission locations.
 * These are rendered as ward tabs at the top of the ward view.
 */
export function useWardLocations() {
  const { admissionLocationTagName } = useConfig<WardConfigObject>();
  const apiUrl = admissionLocationTagName
    ? `${restBaseUrl}/location?tag=${encodeURIComponent(admissionLocationTagName)}&v=default`
    : null;

  const { data, error, isLoading } = useSWR<FetchResponse<LocationResponse>, Error>(apiUrl, openmrsFetch);

  const wardLocations = useMemo(() => data?.data?.results ?? [], [data]);

  return {
    wardLocations,
    isLoading,
    error,
  };
}
