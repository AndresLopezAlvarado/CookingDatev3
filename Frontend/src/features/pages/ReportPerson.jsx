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
      .min(0, "'Reason' cannot be empty")
      .required("'Reason' is required"),
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
          <div className="bg-[#FFCC00] font-bold p-4 rounded-md text-center">
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
    <div className="h-screen flex flex-col justify-center items-center text-center gap-4">
      <div className="bg-[#FF3B30] font-bold p-2 rounded-md flex text-4xl space-x-6 justify-center items-center text-center">
        <button
          title={t("bar.t1")}
          onClick={() => navigate(-1)}
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <FaAngleLeft />
        </button>
      </div>

      <h1 className="text-3xl font-bold">{t("title.t1")}</h1>

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
          <Form className="space-y-4">
            <div>
              <label className="font-bold" htmlFor="reason">
                {t("title.t4")}:
              </label>

              <Field
                className="bg-[#FFCC00] text-[#FF3B30] placeholder-orange-400 w-full p-2 rounded-md"
                as="textarea"
                rows="8"
                name="reason"
                placeholder={t("title.t5")}
              />

              <ErrorMessage
                className="text-[#FFCC00] font-bold"
                name="reason"
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
