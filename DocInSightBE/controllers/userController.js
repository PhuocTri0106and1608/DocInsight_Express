import User from "../models/User.js";
import BadRequestError from "../errors/badRequestError.js";
import NotFoundError from "../errors/notFoundError.js";
import PasswordValidator from "password-validator";
import {
  mailTransport,
  OtpTemplate,
  generateOTP,
  passwordResetTemplate,
} from "../utils/mail.js";
import ResetToken from "../models/ResetToken.js";

// init password validator
let passwordSchema = new PasswordValidator();

// Add properties to it
passwordSchema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(16) // Maximum length 16
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .not()
  .spaces(); // Should not have spaces


const request_change_password = async (req, res) => {
  const user = await User.findById(req.params._id);
  if (!user) throw new NotFoundError("User not found, invalid request");

  const token = await ResetToken.findOne({ owner: user._id });
  if (token)
    throw new ForbiddenError(
      "Only after one hour you can request for another token!"
    );

  // generate verification otp
  const OTP = generateOTP();

  const resetToken = new ResetToken({
    owner: user._id,
    token: OTP,
  });

  const result = await resetToken.save();

  // send a mail that contain otp to the user's email
  mailTransport().sendMail({
    from: "HRManagement2003@gmail.com",
    to: user.email,
    subject: "Otp to reset your password",
    html: OtpTemplate(OTP),
  });

  res.status(200).json(result);
};

const change_password = async (req, res) => {
  try {
    const { newPassword, oldPassword, otp } = req.body;
    console.log(newPassword, oldPassword);
    if (!newPassword || !oldPassword || !otp.trim())
      throw new BadRequestError("Invalid request!");

    const user = await User.findById(req.params._id);
    if (!user) throw new NotFoundError("User not found!");

    const token = await ResetToken.findOne({ owner: user._id });
    if (!token) throw new NotFoundError("User not found!");
    const isMatched = await token.compareToken(otp);
    if (!isMatched) throw new BadRequestError("Please provide a valid OTP!");

    const isSameOldPassword = await user.comparePassword(oldPassword);
    if (!isSameOldPassword)
      throw new BadRequestError("Wrong password. Please check it again.");
    const isSameNewPassword = await user.comparePassword(newPassword);
    if (isSameNewPassword)
      throw new BadRequestError(
        "New password must be different from the old one!"
      );

    // validate password
    const validateResult = passwordSchema.validate(newPassword.trim(), {
      details: true,
    });
    if (validateResult.length != 0) {
      throw new BadRequestError(validateResult);
    }

    user.password = newPassword.trim();
    await user.save();

    await ResetToken.findOneAndDelete({ owner: user._id });

    mailTransport().sendMail({
      from: "HRManagement2003@gmail.com",
      to: user.email,
      subject: "Change Password Successfully",
      html: passwordResetTemplate(),
    });

    res.status(200).json({
      Status: "Success",
      message: "Change Password Successfully",
    });
  } catch (err) {
    throw err;
  }
};

const get_user_by_id = async (req, res) => {
  try {
    const id = req.params._id;
    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User not found");
    user.password = undefined;
    res.status(200).json(user);
  } catch (err) {
    res.status(err.status || 400).json({
      message: err.messageObject || err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: true},
      { new: true }
    );
    res.status(200).json({
      message: "Deleted user successfully",
      user: user,
    });
  } catch (err) {
    throw err;
  }
};



export {
  request_change_password,
  change_password,
  get_user_by_id,
  deleteUser,
};
