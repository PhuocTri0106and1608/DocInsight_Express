import { Router } from "express";
import { getResults, getResult, postResult, deleteResult } from "../controllers/predictResultController.js";
import uploads from "../middlewares/image.js";

const resultRouter = Router();

resultRouter.get('/results/:patientId',getResults);
resultRouter.get('/result/:id',getResult);
resultRouter.post('/result',uploads.single("inputImage"),postResult);
resultRouter.delete('/result/:id',deleteResult);

export default resultRouter;