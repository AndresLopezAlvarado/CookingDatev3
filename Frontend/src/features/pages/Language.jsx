import { useTranslation } from "react-i18next";

const Language = () => {
  const { i18n, t } = useTranslation(["language"]);
  const languages = [
    { code: "en", language: t("languages.l1") },
    { code: "es", language: t("languages.l2") },
  ];
  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <div className="h-full p-8 md:p-16 flex flex-col items-center gap-10">
      <h1 className="text-3xl font-bold">{t("title")}</h1>

      <p>{t("paragraph")}</p>

      <div className="flex gap-1">
        {languages.map((lng) => {
          return (
            <button
              className={
                lng.code === i18n.language
                  ? "bg-tertiary hover:bg-secondary focus:ring-primary focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
                  : "bg-secondary hover:bg-tertiary focus:ring-primary focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
              }
              key={lng.code}
              onClick={() => changeLanguage(lng.code)}
            >
              {lng.language}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Language;
