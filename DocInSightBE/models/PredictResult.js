import mongoose from "mongoose";

const predictResultSchema = mongoose.Schema({
        patientId: {
            type: mongoose.Types.ObjectId,
            required: [true,'A patient must have a doctor'],
            ref: 'Patient'
        },
        inputImage: {
            type: String,
            default:
            "https://res.cloudinary.com/dux8aqzzz/image/upload/v1685547037/xd0gen7b4z5wgwuqfvpz.png",
            required: true,
        },
        resultImage: {
            type: String,
            default:
            "https://res.cloudinary.com/dux8aqzzz/image/upload/v1685547037/xd0gen7b4z5wgwuqfvpz.png",
        },
        resultLabel: {
            type: String,
            default:
            "Normal",
        },
        coronaPercent: {
            type: Number,
            default: 0,
        },
        normalPercent: {
            type: Number,
            default: 0,
        },
        pneumoniaPercent: {
            type: Number,
            default: 0,
        },
        tuberculosisPercent: {
            type: Number,
            default: 0,
        },
        isDeleted: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    { timestamps: true }
);

const PredictResult = mongoose.model("PredictResult", predictResultSchema);

export default PredictResult;
