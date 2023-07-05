import { mongoose, ObjectId } from "mongoose";

import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  middlename: { type: String, required: true },
  lastname: { type: String, required: true },
  stdnum: { type: String, required: false },
  userType: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  applications: { type: Array, required: false },
  adviser: { type: Object, required: false },
  id: { type: String, required: false },
  isApproved: { type: Boolean, required: false },
  initialslname: { type: String, required: false },
});

UserSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) {
      return next(saltError);
    }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) {
        return next(hashError);
      }
      user.password = hash;
      return next();
    });
  });
});

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, callback);
};

mongoose.model("User", UserSchema);
