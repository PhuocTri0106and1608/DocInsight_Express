import mongoose from "mongoose";
import pkg from "validator";
import bcrypt from "bcrypt";
import validator from "validator";
const { isEmail } = pkg;
import UnauthorizedError from "../errors/unauthorizedError.js";
import BadRequestError from "../errors/badRequestError.js";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "A email with the same name has already exists"],
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    name: {
      type: String,
      required: [true, "Name is missing"],
    },
    password: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Gender is missing"],
    },
    refreshToken: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// static method to login user
userSchema.statics.login = async function (email, password) {
  if (!validator.isEmail(email)) {
    throw new BadRequestError("Invalid email");
  }
  const user = await this.findOne({ email });
  console.log(user);
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw new UnauthorizedError("Incorrect password");
  }
  throw new UnauthorizedError("Incorrect email");
};

userSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
