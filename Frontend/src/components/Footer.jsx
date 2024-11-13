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
    <footer className="bg-[#FF3B30] flex flex-col space-y-2 p-2">
      <p className="bg-[#FF9500] text-justify p-4 rounded-md shadow-md">
        {t("paragraph")}
      </p>

      <div className="bg-[#FF9500] p-4 grid grid-cols-3 gap-x-2 rounded-md shadow-md ">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold mb-2">{t("legal.legal")}</h1>
          <Link>{t("legal.privacy")}</Link>
          <Link>{t("legal.terms")}</Link>
          <Link>{t("legal.cookiePolicy")}</Link>
          <Link>{t("legal.intellectualProperty")}</Link>
        </div>

        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold mb-2">{t("careers.careers")}</h1>
          <Link>{t("careers.careersPortal")}</Link>
          <Link>{t("careers.techBlog")}</Link>
        </div>

        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold mb-2">{t("social")}</h1>
          <div className="py-1 flex gap-3">
            <BsFacebook />
            <BsInstagram />
            <BsTwitterX />
            <BsTiktok />
            <BsYoutube />
          </div>
        </div>
      </div>

      <p className="bg-[#FF9500] text-center text-sm p-4 rounded-md shadow-md">
        {t("rights")}
      </p>
    </footer>
  );
};

export default Footer;
