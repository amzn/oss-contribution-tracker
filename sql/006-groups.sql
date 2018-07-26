CREATE TABLE groups (
  group_id SERIAL PRIMARY KEY NOT NULL,
  group_name TEXT NOT NULL,
  goal TEXT NOT NULL,
  sponsor TEXT NOT NULL,
  projects int[] NOT NULL
);
