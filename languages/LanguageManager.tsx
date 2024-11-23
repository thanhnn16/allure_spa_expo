import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import i18n, { getInitialLanguage } from "./i18n";
import { setLanguage } from "@/redux/features/language/languageSlice";

const LanguageManager: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const language = useSelector(
    (state: RootState) => state.language.currentLanguage
  );

  useEffect(() => {
    // Set initial language on first load
    if (!language) {
      const initialLang = getInitialLanguage();
      dispatch(setLanguage(initialLang));
    }

    // Update i18n locale whenever language changes
    if (language) {
      i18n.locale = language;
    }
  }, [language, dispatch]);

  return <>{children}</>;
};

export default LanguageManager;
