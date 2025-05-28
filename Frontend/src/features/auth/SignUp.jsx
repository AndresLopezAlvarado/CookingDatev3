import { useNavigate, Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useToast } from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useSignUpMutation } from "./authApiSlice";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [signUp, { isLoading }] = useSignUpMutation();
  const { t } = useTranslation(["signUp"]);

  const signUpSchema = yup.object({
    username: yup
      .string()
      .min(4, "Username must be a least 4 characters!")
      .required("Username is required!"),
    email: yup
      .string()
      .email("Email is not valid!")
      .required("Email is required!"),
    password: yup
      .string()
      .min(6, "Password must be a least 6 characters!")
      .required("Password is required!"),
  });

  const handleSubmit = async (data, { setSubmitting }) => {
    setSubmitting(true);

    try {
      await signUp(data).unwrap();

      navigate("/people");
    } catch (error) {
      toast({
        position: "bottom",
        duration: 4000,

        render: () => (
          <div className="bg-primary p-1 text-center rounded-md">
            <h1 className="text-tertiary font-bold">An error has occurred!:</h1>

            <p>{error.data.message}</p>
          </div>
        ),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center">
      <Formik
        enableReinitialize
        initialValues={{ username: "", email: "", password: "" }}
        validationSchema={signUpSchema}
        onSubmit={async (values, { setSubmitting }) =>
          await handleSubmit(values, { setSubmitting })
        }
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4 items-center">
            <h1 className="text-2xl text-center font-bold">{t("title.t1")}</h1>

            <div className="w-full">
              <label className="font-bold" htmlFor="username">
                {t("username")}:
              </label>

              <Field
                className="bg-tertiary text-primary placeholder-orange-400 w-full p-2 rounded-md"
                type="text"
                name="username"
                placeholder={t("username")}
              />

              <ErrorMessage
                className="text-primary font-bold"
                name="username"
                component="h2"
              />
            </div>

            <div className="w-full">
              <label className="font-bold" htmlFor="email">
                Email:
              </label>

              <Field
                className="bg-tertiary text-primary placeholder-orange-400 w-full p-2 rounded-md"
                type="email"
                name="email"
                placeholder="example@email.com"
              />

              <ErrorMessage
                className="text-primary font-bold"
                name="email"
                component="h2"
              />
            </div>

            <div className="w-full">
              <label className="font-bold" htmlFor="password">
                {t("password")}:
              </label>

              <Field
                className="bg-tertiary text-primary placeholder-orange-400 w-full p-2 rounded-md"
                type="password"
                name="password"
                placeholder="********"
              />

              <ErrorMessage
                className="text-primary font-bold"
                name="password"
                component="h2"
              />
            </div>

            <button
              className="bg-secondary hover:bg-tertiary font-bold p-2 rounded-md"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
              ) : (
                t("button")
              )}
            </button>

            <h3 className="font-bold">
              {t("title.t2")}
              <Link className="text-tertiary font-bold" to={"/signIn"}>
                {t("title.t3")}
              </Link>
            </h3>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
