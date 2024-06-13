import mongoose from "mongoose";

const patientSchema = mongoose.Schema({
        doctorId:{
            type: mongoose.Types.ObjectId,
            required: [true,'A patient must have a doctor'],
            ref: 'User'
        },
        name:{
            type: String,
            required: [true, 'A patient must have a name'],  
        },
        birthday: {
            type: Number,
            required: [true, "Birthday is missing"],
        },
        age: {
            type: Number,
            required: [true, "Age is missing"],
        },
        address: {
            type: String,
            required: [true, "Address is missing"],
        },
        gender: {
            type: String,
            enum: ["male", "female"],
            required: [true, "Gender is missing"],
        },
        disease: {
            type: String,
            default: "lung",
            required: [true, "Address is missing"],
        },
        isDeleted:{
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true }
)

const Patient = mongoose.model('Patient',patientSchema);

export default Patient