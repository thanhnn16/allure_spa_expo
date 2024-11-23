import { useLanguage } from '@/hooks/useLanguage';
const { t } = useLanguage();
import { Wizard } from 'react-native-ui-lib'

const TransactionHeader = ({ status }: { status: string }) => {
    const handleGetOrderStatus = (status: string) => {
        if (status === "pending") {
            return 0;
        } else if (status === "confirmed") {
            return 1;
        } else if (status === "shipping") {
            return 2;
        } else if (status === "completed") {
            return 3;
        } else {
            return 0;
        }
    };
    return (
        <Wizard activeIndex={handleGetOrderStatus(status)} onActiveIndexChanged={() => handleGetOrderStatus(status)}>
            <Wizard.Step state={Wizard.States.ENABLED} enabled={false} label={t('transaction_detail.timeline.pending')} />
            <Wizard.Step state={Wizard.States.ENABLED} enabled={false} label={t('transaction_detail.timeline.confirmed')} />
            <Wizard.Step state={Wizard.States.ENABLED} enabled={false} label={t('transaction_detail.timeline.delivering')} />
            <Wizard.Step state={Wizard.States.ENABLED} enabled={false} label={t('transaction_detail.timeline.completed')} />
        </Wizard>
    )
}

export default TransactionHeader