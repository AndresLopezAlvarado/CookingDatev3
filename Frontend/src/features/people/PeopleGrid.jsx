import { useSelector } from "react-redux";
import PersonCard from "./PersonCard";
import { selectCurrentUser } from "../auth/authSlice";

const PeopleGrid = ({ people }) => {
  const user = useSelector(selectCurrentUser);

  return (
    <div className="w-full rounded-md grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
      {people
        .filter((person) => person._id !== user._id)
        .map((person) => (
          <PersonCard person={person} key={person._id} />
        ))}
    </div>
  );
};

export default PeopleGrid;
