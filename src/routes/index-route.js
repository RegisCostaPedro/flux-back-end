
const express = require('express');
const app = require('../app');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).send({
        title: 'Flux',
        version: '0.0.28'
    })
});

module.exports = router