import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ImSpoonKnife } from "react-icons/im";
import { PiKnifeFill } from "react-icons/pi";
import { IoFastFoodOutline } from "react-icons/io5";
import { TiMessages } from "react-icons/ti";
import { differenceInYears, parseISO } from "date-fns";
import { useGetPersonQuery } from "../people/peopleApiSlice";
import PhotoCarousel from "../../components/PhotoCarousel";

const Person = () => {
  const params = useParams();
  const [age, setAge] = useState(null);
  const { data: person, isLoading } = useGetPersonQuery({ userId: params.id });

  async function loadAge() {
    var agePerson = null;

    if (person) {
      if (person.birthdate) {
        agePerson = differenceInYears(new Date(), parseISO(person.birthdate));

        setAge(agePerson);
      } else {
        setAge(0);
      }
    }
  }

  useEffect(() => {
    loadAge();
  }, [person]);

  return (
    <div className="h-screen w-full p-1 gap-y-1 flex flex-col justify-center items-center text-center">
      {person ? (
        <>
          {/* Photos */}
          <div className="h-[50vh] w-full border-[#FF3B30] border p-1 rounded-md">
            {person.photos ? (
              <PhotoCarousel photos={person.photos} />
            ) : (
              <div className="h-full flex">
                <img
                  className="rounded-full"
                  src={
                    person.profilePicture
                      ? person.profilePicture.url
                      : "/noProfilePhoto.png"
                  }
                />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="h-1/2 space-y-4">
            {/* Info */}
            <div>
              <h1 className="text-2xl font-bold">
                {person.username}
                {age ? <span>, {age} years</span> : null}
              </h1>

              {person.country ? (
                <h3 className="text-xl">
                  <span className="font-bold">From:</span> {person.country}
                </h3>
              ) : null}

              {person.gender ? (
                <h4 className="text-xl">
                  <span className="font-bold">Gender:</span> {person.gender}
                </h4>
              ) : null}

              {person.dietaryPreferences ? (
                <h5 className="text-xl">
                  <span className="font-bold">Dietary preferences:</span>{" "}
                  {person.dietaryPreferences}
                </h5>
              ) : null}
            </div>

            {/* Barra */}
            <div className="bg-[#FF3B30] font-bold p-2 rounded-md flex text-4xl space-x-8 justify-center items-center text-center">
              <Link className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md">
                <ImSpoonKnife />
              </Link>

              <Link className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md">
                <IoFastFoodOutline />
              </Link>

              <Link className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md">
                <PiKnifeFill />
              </Link>

              <Link
                to={`/chat/${person._id}`}
                className="bg-[#FF9500] hover:bg-[#FFCC00] focus:ring-white focus:outline-none focus:ring-2 focus:ring-inset font-bold p-2 rounded-md"
              >
                <TiMessages />
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Person;
