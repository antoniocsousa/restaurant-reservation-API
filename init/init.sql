CREATE TABLE tables (
  id SERIAL PRIMARY KEY,
  seats INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  table_id INTEGER NOT NULL REFERENCES tables(id),
  costumer_name VARCHAR(255) NOT NULL,
  date_time TIMESTAMP NOT NULL
);

INSERT INTO tables (seats, active) 
VALUES  (4, true),
        (4, true),
        (6, true),
        (2, true);
