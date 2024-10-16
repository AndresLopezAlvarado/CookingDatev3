import User from "../models/UserModel.js";

export const getPeople = async (req, res) => {
  try {
    const { userId } = req.query;
    const people = await User.find({ blockedPeople: { $nin: [userId] } });

    res.json(people);
  } catch (error) {
    console.error({
      message: "Something went wrong on get people",
      error: error,
    });

    res.status(500).json({
      message: "Something went wrong on get people",
      error: error,
    });
  }
};

export const getPerson = async (req, res) => {
  try {
    const person = await User.findById(req.params.id);

    if (!person)
      return res.status(404).json({ message: "Person no found (getPerson)" });

    res.json(person);
  } catch (error) {
    console.error({
      message: "Something went wrong on get person (getPerson)",
      error: error,
    });

    res.status(500).json({
      message: "Something went wrong on get person (getPerson)",
      error: error,
    });

    throw new Error({
      message: "Something went wrong on get person (getPerson)",
      error: error,
    });
  }
};
