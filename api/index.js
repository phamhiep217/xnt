import express from 'express';
import data from '../src/data'

const router = express.Router();

router.get('/contests', (req,res) => {
    res.send({ contests: data.contests});
});

export default router;