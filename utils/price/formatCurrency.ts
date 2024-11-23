import i18n from "@/languages/i18n";

import { FormatNumberOptions } from "i18n-js";

interface PriceProps {
    price: number;
}

const formatCurrency = ({ price }: PriceProps) => {

    if (price === undefined || price === null) {
        throw new Error("Price is undefined or null");
    }

    const options: Partial<FormatNumberOptions> = {
        unit: "₫",
        separator: ".",
        delimiter: ",",
        format: "%n %u",
        precision: 0
    };
    return i18n.numberToCurrency(price, options);
};

export default formatCurrency;