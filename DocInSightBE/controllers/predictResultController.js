import NotFoundError from "../errors/notFoundError.js";
import PredictResult from "../models/PredictResult.js";
import BadRequestError from "../errors/badRequestError.js";
import Patient from "../models/Patient.js";

const getResultsByDoctor = async (req, res) => {
    const { doctorId } = req.params;
    try {
        const patients = await Patient.find({ isDeleted: false, doctorId: doctorId });
        if (patients.length === 0) {
            throw new NotFoundError("Not found any patient of this doctor");
        }
        var results = [];
        await Promise.all(
            patients.map(async (patient) => {
                const patientResults = await PredictResult.find({ isDeleted: false, patientId: patient._id }).populate("patientId");
                if(patientResults.length !== 0)
                {
                    patientResults.map(result => {
                        results.push(result);
                    });
                }
            })
          );
        if (results.length === 0) {
            throw new NotFoundError("Not found any result");
        }
        res.status(200).json(results);
    } catch (err) {
        throw err;
    }
};
const getResultsByPatient = async (req, res) => {
    const { patientId } = req.params;
    try {
        const results = await PredictResult.find({ isDeleted: false, patientId: patientId }).populate('patientId');
        if (!results) {
            throw new NotFoundError("Not found any result");
        }
        res.status(200).json(results);
    } catch (err) {
        throw err;
    }
};

const getResult = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await PredictResult.findById(id);
        if (result && result.isDeleted === false) {
            res.status(200).json(result);
        } else if (result && result.isDeleted === true) {
            res.status(410).send("Result is deleted");
        } else {
            throw new NotFoundError("Result not found");
        }
    } catch (err) {
        throw err;
    }
};

const postResult = async (req, res) => {
    const { patientId, 
        inputImage, 
        resultImage,
        coronaPercent,
        normalPercent,
        pneumoniaPercent,
        tuberculosisPercent, } = req.body;
        try {
        let predictions = [coronaPercent, normalPercent, pneumoniaPercent, tuberculosisPercent];
        const class_names = ["Corona Virus Disease", "Normal", "Pneumonia", "Tuberculosis"]
        predictions = predictions.map(p => parseFloat(p));
        const maxPrediction = Math.max(...predictions);
        const maxIndex = predictions.indexOf(maxPrediction);
        if (maxIndex !== -1) {
            var resultLabel = class_names[maxIndex];
        } else {
            console.log("Result label undefined");
        }
        
        const newResult = new PredictResult({
            patientId,
            inputImage,
            resultImage,
            resultLabel: resultLabel,
            coronaPercent: coronaPercent,
            normalPercent: normalPercent,
            pneumoniaPercent: pneumoniaPercent,
            tuberculosisPercent: tuberculosisPercent,
        });

        const createdResult = await newResult.save();

        res.status(201).json({
            success: true,
            message: "New result predicted!",
            createdResult,
        });
        } catch (err) {
        res.status(err.status || 400).json({
            message: err.messageObject || err.message,
        });
    }
};
    
const deleteResult = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await PredictResult.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        );
        res.status(200).json({
            message: "Deleted result successfully",
            result: result,
        });
    } catch (err) {
        throw err;
    }
};

export { getResultsByDoctor, getResultsByPatient, getResult, postResult, deleteResult};
