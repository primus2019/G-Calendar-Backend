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
  var timeUnit = req.query['time_unit']
  var startingDate = req.query['starting_date']
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(`
      SELECT *
        FROM tasks
       WHERE date >= ${ startingDate }
         AND date <= ${ parseInt(startingDate) + timeUnitMap[timeUnit] - 1 };
    `, function (error, result, fields) {
      var mapResult = {}
      for (var i = 0; i < timeUnitMap[timeUnit]; i++) {
        var tmpDate = (parseInt(startingDate) + i).toString()
        mapResult[i] = { date: tmpDate }
        for (var j = 0; j < result.length; j++) {
          if (result[j].date === tmpDate) {
            mapResult[i][result[j].start_hour] = result[j]
          }
        }
      }
      res.send(mapResult);
      connection.release();
    })
  })
})

// POST /calendar/add_task: response
router.post('/calendar/add_task', function(req, res, next) {
  var task = req.body['task']
  var duration_hour = task.end_hour - task.start_hour + (task.end_minute - task.start_minute) / 60
  task['length'] = duration_hour
  task['offset'] = task.start_minute / 60
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(`
      INSERT INTO tasks (
      date,
      start_hour,
      start_minute,
      end_hour,
      end_minute,
      length,
      offset,
      title,
      description,
      location,
      importance,
      daily
    )
    VALUES (
      "${ task.date }",
      ${ task.start_hour },
      ${ task.start_minute },
      ${ task.end_hour },
      ${ task.end_minute },
      ${ task.length },
      ${ task.offset },
      "${ task.title }",
      "${ task.description }",
      "${ task.location }",
      ${ task.importance },
      ${ task.daily }
    );
    `, function (error, result, fields) {
      if (error) {
        res.send({ status: 1 });
        throw error;
      };
      res.send({ status: 0 });
      connection.release();
    })
  })
})

// POST /calendar/delete_task: response
router.post('/calendar/delete_task', function(req, res, next) {
  taskId = req.body['task_id']
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(`
      DELETE FROM tasks
      WHERE task_id = ${ taskId }
      ;
    `, function (error, result, fields) {
      if (error) {
        res.send({ status: 1 });
        throw error;
      };
      res.send({ status: 0 });
      connection.release();
    })
  })
})

// POST /calendar/alter_task: response
router.post('/calendar/alter_task', function(req, res, next) {
  task = req.body['task']
  var duration_hour = task.end_hour - task.start_hour + (task.end_minute - task.start_minute) / 60
  task['length'] = duration_hour
  task['offset'] = task.start_minute / 60
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(`
      UPDATE tasks
      SET
        date="${ task.date }",
        start_hour=${ task.start_hour },
        start_minute=${ task.start_minute },
        end_hour=${ task.end_hour },
        end_minute=${ task.end_minute },
        length=${ task.length },
        offset=${ task.offset },
        title="${ task.title }",
        description="${ task.description }",
        location="${ task.location }",
        importance=${ task.importance },
        daily=${ task.daily }
      WHERE
        task_id=${ task.task_id }
      ;
    `, function (error, result, fields) {
      if (error) {
        res.send({ status: 1 });
        throw error;
      };
      res.send({ status: 0 });
      connection.release();
    })
  })
})

module.exports = router;
