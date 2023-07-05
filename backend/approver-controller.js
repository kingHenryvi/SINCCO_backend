import { mongoose, ObjectId } from "mongoose";

const User = mongoose.model("User");

const addApprover = async (req, res) => {
  const { firstname, middlename, lastname, userType, email, password } = req.body;
  const fnameinitials = firstname
    .split(" ")
    .map((initial) => initial[0])
    .join("");
  const mnameinitial = middlename[0];
  const lname = lastname.toUpperCase();
  const initialslname = fnameinitials + mnameinitial + lname;
  console.log(initialslname);
  const newApprover = new User({
    firstname: firstname,
    middlename: middlename,
    lastname: lastname,
    userType: userType,
    email: email,
    password: password,
    isApproved: true,
    initialslname: initialslname,
  });

  const result = await newApprover.save();
  await User.updateOne({ _id: result._id }, { $set: { id: result._id } });

  if (result._id) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
};

const getAllApprovers = async (req, res) => {
  const approvers = await User.find({ userType: "Approver" });
  res.send(approvers);
};

const getApproverByName = async (req, res) => {
  const name = req.query.name.split(" ");
  console.log(name);
  const approver = await User.findOne({
    $and: [
      { userType: "Approver" },
      {
        $or: [{ firstname: { $in: name } }, { middlename: { $in: name } }, { lastname: { $in: name } }],
      },
    ],
  });
  console.log(approver);
  if (approver == null) {
    res.send({});
  } else {
    res.send(approver);
  }
};

const getApproverByID = async (req, res) => {
  const approver = await User.findOne({
    _id: new mongoose.Types.ObjectId(req.body.adviserID)
  });
  console.log(new mongoose.Types.ObjectId(req.body.adviserID));
  if (approver == null) {
    res.send({});
  } else {
    res.send(approver);
  }
};

const assignAdviser = async (req, res) => {
  const { stdnum, adviserID } = req.body;
  const adviserObjectId = new mongoose.Types.ObjectId(adviserID);
  const result = await User.updateOne({ userType: "Student", stdnum: stdnum }, { $set: { adviser: adviserObjectId } });
  if (result.modifiedCount > 0 || result.matchedCount > 0) {
    res.send({ success: true });
  } else {
    res.send({ succes: false });
  }
};

const deleteApprover = async (req, res) => {
  // const approvers = req.body.approvers;
  console.log(req.body.approvers);
  const result = await User.deleteMany({ id: { $in: req.body.selected } });
  console.log(result);
  if (result.deletedCount > 0) {
    res.send({ success: true });
  } else {
    res.send({ succes: false });
  }
};

const deleteOneApprover = async (req, res) => {
  console.log(req.body.approvers);

  const result = await User.deleteOne({ _id: req.body.userID });
  console.log(result);
  if (result.deletedCount > 0) {
    res.send({ success: true });
  } else {
    res.send({ succes: false });
  }
};

const getApproversSortedByFirstame = async (req, res) => {
  const { isAscending } = req.body;
  var accounts;
  if (isAscending) {
    accounts = await User.find({ userType: "Approver" }).sort({ firstname: 1 });
  } else {
    accounts = await User.find({ userType: "Approver" }).sort({
      firstname: -1,
    });
  }
  res.send(accounts);
};

//get student alphabetically sorted by their last names
const getApproversSortedByLastname = async (req, res) => {
  const { isAscending } = req.body;
  var accounts;
  if (isAscending) {
    accounts = await User.find({ userType: "Approver" }).sort({ lastname: 1 });
  } else {
    accounts = await User.find({ userType: "Approver" }).sort({ lastname: -1 });
  }
  res.send(accounts);
};

const assignAdvisersToStudents = async (req, res) => {
  console.log("here");
  const { adviserStudent } = req.body;
  var successfulAssignmentCount = 0;
  for (let i = 0; i < adviserStudent.length; i++) {
    const studno_adviser = adviserStudent[i].replace("\r", "").split(",");
    const studno = studno_adviser[0];
    const adviserInitialsLname = studno_adviser[1].trim().toUpperCase();
    console.log(adviserInitialsLname);
    const adviser = await User.findOne({ initialslname: adviserInitialsLname });
    // console.log(adviser);
    if (adviser) {
      console.log(adviser._id);
      const result = await User.updateOne({ stdnum: studno }, { $set: { adviser: adviser._id, isApproved: true } });
      console.log(result);
      if (result) {
        successfulAssignmentCount++;
      }
    } else {
      console.log("err");
    }
  }

  if ((successfulAssignmentCount = adviserStudent.length)) {
    res.send({ success: true });
  } else {
    res.send({ success: false, failedAssignment: adviserStudent.length - successfulAssignmentCount });
  }
};

// if (result.modifiedCount > 0) {
//   res.send({success: true})
// } else {
//   res.send({success: false})
// }

export {
  addApprover,
  getAllApprovers,
  getApproverByName,
  assignAdviser,
  deleteApprover,
  deleteOneApprover,
  getApproversSortedByFirstame,
  getApproversSortedByLastname,
  assignAdvisersToStudents,
  getApproverByID
};
