import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center text-center">
      <h1 className="font-bold">
        Do you want to find a cooking date?{" "}
        <Link className="text-[#FFCC00]" to={"/signIn"}>
          Sign In!
        </Link>
      </h1>

      <img className="w-5/6" src="/panOnStove.gif" alt="logoHome" />
    </div>
  );
};

export default Home;
