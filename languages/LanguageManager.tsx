import { RootState } from "@/redux/ReduxStore";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import i18n from "./i18n";

const LanguageManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const language = useSelector((state: RootState) => state.language.currentLanguage);

    console.log('Current app language: ',language);
    useEffect(() => {
        i18n.locale = language;
    }, [language]);

    return <>{children}</>;
};

export default LanguageManager;