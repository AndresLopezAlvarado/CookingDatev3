import PersonCard from "./PersonCard";

const PeopleGrid = ({ people }) => {
  return (
    <div className="p-1 flex-1 grid grid-cols-3 gap-1 items-start sm:grid-cols-4 lg:grid-cols-5">
      {people.map((person, index) => (
        <PersonCard person={person} key={index} />
      ))}
    </div>
  );
};

export default PeopleGrid;
