// server/routes/dataRoutes.js
import { Router } from 'express';
import apiservice from "../services/externalApiService.js";
// import { fetchData } from '../controllers/dataController';

const router = Router();

// Define a GET endpoint for retrieving the external API data
router.get('/', async(req,res) => {
    const data = apiservice.getSpecificData();
    res.send(data + " Hello");
});

export default router;
