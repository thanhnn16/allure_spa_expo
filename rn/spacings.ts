import { Spacings } from 'react-native-ui-lib';

const isSmallScreen = false;
Spacings.loadSpacings({
  page: isSmallScreen ? 16 : 20,
  section: 12,
  item: 8,
});

export default Spacings;
