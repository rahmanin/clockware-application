const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(
      token,
      process.env.SECRETKEY
    );
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).send({
      msg: 'Your session is not valid!'
    });
  }
}

module.exports = isLoggedIn;