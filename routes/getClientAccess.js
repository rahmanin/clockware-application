const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const getClientAccess = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(
      token,
      process.env.SECRETKEY_CLI
    );
    req.userData = decoded;
    next()
  } catch (err) {
    return res.status(404).send({
      msg: 'NOT FOUND'
    });
  }
}

module.exports = getClientAccess;