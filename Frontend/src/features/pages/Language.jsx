import { useTranslation } from "react-i18next";

const Language = () => {
  const { i18n, t } = useTranslation(["language"]);
  const languages = [
    { code: "en", language: t("languages.l1") },
    { code: "es", language: t("languages.l2") },
  ];

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <div className="h-screen flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold">{t("title")}</h1>

      <p>{t("paragraph")}</p>

      <div className="flex gap-2">
        {languages.map((lng) => {
          return (
            <button
              className={
                lng.code === i18n.language
                  ? "bg-[#FFCC00] hover:bg-[#FF9500] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
                  : "bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
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
