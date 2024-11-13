import PersonCard from "./PersonCard";

const PeopleGrid = ({ people }) => {
  return (
    <div className="w-full rounded-md grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {people.map((person, index) => (
        <PersonCard person={person} key={index} />
      ))}
    </div>
  );
};

export default PeopleGrid;
