var express = require('express');
var router = express.Router();

// GET /calendar/review_tasks: response
router.get('/calendar/review_tasks', function(req, res, next) {
  timeUnit = req.query['time_unit']
  startingDate = req.query['starting_date']
})

// POST /calendar/add_task: response
router.post('/calendar/add_task', function(req, res, next) {
  task = req.body['task']
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
