import { Typography } from 'react-native-ui-lib';
import Colors from './Colors';

Typography.loadTypographies({
  onboarding_title: { fontSize: 32, lineHeight: 48, fontWeight: '400', fontFamily: 'AlexBrush-Regular', color: Colors.primary },
  onboarding_title_ja: { fontSize: 32, lineHeight: 48, fontWeight: '400', fontFamily: 'KaiseiTokumin-Regular', color: Colors.primary },
  h1_italic: { fontSize: 46, fontWeight: '300', lineHeight: 80, fontFamily: 'AlexBrush-Regular'},
  h2_italic: { fontSize: 32, fontWeight: '300', lineHeight: 64, fontFamily: 'AlexBrush-Regular' },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  h0: {fontSize: 24, fontWeight: '300', lineHeight: 30, fontFamily: 'SFProText-Regular'},
  h0_medium: {fontSize: 24, fontWeight: '500', lineHeight: 30, fontFamily: 'SFProText-Medium'},
  h0_bold: {fontSize: 24, fontWeight: '700', lineHeight: 30, fontFamily: 'SFProText-Bold'},
  h0_semibold: {fontSize: 24, fontWeight: '600', lineHeight: 30, fontFamily: 'SFProText-Semibold'},
  h1: {fontSize: 24, fontWeight: '300', lineHeight: 24, fontFamily: 'SFProText-Regular'},
  h1_medium: {fontSize: 24, fontWeight: '500', lineHeight: 24, fontFamily: 'SFProText-Medium'},
  h1_bold: {fontSize: 24, lineHeight: 24, fontFamily: 'SFProText-Bold'},
  h1_semibold: {fontSize: 24, lineHeight: 24, fontFamily: 'SFProText-Semibold'},
  h2: {fontSize: 18, lineHeight: 24, fontFamily: 'SFProText-Regular'},
  h2_medium: {fontSize: 18, lineHeight: 24, fontFamily: 'SFProText-Medium'},
  h2_bold: {fontSize: 18, lineHeight: 24, fontFamily: 'SFProText-Bold'},
  h2_semibold: {fontSize: 18, lineHeight: 24, fontFamily: 'SFProText-Semibold'},
  h3: {fontSize: 14, lineHeight: 19, fontFamily: 'SFProText-Regular'},
  h3_medium: {fontSize: 14, lineHeight: 19, fontFamily: 'SFProText-Medium'},
  h3_bold: {fontSize: 14, lineHeight: 19, fontFamily: 'SFProText-Bold'},
  h3_semibold: {fontSize: 14, lineHeight: 19, fontFamily: 'SFProText-Semibold'},
});

export default Typography;
