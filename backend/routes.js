import { signUp, login, checkIfLoggedIn } from "./auth-controller.js";

import {
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
} from "./user-controller.js";

import {
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
} from "./approver-controller.js";

import {
  getApplicationsByApprover,
  approveApplication,
  rejectApplication,
  getAllApplicationsOfStudent,
  addApplication,
  getAccountsForClearance,
  editApplicationStatus,
  resubmitApplication
} from "./application-controller.js";

const setUpRoutes = (app) => {
  app.get("/", (req, res) => {
    res.send("API Home");
  });
  app.post("/signup", signUp);
  app.post("/login", login);
  app.post("/checkifloggedin", checkIfLoggedIn);
  app.get("/get-all-students", getStudents);

  app.post("/get-accounts-for-approval", getAccountsForApproval); //working
  app.post("/approve-account-application", approveAccount);
  app.post("/approve-student-accounts", approveStudentAccount);
  app.post("/reject-account-application", rejectAccount);
  app.post("/get-accounts-for-approval-sorted-by-firstname", getAccountsSortedByFirstame);
  app.post("/get-accounts-for-approval-sorted-by-lastname", getAccountsSortedByLastname);
  app.post("/get-accounts-for-approval-sorted-by-stdnum", getAccountsSortedByStudentNumber);

  app.post("/get-all-approvers", getAllApprovers);
  app.get("/get-approver-by-name", getApproverByName);
  app.post("/get-approver-by-id", getApproverByID);
  app.post("/add-approver", addApprover);
  app.post("/assign-adviser", assignAdviser);
  app.post("/delete-approver", deleteApprover);
  app.post("/delete-one-approver", deleteOneApprover);
  app.post("/get-approvers-sorted-firstname", getApproversSortedByFirstame);
  app.post("/get-approvers-sorted-lastname", getApproversSortedByLastname);

  app.post("/get-applications-by-approver", getApplicationsByApprover);
  app.post("/approve-application", approveApplication);
  app.post("/reject-application", rejectApplication);
  app.get("/get-admin-name", getAdminName);

  app.post("/get-all-applications-of-student", getAllApplicationsOfStudent);
  app.post("/get-student-by-user-id", getStudentByUserId);
  app.post("/add-application", addApplication);
  app.post("/edit-application-status", editApplicationStatus);
  app.post("/resubmit-application", resubmitApplication);

  app.post("/assign-advisers-to-students-by-csv", assignAdvisersToStudents);
  app.post("/get-accounts-for-clearance", getAccountsForClearance);

};

export default setUpRoutes;
