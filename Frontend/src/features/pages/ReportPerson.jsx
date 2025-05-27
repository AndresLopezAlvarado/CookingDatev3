import { useNavigate, useParams } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaAngleLeft } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import {
  useGetPersonQuery,
  useReportPersonMutation,
} from "../people/peopleApiSlice";
import { useTranslation } from "react-i18next";

const ReportPerson = () => {
  const reportedBy = useSelector(selectCurrentUser);
  const params = useParams();
  const { data: reportedPerson } = useGetPersonQuery({ userId: params.id });

  const toast = useToast();
  const navigate = useNavigate();
  const [reportPerson, { isLoading }] = useReportPersonMutation();
  const { t } = useTranslation(["reportPerson"]);

  const reportSchema = yup.object({
    reason: yup
      .string()
      .min(0, "'Reason' cannot be empty!")
      .required("'Reason' is required!"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    const report = {
      reportedBy: reportedBy._id,
      reportedPerson: params.id,
      reason: values.reason,
    };

    try {
      const reportId = await reportPerson(report).unwrap();

      toast({
        position: "top",
        duration: 4000,

        render: () => (
          <div className="bg-tertiary font-bold p-4 rounded-md text-center">
            <h1>
              Your report has been submitted (id: {reportId.toString()}) and
              will be reviewed.
            </h1>
          </div>
        ),
      });

      navigate(-1);
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
    <div className="h-full p-1 flex flex-col gap-4 items-center text-center">
      <nav className="bg-primary w-full md:w-5/6 lg:w-3/5 2xl:w-3/6 p-2 flex gap-2 justify-between items-center rounded-md">
        <button
          title={t("bar.t1")}
          onClick={() => navigate(-1)}
          className="bg-secondary hover:bg-tertiary h-8 w-8 flex items-center justify-center focus:ring-tertiary focus:outline-none focus:ring-2 focus:ring-inset rounded-md"
        >
          <FaAngleLeft />
        </button>

        <h1 className="text-3xl text-tertiary font-bold">{t("title.t1")}</h1>

        <img
          className="h-8 w-8 rounded-full"
          src={reportedPerson?.profilePicture?.url || "/noProfilePhoto.png"}
          alt="Reported person"
        />
      </nav>

      <label className="font-bold" htmlFor="reportedBy">
        {t("title.t2")}: {reportedBy?.username}
      </label>

      <label className="font-bold" htmlFor="reportedPerson">
        {t("title.t3")}: {reportedPerson?.username}
      </label>

      <Formik
        enableReinitialize
        initialValues={{ reason: "" }}
        validationSchema={reportSchema}
        onSubmit={async (values, { setSubmitting }) =>
          await handleSubmit(values, { setSubmitting })
        }
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4 items-center w-full md:w-5/6 lg:w-3/5 2xl:w-3/6">
            <div className="w-full">
              <label className="font-bold" htmlFor="reason">
                {t("title.t4")}:
              </label>

              <Field
                className="bg-tertiary w-full p-2 text-primary placeholder-orange-400 rounded-md"
                as="textarea"
                rows="8"
                name="reason"
                placeholder={t("title.t5")}
              />

              <ErrorMessage
                className="text-primary font-bold"
                name="reason"
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
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReportPerson;
