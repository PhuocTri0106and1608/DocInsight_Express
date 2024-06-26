import { Router } from "express";
import { getResultsByDoctor, getResultsByPatient, getResult, postResult, deleteResult } from "../controllers/predictResultController.js";
import uploads from "../middlewares/image.js";

const resultRouter = Router();

resultRouter.get('/results-by-doctor/:doctorId',getResultsByDoctor);
resultRouter.get('/results-by-patient/:patientId',getResultsByPatient);
resultRouter.get('/result/:id',getResult);
resultRouter.post('/result',postResult);
resultRouter.delete('/result/:id',deleteResult);

export default resultRouter;