import User from "../models/UserModel.js";
import ReportModel from "../models/ReportModel.js";
import { getDistance } from "geolib";

export const getPeople = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId);

    const whoHaventBlockedMe = await User.find({
      _id: { $ne: userId },
      blockedPeople: { $nin: [userId] },
    });

    const sortedPeople = whoHaventBlockedMe
      .map((person) => ({
        ...person,
        distance: getDistance(
          {
            latitude: user.location.lat ? user.location.lat : 0,
            longitude: user.location.lng ? user.location.lng : 0,
          },
          {
            latitude: person.location.lat ? person.location.lat : 0,
            longitude: person.location.lng ? person.location.lng : 0,
          }
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    const people = sortedPeople.map((item) => item._doc);

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

export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.query;
    const { favoritePeople } = await User.findById(userId).populate(
      "favoritePeople"
    );

    res.json(favoritePeople);
  } catch (error) {
    console.error({
      message: "Something went wrong on getFavorites",
      error: error,
    });

    res.status(500).json({
      message: "Something went wrong on getFavorites",
      error: error,
    });
  }
};

export const reportPerson = async (req, res) => {
  try {
    const { reportedBy, reportedPerson, reason } = req.body;
    const newReport = new ReportModel({ reportedBy, reportedPerson, reason });
    const savedReport = await newReport.save();

    res.json(savedReport._id);
  } catch (error) {
    console.error({
      message: "Something went wrong on reportPerson",
      error: error,
    });

    res.status(500).json({
      message: "Something went wrong on reportPerson",
      error: error,
    });
  }
};
