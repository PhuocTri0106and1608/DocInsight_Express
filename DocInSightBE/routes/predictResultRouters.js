import { Router } from "express";
import { getResultsByDoctor, getResultsByPatient, getResult, postResult, deleteResult } from "../controllers/predictResultController.js";
import uploads from "../middlewares/image.js";

const resultRouter = Router();

resultRouter.get('/results/:doctorId',getResultsByDoctor);
resultRouter.get('/results/:patientId',getResultsByPatient);
resultRouter.get('/result/:id',getResult);
resultRouter.post('/result',uploads.single("inputImage"),postResult);
resultRouter.delete('/result/:id',deleteResult);

export default resultRouter;