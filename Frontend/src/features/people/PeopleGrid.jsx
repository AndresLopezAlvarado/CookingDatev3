import PersonCard from "./PersonCard";

const PeopleGrid = ({ people }) => {
  return (
    <div className="p-1 flex-1 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-9 gap-1 items-start">
      {people.map((person, index) => (
        <PersonCard person={person} key={index} />
      ))}
    </div>
  );
};

export default PeopleGrid;
