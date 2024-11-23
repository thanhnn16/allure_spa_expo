import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();

export const HOME_CATEGORIES = [
    {
        id: "1",
        name: t("home.introduce"),
        icon: require("@/assets/images/home/icons/Introduce.png"),
        url: "https://allurespa.com.vn/gioi-thieu/",
    },
    {
        id: "2",
        name: t("home.voucher"),
        icon: require("@/assets/images/home/icons/Voucher.png"),
        url: "https://allurespa.com.vn/voucher/",
    },
    {
        id: "3",
        name: t("home.service"),
        icon: require("@/assets/images/home/icons/Service.png"),
        url: "https://allurespa.com.vn/dich-vu/",
    },
    {
        id: "4",
        name: t("home.product"),
        icon: require("@/assets/images/home/icons/Product.png"),
        url: "https://allurespa.com.vn/san-pham/",
    },
    {
        id: "5",
        name: t("home.course"),
        icon: require("@/assets/images/home/icons/Course.png"),
        url: "https://allurespa.com.vn/khoa-hoc/",
    },
    {
        id: "6",
        name: t("home.news"),
        icon: require("@/assets/images/home/icons/News.png"),
        url: "https://allurespa.com.vn/category/tin-tuc/",
    },
];
