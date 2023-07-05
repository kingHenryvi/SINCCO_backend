import mongoose, { isValidObjectId, ObjectId } from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  status: { type: String, required: true },
  step: { type: Number, required: true },
  remarks: { type: Array, required: false },
  student_submission: { type: Array, required: false },
  ownerID: { type: Object, required: true },
  adviserID: { type: Object, required: true },
  owner: { type: Object, required: true },
  id: { type: String, require: true },
});

const Application = mongoose.model("Application", ApplicationSchema);
const User = mongoose.model("User");

const approveApplication = async (req, res) => {
  const result = await Application.updateOne(
    { _id: req.body.objectID },
    {
      $set: { status: req.body.status, step: req.body.step },
      $push: {
        remarks: {
          remark: req.body.message,
          date: new Date(),
          stepgiven: req.body.stepgiven,
          commenter: req.body.commenter,
        },
      },
    }
  );
  // await User.updateOne({ student: req.body.userObjectaID }, { $set: { isApplicationApproved: true } });
  if (result.modifiedCount > 0) {
    res.send({ success: true });
  } else {
    res.send({ succes: false });
  }
};

const rejectApplication = async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.body.objectID);
  const result = await Application.updateOne(
    { _id: id },
    {
      $push: {
        remarks: {
          remark: req.body.message,
          date: new Date(),
          stepgiven: req.body.stepgiven,
          commenter: req.body.commenter,
        },
      },
      $set: { status: req.body.status, step: req.body.step },
    }
  );

  // .updateOne(
  //   { _id: req.body.objectID },
  //   { $set: { step: "0", status: "Closed", "remark.remark": req.body.message, "remark.date": Date.now() } }
  // );
  if (result.modifiedCount > 0) {
    res.send({ success: true });
  } else {
    res.send({ succes: false });
  }
};

const getAllApplicationsOfStudent = async (req, res) => {
  const { objectID } = req.body;
  try {
    const applications = await Application.find({
      ownerID: new mongoose.Types.ObjectId(objectID),
    });
    res.send(applications);
  } catch (error) {
    res.status(500).send("Error retrieving applications");
  }
};

async function addStudentApplication(applicationObjectId, studentObjectId) {
  const result = await User.updateOne({ _id: studentObjectId }, { $push: { applications: applicationObjectId } });
  if (result.modifiedCount > 0) {
    return true;
  } else {
    return false;
  }
}

const addApplication = async (req, res) => {
  const { ownerID, ssRemark, ssLink, ssDate, firstname, middlename, lastname, stdnum, adviserID } = req.body;
  const newApplication = new Application({
    status: "Pending",
    step: 1,
    ownerID: new mongoose.Types.ObjectId(ownerID),
    adviserID: new mongoose.Types.ObjectId(adviserID),
    owner: {
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      stdnum: stdnum,
    },
    remarks: [],
    student_submission: [
      {
        github: ssLink,
        remark: ssRemark,
        date: new Date(ssDate),
        stepgiven: 1,
      },
    ],
  });
  const result = await newApplication.save();
  await Application.updateOne({ _id: result._id }, { $set: { id: result._id } });
  const studentObjectId = new mongoose.Types.ObjectId(ownerID);
  if (result._id) {
    if (await addStudentApplication(result._id, studentObjectId)) {
      res.send(result._id);
    } else {
      res.send({ success: "did not save" });
    }
  } else {
    res.send({ success: false });
  }
};

const getApplicationsByApprover = async (req, res) => {
  const id = req.body.userID;
  const userID = new mongoose.Types.ObjectId(id);
  const applications = await Application.find({ adviserID: userID, status: "Pending", step: 1 });
  res.send(applications);
};

const getAccountsForClearance = async (req, res) => {
  const accounts = await Application.find({ step: 2, status: "Pending" });
  res.send(accounts);
};

const editApplicationStatus = async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.body.objectID);
  const result = await Application.updateOne(
    { _id: id },
    {
      $set: { status: req.body.status },
    }
  );

  if (result.modifiedCount > 0) {
    res.send({ success: true });
  } else {
    res.send({ succes: false });
  }
}

const resubmitApplication = async (req, res) => {
  const { appID, ssLink, ssRemark, ssDate, ssStepgiven } = req.body;
  const applicationID = new mongoose.Types.ObjectId(appID);
  const result = await Application.updateOne(
    { _id: applicationID },
    {
      $push: {
        student_submission: {
          github: ssLink,
          remark: ssRemark,
          date: new Date(ssDate),
          stepgiven: ssStepgiven,
        },
      },
      $set: { status: "Pending" },
    }
  );

  if (result.modifiedCount > 0) {
    res.send({ success: true });
  } else {
    res.send({ succes: false });
  }
}

export {
  approveApplication,
  rejectApplication,
  getAllApplicationsOfStudent,
  addApplication,
  getApplicationsByApprover,
  getAccountsForClearance,
  editApplicationStatus,
  resubmitApplication
};
