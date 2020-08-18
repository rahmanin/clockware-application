const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const generalAccess = (req, res, next) => {
  try {
    console.log(`${process.env.SECRETKEY_MASTER}${req.headers.id}`)
    const token = req.headers.authorization;
    const decoded = jwt.verify(
      token,
      req.headers.isadmin ? process.env.SECRETKEY_ADMIN : `${process.env.SECRETKEY_MASTER}${req.headers.id}`
    );
    console.log(decoded)
    req.userData = decoded;
    next();
  } catch (err) {
    console.log(err)
    return res.status(401).send({
      msg: 'Your session is not valid!'
    });
  }
}

module.exports = generalAccess;