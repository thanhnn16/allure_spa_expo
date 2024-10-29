import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import i18n from "./i18n";

const LanguageManager: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const language = useSelector(
    (state: RootState) => state.language.currentLanguage
  );

  useEffect(() => {
    i18n.locale = language;
  }, [language]);

  return <>{children}</>;
};

export default LanguageManager;
