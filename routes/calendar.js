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
         AND date <= ${ parseInt(startingDate) + timeUnitMap[timeUnit] - 1 };
    `, function (error, result, fields) {
      res.send(result);
      connection.release();
    })
  })
})

// POST /calendar/add_task: response
router.post('/calendar/add_task', function(req, res, next) {
  task = req.body['task']
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
  taskId = req.body['task_id']
  task = req.body['task']
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
        task_id=${ taskId }
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
