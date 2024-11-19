import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { TiMessages } from "react-icons/ti";
import { FaStar } from "react-icons/fa6";
import { MdEmojiEmotions } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { LuVegan } from "react-icons/lu";
import { LuWheatOff } from "react-icons/lu";
import { PiChartPieSliceFill } from "react-icons/pi";
import { LuMilkOff } from "react-icons/lu";
import { GiBroccoli } from "react-icons/gi";
import { FaClock } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa";
import Spinner from "../../components/Spinner";
import { useLazyGetRecipeQuery } from "./recipeApiSlice";
import { useTranslation } from "react-i18next";

const Recipe = () => {
  const navigate = useNavigate();
  const diet = [
    "Gluten Free",
    "Ketogenic",
    "Vegetarian",
    "Lacto-Vegetarian",
    "Ovo-Vegetarian",
    "Vegan",
    "Pescetarian",
    "Paleo",
    "Low FODMAP",
    "Whole30",
  ];
  const dietOptions = diet.map((option) => ({
    value: option,
    label: option,
  }));
  const intolerances = [
    "Dairy",
    "Gluten",
    "Grain",
    "Peanut",
    "Seafood",
    "Sesame",
    "Shellfish",
    "Soy",
    "Sulfite",
    "Tree Nut",
    "Wheat",
  ];
  const intolerancesOptions = intolerances.map((option) => ({
    value: option,
    label: option,
  }));
  const [filters, setFilters] = useState({
    diet: [],
    intolerances: [],
    excludeIngredients: [],
  });
  const [trigger, { data, error, isLoading }] = useLazyGetRecipeQuery();
  const { t } = useTranslation(["recipe"]);

  const handleDietChange = (selectedOptions) => {
    const selectedDiets = selectedOptions.map((option) => option.value);

    setFilters((prevFilters) => ({
      ...prevFilters,
      diet: selectedDiets,
    }));
  };

  const handleIntolerancesChange = (selectedOptions) => {
    const selectedIntolerances = selectedOptions.map((option) => option.value);

    setFilters((prevFilters) => ({
      ...prevFilters,
      intolerances: selectedIntolerances,
    }));
  };

  const handleExcludeChange = (e) => {
    const excludeIngredients = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setFilters((prevFilters) => ({
      ...prevFilters,
      excludeIngredients,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    trigger(filters);
  };

  return (
    <div className="h-screen w-full p-1 gap-y-6 flex flex-col">
      {/* Barra */}
      <div className="bg-[#FF3B30] font-bold p-2 rounded-md text-4xl flex space-x-8 justify-center items-center text-center">
        <button
          title={t("bar.t1")}
          onClick={() => navigate(-1)}
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <FaAngleLeft />
        </button>

        <Link
          title={t("bar.t2")}
          to="/people"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <IoIosPeople />
        </Link>

        <Link
          title={t("bar.t3")}
          to="/chats"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <TiMessages />
        </Link>

        <Link
          title={t("bar.t4")}
          to="/reactions"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <MdEmojiEmotions />
        </Link>

        <Link
          title={t("bar.t5")}
          to="/favorites"
          className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
        >
          <FaStar />
        </Link>
      </div>

      {/* Form */}
      <div className="flex flex-col items-center text-center gap-4">
        <h1 className="text-3xl font-bold">{t("title.t1")}</h1>

        <h2 className="text-2xl">{t("title.t2")}</h2>

        <form
          className="w-full flex flex-col gap-3 justify-center items-center"
          onSubmit={onSubmit}
        >
          {/* Diet Select */}
          <div className="w-2/3">
            <label className="font-bold" htmlFor="diet">
              {t("title.t3")}:
            </label>

            <Select
              isMulti
              name="diet"
              options={dietOptions}
              classNamePrefix="select"
              onChange={handleDietChange}
              value={dietOptions?.filter(
                (option) =>
                  filters?.diet && filters?.diet.includes(option.value)
              )}
              placeholder={t("placeholder.p1")}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#FFCC00",
                  borderColor: "#FFCC00",
                  boxShadow: "none",
                  borderRadius: "6px",
                  "&:hover": {
                    borderColor: "#FF9500",
                    borderWidth: 2,
                    boxShadow: "none",
                  },
                }),

                placeholder: (base) => ({
                  ...base,
                  color: "#F97316",
                }),

                dropdownIndicator: (base) => ({
                  ...base,
                  color: "#FF9500",
                  "&:hover": {
                    color: "#FF3B30",
                    transform: "scale(1.3)",
                    transition: "transform 0.3s ease",
                    cursor: "pointer",
                  },
                }),

                menuList: (base) => ({
                  ...base,
                  backgroundColor: "#FFCC00",
                }),

                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? "#FF3B30" : "#FFCC00",
                  color: isFocused ? "#FFCC00" : "#FF3B30",
                }),

                clearIndicator: (base) => ({
                  ...base,
                  color: "#FF9500",
                  "&:hover": {
                    color: "#FF3B30",
                    transform: "scale(1.3)",
                    transition: "transform 0.3s ease",
                    cursor: "pointer",
                  },
                }),

                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#FFCC00",
                  color: "#FF3B30",
                  borderColor: "#FF3B30",
                  borderWidth: 2,
                  borderRadius: "6px",
                }),

                multiValueLabel: (base) => ({
                  ...base,
                  color: "#FF3B30",
                  fontSize: "16px",
                }),

                multiValueRemove: (base) => ({
                  ...base,
                  color: "#FF9500",
                  "&:hover": {
                    color: "#FF3B30",
                    backgroundColor: "#FFCC00",
                  },
                }),
              }}
            />
          </div>

          {/* Intolerances Select */}
          <div className="w-2/3">
            <label className="font-bold" htmlFor="intolerances">
              {t("title.t4")}:
            </label>

            <Select
              isMulti
              name="intolerances"
              options={intolerancesOptions}
              classNamePrefix="select"
              onChange={handleIntolerancesChange}
              value={intolerancesOptions?.filter(
                (option) =>
                  filters?.intolerances &&
                  filters?.intolerances.includes(option.value)
              )}
              placeholder={t("placeholder.p1")}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#FFCC00",
                  borderColor: "#FFCC00",
                  boxShadow: "none",
                  borderRadius: "6px",
                  "&:hover": {
                    borderColor: "#FF9500",
                    borderWidth: 2,
                    boxShadow: "none",
                  },
                }),

                placeholder: (base) => ({
                  ...base,
                  color: "#F97316",
                }),

                dropdownIndicator: (base) => ({
                  ...base,
                  color: "#FF9500",
                  "&:hover": {
                    color: "#FF3B30",
                    transform: "scale(1.3)",
                    transition: "transform 0.3s ease",
                    cursor: "pointer",
                  },
                }),

                menuList: (base) => ({
                  ...base,
                  backgroundColor: "#FFCC00",
                }),

                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? "#FF3B30" : "#FFCC00",
                  color: isFocused ? "#FFCC00" : "#FF3B30",
                }),

                clearIndicator: (base) => ({
                  ...base,
                  color: "#FF9500",
                  "&:hover": {
                    color: "#FF3B30",
                    transform: "scale(1.3)",
                    transition: "transform 0.3s ease",
                    cursor: "pointer",
                  },
                }),

                multiValue: (base) => ({
                  ...base,
                  backgroundColor: "#FFCC00",
                  color: "#FF3B30",
                  borderColor: "#FF3B30",
                  borderWidth: 2,
                  borderRadius: "6px",
                }),

                multiValueLabel: (base) => ({
                  ...base,
                  color: "#FF3B30",
                  fontSize: "16px",
                }),

                multiValueRemove: (base) => ({
                  ...base,
                  color: "#FF9500",
                  "&:hover": {
                    color: "#FF3B30",
                    backgroundColor: "#FFCC00",
                  },
                }),
              }}
            />
          </div>

          {/* Exclude Ingredients Input */}
          <div className="w-2/3 flex flex-col">
            <label className="font-bold" htmlFor="excludeIngredients">
              {t("title.t5")}:
            </label>

            <input
              type="text"
              name="excludeIngredients"
              placeholder={t("placeholder.p2")}
              onChange={handleExcludeChange}
              className="bg-[#FFCC00] text-[#FF3B30] placeholder-orange-400 placeholder:text-center w-full p-2 rounded-md"
            />
          </div>

          <button
            className="bg-[#FF9500] hover:bg-[#FFCC00] font-bold p-2 rounded-md"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
            ) : (
              t("button")
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      <div>
        {isLoading && <Spinner />}

        {error && <p>Error: {error.message}</p>}

        {data?.results && (
          <>
            {data.results.map((recipe) => (
              <a
                key={recipe.id}
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col px-4 gap-4 items-center"
              >
                <span className="text-center text-2xl font-bold">
                  {recipe.title}
                </span>

                <div className="w-48 h-48 rounded-md overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full"
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex gap-1 items-center">
                    <FaClock className="text-[#FF3B30]" />

                    <label htmlFor="readyInMinutes">
                      {recipe.readyInMinutes} min.
                    </label>
                  </div>

                  <div className="flex gap-1 items-center">
                    <PiChartPieSliceFill className="text-[#FF3B30]" />

                    <label htmlFor="servings">
                      {recipe.servings === 1
                        ? `${recipe.servings} serving`
                        : `${recipe.servings} servings`}
                    </label>
                  </div>

                  {recipe.vegan ? (
                    <div className="flex gap-1 items-center">
                      <LuVegan className="text-[#FF3B30]" /> Vegan
                    </div>
                  ) : (
                    recipe.vegetarian && (
                      <div className="flex gap-1 items-center">
                        <GiBroccoli className="text-[#FF3B30]" /> Vegetarian
                      </div>
                    )
                  )}

                  {recipe.glutenFree === true && (
                    <div className="flex gap-1 items-center">
                      <LuWheatOff className="text-[#FF3B30]" /> Gluten Free
                    </div>
                  )}

                  {recipe.dairyFree === true && (
                    <div className="flex gap-1 items-center">
                      <LuMilkOff className="text-[#FF3B30]" /> Dairy Free
                    </div>
                  )}
                </div>

                <p
                  className="text-justify"
                  dangerouslySetInnerHTML={{
                    __html:
                      recipe.summary.length > 200
                        ? recipe.summary.substring(0, 200) + "..."
                        : recipe.summary,
                  }}
                />
              </a>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Recipe;
