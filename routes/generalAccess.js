const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const generalAccess = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(
      token,
      process.env.SECRETKEY_MASTER
    );
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).send({
      msg: 'Your session is not valid!'
    });
  }
}

module.exports = generalAccess;