CREATE TABLE users (
  company_alias TEXT PRIMARY KEY NOT NULL,
  github_alias TEXT NOT NULL,
  groups JSONB
);
