import React, { useCallback, useMemo } from 'react';
import { Tab, TabList, Tabs, TabsSkeleton } from '@carbon/react';
import { type Location } from '@openmrs/esm-framework';
import { useTranslation } from 'react-i18next';
import { useWardLocations } from '../hooks/useWardLocations';
import styles from './ward-tabs.scss';

interface WardTabsProps {
  selectedLocation: Location;
  onLocationChange: (location: Location) => void;
}

const WardTabs: React.FC<WardTabsProps> = ({ selectedLocation, onLocationChange }) => {
  const { t } = useTranslation();
  const { wardLocations, isLoading, error } = useWardLocations();

  const selectedIndex = useMemo(() => {
    if (!selectedLocation || !wardLocations.length) return 0;
    const index = wardLocations.findIndex((loc) => loc.uuid === selectedLocation.uuid);
    return index >= 0 ? index : 0;
  }, [selectedLocation, wardLocations]);

  const handleTabChange = useCallback(
    (evt: { selectedIndex: number }) => {
      const selectedWard = wardLocations[evt.selectedIndex];
      if (selectedWard && selectedWard.uuid !== selectedLocation?.uuid) {
        // Pass the selected ward as a Location object to update the app context
        onLocationChange(selectedWard as unknown as Location);
      }
    },
    [wardLocations, selectedLocation, onLocationChange],
  );

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.wardTabsContainer}>
        <TabsSkeleton />
      </div>
    );
  }

  if (wardLocations.length <= 1) {
    return null;
  }

  return (
    <div className={styles.wardTabsContainer}>
      <Tabs selectedIndex={selectedIndex} onChange={handleTabChange}>
        <TabList aria-label={t('wardTabs', 'Ward tabs')} contained>
          {wardLocations.map((ward) => (
            <Tab key={ward.uuid}>{ward.display}</Tab>
          ))}
        </TabList>
      </Tabs>
    </div>
  );
};

export default WardTabs;
