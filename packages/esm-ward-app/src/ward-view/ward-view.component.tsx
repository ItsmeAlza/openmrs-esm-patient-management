import { InlineNotification } from '@carbon/react';
import { ExtensionSlot, useDefineAppContext, useSession, type Location } from '@openmrs/esm-framework';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWardConfig } from './ward-view.resource';
import WardTabs from './ward-tabs.component';
import styles from './ward-view.scss';

export interface WardLocationContext {
  location: Location;
}

const WardView: React.FC<{}> = () => {
  const { t } = useTranslation();
  const { sessionLocation } = useSession();
  const [selectedLocation, setSelectedLocation] = useState<Location>(sessionLocation);

  // Broadcast the selected location via app context so hooks inside
  // extensions (which don't share BrowserRouter) can read it
  useDefineAppContext<WardLocationContext>('ward-location-context', {
    location: selectedLocation,
  });

  const locationUuid = selectedLocation?.uuid;
  const wardConfig = useWardConfig(locationUuid);

  const handleLocationChange = useCallback((location: Location) => {
    setSelectedLocation(location);
  }, []);

  if (!selectedLocation) {
    return <InlineNotification kind="error" title={t('invalidLocationSpecified', 'Invalid location specified')} />;
  }

  const wardId = wardConfig.id;

  return (
    <div className={classNames(styles.wardView, styles.verticalTiling)}>
      <WardTabs selectedLocation={selectedLocation} onLocationChange={handleLocationChange} />
      <ExtensionSlot name={wardId} />
    </div>
  );
};

export default WardView;
