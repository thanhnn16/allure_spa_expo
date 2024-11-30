import { useState } from 'react';
import { DialogConfig } from '@/types';

export const useDialog = () => {
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    visible: false,
    title: '',
    description: '',
    severity: 'info',
  });

  const showDialog = (
    title: string,
    description: string,
    severity: DialogConfig['severity'] = 'info',
  ) => {
    setDialogConfig({
      visible: true,
      title,
      description,
      severity,
    });
  };

  const hideDialog = () => {
    setDialogConfig(prev => ({ ...prev, visible: false }));
  };

  return {
    dialogConfig,
    showDialog,
    hideDialog
  };
}; 