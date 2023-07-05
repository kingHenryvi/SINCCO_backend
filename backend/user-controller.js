import mongoose from "mongoose";

// get user model registered in Mongoose
const User = mongoose.model("User");
// const Application = mongoose.model("ApplicationSchema");

//get all students
const getStudents = async (req, res) => {
  const students = await User.find({ usertype: "Student" });
  res.send(students);
};


const getStudentByUserId = async (req, res) => {
  const { objectID } = req.body;
  const student = await User.findOne({ _id: objectID });
  res.send(student);
};



const getAccountsForApproval = async (req, res) => {
  const accounts = await User.find({ userType: "Student", isApproved: false });
  res.send(accounts);
};

const getAdminName = async (req, res) => {
  const admin = await User.findOne({ userType: "Admin" });
  console.log(admin);
  res.send({ firstname: admin.firstname, lastname: admin.lastname, middlename: admin.middlename });
};

const approveAccount = async (req, res) => {
  const student = new mongoose.Types.ObjectId(req.body.userID);
  const adviser = new mongoose.Types.ObjectId(req.body.adviserID);
  const result = await User.updateOne({ _id: student }, { $set: { isApproved: true, adviser: adviser } });
  if (result.modifiedCount > 0) {
    res.send({ success: true });
  } else {
    res.send({ succes: false });
  }
};

const rejectAccount = async (req, res) => {
  const student = new mongoose.Types.ObjectId(req.body.objectID);
  const result = await User.deleteOne({ _id: student });

  if (result.deletedCount > 0) {
    res.send({ success: true });
  } else {
    res.send({ succes: false });
  }
};

const getAccountsSortedByFirstame = async (req, res) => {
  const { isAscending } = req.body;
  var accounts;
  if (isAscending) {
    accounts = await User.find({ userType: "Student", isApproved: false }).sort({ firstname: 1 });
  } else {
    accounts = await User.find({ userType: "Student", isApproved: false }).sort({ firstname: -1 });
  }
  res.send(accounts);
};

//get student alphabetically sorted by their last names
const getAccountsSortedByLastname = async (req, res) => {
  const { isAscending } = req.body;
  var accounts;
  if (isAscending) {
    accounts = await User.find({ userType: "Student", isApproved: false }).sort({ lastname: 1 });
  } else {
    accounts = await User.find({ userType: "Student", isApproved: false }).sort({ lastname: -1 });
  }
  res.send(accounts);
};

//sort students by their student number
const getAccountsSortedByStudentNumber = async (req, res) => {
  const { isAscending } = req.body;
  var accounts;
  if (isAscending) {
    accounts = await User.find({ userType: "Student", isApproved: false }).sort({ stdnum: 1 });
  } else {
    accounts = await User.find({ userType: "Student", isApproved: false }).sort({ stdnum: -1 });
  }
  res.send(accounts);
};

const approveStudentAccount = async (req, res) => {
  // const approvers = req.body.approvers;
  console.log(req.body.approvers);
  const result = await User.updateMany({ id: { $in: req.body.selected } }, { $set: { isApproved: true } });
  console.log(result);
  if (result.modifiedCount > 0) {
    res.send({ success: true });
  } else {
    res.send({ succes: false });
  }
};

export {
  getStudents,
  getStudentByUserId,
  getAccountsForApproval,
  approveAccount,
  rejectAccount,
  getAccountsSortedByFirstame,
  getAccountsSortedByLastname,
  getAccountsSortedByStudentNumber,
  approveStudentAccount,
  getAdminName
};

