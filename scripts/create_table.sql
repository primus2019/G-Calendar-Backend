CREATE TABLE tasks (
  task_id INT NOT NULL AUTO_INCREMENT,
  date VARCHAR(10) NOT NULL,
  start_hour INT NOT NULL,
  start_minute INT NOT NULL,
  end_hour INT NOT NULL,
  end_minute INT NOT NULL,
  length FLOAT NOT NULL,
  offset FLOAT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description VARCHAR(200),
  location VARCHAR(200),
  importance INT NOT NULL,
  daily INT NOT NULL,
  PRIMARY KEY ( task_id )
);
