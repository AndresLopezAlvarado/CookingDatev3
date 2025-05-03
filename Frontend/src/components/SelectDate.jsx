import { useField } from "formik";
import DatePicker from "react-datepicker";
import { getYear, getMonth } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";

const range = (start, end, step = 1) => {
  const result = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
};

const SelectDate = ({ name = "", handleOnChange, birthdate, selected }) => {
  const [field, meta, helpers] = useField(name); // Para usar setValue no se puede eliminar field y meta
  const { setValue } = helpers;
  const years = range(1924, getYear(new Date()), 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const parseBirthdate = () => {
    const date = new Date(birthdate);

    const formattedDate = `${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;

    return formattedDate;
  };

  return (
    <DatePicker
      className="bg-tertiary text-primary placeholder-orange-400 w-full p-2 rounded-md"
      calendarClassName="bg-primary border border-tertiary p-1"
      weekDayClassName={() => "bg-tertiary font-bold rounded-md"}
      dayClassName={() => "bg-tertiary rounded-md"}
      value={parseBirthdate}
      selected={selected}
      onChange={(date) => {
        setValue(date);
        handleOnChange(date);
      }}
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="bg-primary p-1 flex gap-1">
          <button
            className="bg-secondary hover:bg-tertiary p-2 rounded-md"
            type="button"
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
          >
            {"<"}
          </button>

          <select
            value={getYear(date)}
            onChange={({ target: { value } }) => changeYear(value)}
            className="bg-tertiary text-primary w-full p-2 rounded-md"
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={months[getMonth(date)]}
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
            className="bg-tertiary text-primary w-full p-2 rounded-md"
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            className="bg-secondary hover:bg-tertiary p-2 rounded-md"
            type="button"
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
          >
            {">"}
          </button>
        </div>
      )}
    />
  );
};

export default SelectDate;
