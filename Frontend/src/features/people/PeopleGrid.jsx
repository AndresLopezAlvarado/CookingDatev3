import PersonCard from "./PersonCard";

const PeopleGrid = ({ people }) => {
  return (
    <div className="flex-1 p-1 grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
      {people.map((person, index) => (
        <PersonCard person={person} key={index} />
      ))}
    </div>
  );
};

export default PeopleGrid;
