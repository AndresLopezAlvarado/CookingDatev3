import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import SelectDate from "../../components/SelectDate";
import fetchCountries from "../../constants/countries";
import { useTranslation } from "react-i18next";

const ProfileForm = ({ onSubmit, user }) => {
  const [userData, setUserData] = useState(user);
  const [countries, setCountries] = useState([]);
  const { t } = useTranslation(["profile"]);

  const handleOnChange = (date) => {
    setUserData((prevUserData) => ({ ...prevUserData, birthdate: date }));
  };

  async function loadCountries() {
    const fetchedCountries = await fetchCountries();

    fetchedCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));

    setCountries(fetchedCountries);
  }

  useEffect(() => {
    loadCountries();
  }, []);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        username: userData.username,
        birthdate: userData.birthdate, // realmente no inicializa con este valor porque no estoy usando un Field sino DatePicker
        gender: userData.gender,
        country: userData.country,
        dietaryPreferences: userData.dietaryPreferences,
      }}
      validationSchema={yup.object({
        username: yup.string().required("Username is required"),
      })}
      onSubmit={async (values, { setSubmitting }) => {
        for (let key in values) {
          if (values[key] === undefined) {
            values[key] = null;
          }
        }

        await onSubmit(values, { setSubmitting });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4 text-center">
          <h1 className="text-3xl font-bold">{t("form.f1")}</h1>

          <div>
            <label className="font-bold" htmlFor="username">
              {t("form.f2")}:
            </label>

            <Field
              className="bg-[#FFCC00] text-[#FF3B30] placeholder-orange-400 w-full p-2 rounded-md"
              name="username"
              placeholder={t("placeholder.p1")}
              onChange={(e) => {
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  username: e.target.value,
                }));
              }}
            />

            <ErrorMessage
              className="text-[#FFCC00] font-bold"
              name="username"
              component="h2"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-bold" htmlFor="birthdate">
              {t("form.f3")}:
            </label>

            <SelectDate
              name="birthdate"
              handleOnChange={handleOnChange}
              birthdate={userData.birthdate ? userData.birthdate : new Date()}
              selected={userData.birthdate ? userData.birthdate : new Date()}
            />
          </div>

          <div>
            <label className="font-bold" htmlFor="gender">
              {t("form.f4")}:
            </label>

            <Field
              className="bg-[#FFCC00] text-[#FF3B30] placeholder-orange-400 w-full p-2 rounded-md"
              id="gender"
              name="gender"
              as="select"
              value={userData.gender}
              onChange={(e) => {
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  gender: e.target.value,
                }));
              }}
            >
              <option value="">{t("gender.g1")}</option>
              <option value="Female">{t("gender.g2")}</option>
              <option value="Male">{t("gender.g3")}</option>
              <option value="Transgender">{t("gender.g4")}</option>
              <option value="Non-binary">{t("gender.g5")}</option>
              <option value="Genderfluid">{t("gender.g6")}</option>
              <option value="Gender-neutral / Agender">{t("gender.g7")}</option>
              <option value="Intersex">{t("gender.g8")}</option>
              <option value="Others">{t("gender.g9")}</option>
            </Field>
          </div>

          <div>
            <label className="font-bold" htmlFor="country">
              {t("form.f5")}:
            </label>

            <Field
              className="bg-[#FFCC00] text-[#FF3B30] placeholder-orange-400 w-full p-2 rounded-md"
              id="country"
              name="country"
              as="select"
              value={userData.country}
              onChange={(e) => {
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  country: e.target.value,
                }));
              }}
            >
              <option value="">{t("form.f6")}</option>
              {countries.map((country, index) => (
                <option key={index} value={country.name.common}>
                  {country.name.common}
                </option>
              ))}
            </Field>
          </div>

          <div>
            <label className="font-bold" htmlFor="dietaryPreferences">
              {t("form.f7")}:
            </label>

            <Field
              className="bg-[#FFCC00] text-[#FF3B30] placeholder-orange-400 w-full p-2 rounded-md"
              id="dietaryPreferences"
              name="dietaryPreferences"
              as="select"
              value={userData.dietaryPreferences}
              onChange={(e) => {
                setUserData((prevUserData) => ({
                  ...prevUserData,
                  dietaryPreferences: e.target.value,
                }));
              }}
            >
              <option value="">{t("diet.d1")}</option>
              <option value="None">{t("diet.d2")}</option>
              <option value="Gluten Free">{t("diet.d3")}</option>
              <option value="Ketogenic">{t("diet.d4")}</option>
              <option value="Vegetarian">{t("diet.d5")}</option>
              <option value="Lacto-Vegetarian">{t("diet.d6")}</option>
              <option value="Ovo-Vegetarian">{t("diet.d7")}</option>
              <option value="Vegan">{t("diet.d8")}</option>
              <option value="Pescetarian">{t("diet.d9")}</option>
              <option value="Paleo">{t("diet.d10")}</option>
              <option value="Low FODMAP">{t("diet.d11")}</option>
              <option value="Whole30">{t("diet.d12")}</option>
            </Field>
          </div>

          <button
            id="closeEditProfile"
            className="bg-[#FF9500] hover:bg-[#FFCC00] font-bold p-2 rounded-md"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
            ) : (
              t("button.b3")
            )}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default ProfileForm;
