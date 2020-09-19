var express = require('express');
var pool = require('./connection');
var router = express.Router();

const timeUnitMap = {
  D: 1,
  W: 7,
  X: 4
}

// GET /calendar/review_tasks: response
router.get('/calendar/review_tasks', function(req, res, next) {
  timeUnit = req.query['time_unit']
  startingDate = req.query['starting_date']
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(`
      SELECT *
        FROM tasks
       WHERE date >= ${ startingDate }
         AND date <= ${ parseInt(startingDate) + timeUnitMap[timeUnit] - 1 }
    `, function (error, result, fields) {
      res.send(result);
      connection.release();
    })
  })
})

// POST /calendar/add_task: response
router.post('/calendar/add_task', function(req, res, next) {
  task = req.body['task']
  res.send('received' + task)
})

// POST /calendar/delete_task: response
router.post('/calendar/delete_task', function(req, res, next) {
  taskId = req.body['task_id']
})

// POST /calendar/alter_task: response
router.post('/calendar/alter_task', function(req, res, next) {
  taskId = req.body['task_id']
  task = req.body['task']
})

module.exports = router;
