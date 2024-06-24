import BadRequestError from "../errors/badRequestError.js";
import NotFoundError from "../errors/notFoundError.js";
import Patient from "../models/Patient.js";
import PredictResult from "../models/PredictResult.js";

const getPatients = async (req, res) => {
    const { doctorId } = req.params;
    try {
        const patients = await Patient.find({ isDeleted: false, doctorId: doctorId });
        if (!patients) {
            throw new NotFoundError("Not found any patients");
        }
        res.status(200).json(patients);
    } catch (err) {
        throw err;
    }
};

const getPatient = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await Patient.findById(id);
        if (patient && patient.isDeleted === false) {
            res.status(200).json(patient);
        } else if (patient && patient.isDeleted === true) {
            res.status(410).send("Patient is deleted");
        } else {
            throw new NotFoundError("Patient not found");
        }
    } catch (err) {
        throw err;
    }
};

const postPatient = async (req, res) => {
    const { doctorId, name, birthday, address, gender, disease } = req.body;

    try {
        const curYear = new Date().getFullYear();
        const newPatient = new Patient({
            doctorId: doctorId,
            name: name,
            birthday: birthday,
            age: curYear - birthday,
            address: address,
            gender: gender,
            disease: disease,
        });

        const createdPatient = await newPatient.save();
        res.status(201).json({
            message: "Create patient successfully",
            patient: createdPatient,
        });
    } catch (err) {
        res.status(err.status || 400).json({
            message: err.messageObject || err.message,
        });
    }
};

const updatePatient = async (req, res) => {
    const { id } = req.params;
    const { name, birthday, address, gender, disease } = req.body;

    try {
        const patient = await Patient.findById(id);

        if (!patient) {
            throw new NotFoundError("Patient not found");
        }
        if (patient.isDeleted) {
            res.status(410).send("Patient is deleted");
            return;
        }
        const curYear = new Date().getFullYear();
        patient.name = name;
        patient.birthday = birthday;
        patient.age = curYear - birthday;
        patient.address = address;
        patient.gender = gender;
        patient.disease = disease;

        await patient.save();

        res.status(200).json(patient);
    } catch (err) {
        throw err;
    }
};

const deletePatient = async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await Patient.findByIdAndUpdate(id, { isDeleted: true });
        const predictResults = await PredictResult.find({ patientId: id, isDeleted: false });
        if (predictResults.length !== 0){
            predictResults.map(async (pre) => {
                pre.isDeleted = true;
                await pre.save();
            });
        }
        res.status(200).json({
            message: "Deleted patient successfully",
            patient: patient,
        });
    } catch (err) {
        throw err;
    }
};

export {
    getPatients,
    getPatient,
    postPatient,
    updatePatient,
    deletePatient
};
