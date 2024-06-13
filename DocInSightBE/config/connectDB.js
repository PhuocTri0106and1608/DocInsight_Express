import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL_DATABASE, {});
    console.log("connect successfully");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDB;
