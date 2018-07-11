CREATE TABLE users (
  amazon_alias TEXT PRIMARY KEY NOT NULL,
  github_alias TEXT NOT NULL,
  groups JSONB
);
