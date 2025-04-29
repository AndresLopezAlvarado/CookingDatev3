import { Link } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsTwitterX,
  BsTiktok,
  BsYoutube,
} from "react-icons/bs";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation(["footer"]);

  return (
    <footer className="bg-primary flex flex-col gap-1 p-1">
      <p className="bg-secondary text-justify p-2 rounded-md">
        {t("paragraph")}
      </p>

      <div className="grid grid-cols-3 gap-1">
        <div className="bg-secondary text-center p-2 flex flex-col gap-1 rounded-md">
          <h1 className="text-2xl font-bold">{t("legal.legal")}</h1>
          <Link>{t("legal.privacy")}</Link>
          <Link>{t("legal.terms")}</Link>
          <Link>{t("legal.cookiePolicy")}</Link>
          <Link>{t("legal.intellectualProperty")}</Link>
        </div>

        <div className="bg-secondary text-center p-2 flex flex-col gap-1 rounded-md">
          <h1 className="text-2xl font-bold">
            {t("careers.careers")}
          </h1>
          <Link>{t("careers.careersPortal")}</Link>
          <Link>{t("careers.techBlog")}</Link>
        </div>

        <div className="bg-secondary text-center p-2 flex flex-col gap-2 rounded-md">
          <h1 className="text-2xl font-bold">{t("social")}</h1>
          <div className="flex gap-3 justify-center">
            <BsFacebook />
            <BsInstagram />
            <BsTwitterX />
            <BsTiktok />
            <BsYoutube />
          </div>
        </div>
      </div>

      <label className="bg-secondary text-center text-sm p-2 rounded-md">
        {t("rights")}
      </label>
    </footer>
  );
};

export default Footer;
