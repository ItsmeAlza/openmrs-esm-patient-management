import { type Location, useAppContext, useSession } from '@openmrs/esm-framework';
import { useParams } from 'react-router-dom';
import type { WardLocationContext } from '../ward-view/ward-view.component';
import useLocationHook from './useLocation';

export default function useWardLocation(): {
  location: Location;
  isLoadingLocation: boolean;
  errorFetchingLocation: Error | undefined;
  invalidLocation: boolean;
} {
  const { locationUuid: locationUuidFromUrl } = useParams();
  const { sessionLocation } = useSession();
  const wardLocationContext = useAppContext<WardLocationContext>('ward-location-context');
  const {
    data: locationResponse,
    isLoading: isLoadingLocation,
    error: errorFetchingLocation,
  } = useLocationHook(locationUuidFromUrl ? locationUuidFromUrl : null);
  const invalidLocation = locationUuidFromUrl && errorFetchingLocation;

  // Priority: app context (set by WardView, works across extensions) > URL param > session location
  const location =
    wardLocationContext?.location ?? (locationUuidFromUrl ? locationResponse?.data : null) ?? sessionLocation;

  return {
    location,
    isLoadingLocation: !wardLocationContext?.location && locationUuidFromUrl ? isLoadingLocation : false,
    errorFetchingLocation,
    invalidLocation,
  };
}
