import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useToast } from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useSignInMutation } from "./authApiSlice";
import { useTranslation } from "react-i18next";

const SignIn = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [signIn, { isLoading }] = useSignInMutation();
  const { t } = useTranslation(["signIn"]);

  const signInSchema = yup.object({
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
      await signIn(data).unwrap();

      navigate("/people");
    } catch (error) {
      toast({
        position: "top",
        duration: 4000,

        render: () => (
          <div className="bg-tertiary font-bold p-4 rounded-md text-center">
            <h1>An error has occurred!:</h1>

            <p>{error.response.data.message}</p>
          </div>
        ),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full p-8 md:p-16 flex flex-col items-center text-center">
      <Formik
        enableReinitialize
        initialValues={{ email: "", password: "" }}
        validationSchema={signInSchema}
        onSubmit={async (values, { setSubmitting }) =>
          await handleSubmit(values, { setSubmitting })
        }
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <h1 className="text-3xl font-bold">{t("title.t1")}</h1>

            <div>
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

            <div>
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
              <Link className="text-tertiary font-bold" to={"/signUp"}>
                {t("title.t3")}
              </Link>
            </h3>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignIn;
