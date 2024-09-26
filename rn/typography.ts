import { Typography } from 'react-native-ui-lib';

Typography.loadTypographies({
  h1: { fontSize: 46, fontWeight: '300', lineHeight: 80, fontFamily: 'AlexBrush-Regular'},
  h2: { fontSize: 32, fontWeight: '300', lineHeight: 64, fontFamily: 'AlexBrush-Regular' },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
});

export default Typography;
