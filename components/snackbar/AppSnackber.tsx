// import { Snackbar } from 'react-native'

// import SuccessIcon from '@/assets/icons/arrow_left.svg'
// import ErrorIcon from '@/assets/icons/arrow_left.svg'
// import InfoIcon from '@/assets/icons/arrow_left.svg'
// import WarningIcon from '@/assets/icons/arrow_left.svg'

// interface AppSnackbarProps {
//     open: boolean;
//     message: string;
//     onClose: () => void;
//     severity: 'success' | 'error' | 'info' | 'warning';
// }


// const AppSnackbar = ({ open, message, onClose, severity }: AppSnackbarProps) => {
//     const iconMap = {
//         success: <SuccessIcon />,
//         error: <ErrorIcon />,
//         info: <InfoIcon />,
//         warning: <WarningIcon />,
//     };

//     return (
//         <Snackbar
//             anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//             open={open}
//             autoHideDuration={6000}
//             onClose={onClose}
//         >
//             <SnackbarContent
//                 message={
//                     <span>
//                         {iconMap[severity]} {message}
//                     </span>
//                 }
//                 action={[
//                     <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
//                         <CloseIcon />
//                     </IconButton>,
//                 ]}
//             />
//         </Snackbar>
//     );
// };

// // ... existing code ...

// export default CustomSnackbar;

