import Router from "express";
import { getPatients, getPatient, postPatient, updatePatient, deletePatient } from "../controllers/patientController.js";


const patientRouter = Router();

patientRouter.get('/patients/:doctorId', getPatients);
patientRouter.get('/patient/:id', getPatient);
patientRouter.post('/patient',postPatient);
patientRouter.put('/patient/:id',updatePatient);
patientRouter.delete('/patient/:id',deletePatient);

export default patientRouter;

