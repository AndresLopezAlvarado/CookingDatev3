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
    <div className="h-full flex flex-col items-center">
      {/* Barra */}
      <nav className="bg-primary p-2 fixed top-14 inset-x-1 z-10 flex gap-8 justify-center rounded-md">
        {[
          {
            icon: <FaAngleLeft className="text-2xl" />,
            key: "t1",
            type: "button",
            action: () => navigate(-1),
          },
          {
            icon: <IoIosPeople className="text-2xl" />,
            key: "t2",
            type: "link",
            to: "/people",
          },
          {
            icon: <TiMessages className="text-2xl" />,
            key: "t3",
            type: "link",
            to: "/chats",
          },
          {
            icon: <MdEmojiEmotions className="text-2xl" />,
            key: "t4",
            type: "link",
            to: "/reactions",
          },
          {
            icon: <FaStar className="text-2xl" />,
            key: "t5",
            type: "link",
            to: "/favorites",
          },
        ].map((item) =>
          item.type === "button" ? (
            <button
              key={item.key}
              title={t(`bar.${item.key}`)}
              onClick={item.action}
              className="bg-secondary h-8 w-8 flex items-center justify-center hover:bg-tertiary focus:ring-2 focus:ring-tertiary focus:ring-inset rounded-md"
            >
              {item.icon}
            </button>
          ) : (
            <Link
              key={item.key}
              title={t(`bar.${item.key}`)}
              to={item.to}
              className="bg-secondary h-8 w-8 flex items-center justify-center hover:bg-tertiary focus:ring-2 focus:ring-tertiary focus:ring-inset rounded-md"
            >
              {item.icon}
            </Link>
          )
        )}
      </nav>

      <main className="w-full sm:w-3/5 lg:w-1/2 flex-1 flex flex-col">
        {/* Form */}
        <div className="mt-14 p-2 flex flex-col gap-4 items-center">
          <h1 className="text-2xl font-bold">{t("title.t1")}</h1>

          <p className="text-center">{t("title.t2")}</p>

          <form
            className="w-full p-2 border border-primary flex flex-col gap-1 justify-center items-center rounded-md"
            onSubmit={onSubmit}
          >
            {/* Diet Select */}
            <div className="w-full">
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
            <div className="w-full">
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
            <div className="w-full">
              <label className="font-bold" htmlFor="excludeIngredients">
                {t("title.t5")}:
              </label>

              <input
                type="text"
                name="excludeIngredients"
                placeholder={t("placeholder.p2")}
                onChange={handleExcludeChange}
                className="bg-tertiary w-full p-2 text-primary placeholder-orange-500 rounded-md"
              />
            </div>

            <button
              className="bg-secondary hover:bg-tertiary font-bold p-2 rounded-md"
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
        <div className="p-1 flex-1 flex items-center justify-center">
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
                  className="flex flex-col gap-4 items-center"
                >
                  <h2 className="text-center text-2xl font-bold">
                    {recipe.title}
                  </h2>

                  <div className="w-48 h-48 rounded-md overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex gap-1 items-center">
                      <FaClock className="text-primary" />

                      <label htmlFor="readyInMinutes">
                        {recipe.readyInMinutes} min.
                      </label>
                    </div>

                    <div className="flex gap-1 items-center">
                      <PiChartPieSliceFill className="text-primary" />

                      <label htmlFor="servings">
                        {recipe.servings === 1
                          ? `${recipe.servings} serving`
                          : `${recipe.servings} servings`}
                      </label>
                    </div>

                    {recipe.vegan ? (
                      <div className="flex gap-1 items-center">
                        <LuVegan className="text-primary" /> Vegan
                      </div>
                    ) : (
                      recipe.vegetarian && (
                        <div className="flex gap-1 items-center">
                          <GiBroccoli className="text-primary" /> Vegetarian
                        </div>
                      )
                    )}

                    {recipe.glutenFree === true && (
                      <div className="flex gap-1 items-center">
                        <LuWheatOff className="text-primary" /> Gluten Free
                      </div>
                    )}

                    {recipe.dairyFree === true && (
                      <div className="flex gap-1 items-center">
                        <LuMilkOff className="text-primary" /> Dairy Free
                      </div>
                    )}
                  </div>

                  <p
                    className="p-2 text-justify"
                    dangerouslySetInnerHTML={{
                      __html:
                        recipe.summary.length > 400
                          ? recipe.summary.substring(0, 400) + "..."
                          : recipe.summary,
                    }}
                  />
                </a>
              ))}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Recipe;
