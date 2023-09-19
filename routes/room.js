/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var express = require('express');
var router = express.Router();
var config = require('../config');
var rds = require('../rds');

function getRooms() {
    const [pool, url] = rds();
    pool.getConnection(function(err, con){
      if (err) {
        next(err);
      }
      else {
        con.query('SELECT * FROM hotel.rooms', function(error, results, fields) {
          if (err) {
            console.log(error);
            res.status(500).json({ error: error.code });
          }
          if (results) {
            console.log('results: %j', results);
            res.status(200).json({data: results})
          }
        });
        con.release();
      }
    }); 
}

function addRoom(req) {
    if (req.body.roomNumber && req.body.floorNumber && req.body.hasView) {
      const roomNumber = req.body.roomNumber;
      const floorNumber = req.body.floorNumber;
      const hasView = req.body.hasView;
  
      console.log('New room request received. roomNumber: %s, floorNumber: %s, hasView: %s', roomNumber, floorNumber, hasView);
      
      var sql = "INSERT INTO hotel.rooms (id, floor, hasView) VALUES (?, ?, ?)";
      sqlParams = [roomNumber, floorNumber, hasView];
      
      const [pool, url] = rds();
      pool.getConnection(function(err, con){
        if (err) {
          next(err)
        }
        else {
          con.query(sql, sqlParams, function(error, results, fields) {
            con.release();
            if (err) {
                console.log(error);
                res.status(500).json({ error: error.code });
            }
            if (results) {
                console.log('results: %j', results);
                res.status(200).json({data: results})
            }
            });
        }
        con.release();
      });
    } else {
      console.log("Missing params");
      res.status(500).json({ error: 'Missing params'});
    }
}

router.get('/', function(req, res, next) {
  try {
    getRooms();
  } catch (err) {
    next(err);
  }
});

router.post('/', function (req, res, next) {
  try {
    addRoom(req);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
