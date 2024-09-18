import PersonCard from "./PersonCard";

const PeopleGrid = ({ people }) => {
  return (
    <div className="w-full rounded-md grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
      {people.map((person) => (
        <PersonCard person={person} key={person._id} />
      ))}
    </div>
  );
};

export default PeopleGrid;
