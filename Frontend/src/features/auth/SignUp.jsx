import { useNavigate, Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useToast } from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useSignUpMutation } from "./authApiSlice";

const SignUp = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [signUp, { isLoading }] = useSignUpMutation();

  const signUpSchema = yup.object({
    username: yup
      .string()
      .min(4, "Username must be a least 4 characters")
      .required("Username is required"),
    email: yup
      .string()
      .email("Email is not valid")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be a least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (data, { setSubmitting }) => {
    setSubmitting(true);

    try {
      await signUp(data).unwrap();

      navigate("/people");
    } catch (error) {
      toast({
        position: "top",
        duration: 4000,

        render: () => (
          <div className="bg-[#FFCC00] font-bold p-4 rounded-md text-center">
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
    <div className="h-screen w-full flex flex-col justify-center items-center text-center">
      <Formik
        enableReinitialize
        initialValues={{ username: "", email: "", password: "" }}
        validationSchema={signUpSchema}
        onSubmit={async (values, { setSubmitting }) =>
          await handleSubmit(values, { setSubmitting })
        }
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <h1 className="text-3xl font-bold">Sign Up</h1>

            <div>
              <label className="font-bold" htmlFor="username">
                Username:
              </label>

              <Field
                className="bg-[#FFCC00] text-[#FF3B30] placeholder-orange-400 w-full p-2 rounded-md"
                name="username"
                placeholder="Username"
              />

              <ErrorMessage
                className="text-[#FFCC00] font-bold"
                name="username"
                component="h2"
              />
            </div>

            <div>
              <label className="font-bold" htmlFor="email">
                Email:
              </label>

              <Field
                className="bg-[#FFCC00] text-[#FF3B30] placeholder-orange-400 w-full p-2 rounded-md"
                type="email"
                name="email"
                placeholder="Email"
              />

              <ErrorMessage
                className="text-[#FFCC00] font-bold"
                name="email"
                component="h2"
              />
            </div>

            <div>
              <label className="font-bold" htmlFor="password">
                Password:
              </label>

              <Field
                className="bg-[#FFCC00] text-[#FF3B30] placeholder-orange-400 w-full p-2 rounded-md"
                type="password"
                name="password"
                placeholder="********"
              />

              <ErrorMessage
                className="text-[#FFCC00] font-bold"
                name="password"
                component="h2"
              />
            </div>

            <button
              className="bg-[#FF9500] hover:bg-[#FFCC00] font-bold p-2 rounded-md"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
              ) : (
                "Sign Up"
              )}
            </button>

            <h3 className="font-bold">
              Already have an account?{" "}
              <Link className="text-[#FFCC00] font-bold" to={"/signIn"}>
                Sign In!
              </Link>
            </h3>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
