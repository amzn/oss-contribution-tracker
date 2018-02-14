CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY NOT NULL,
  project_name TEXT NOT NULL,
  project_url TEXT,
  project_license TEXT,
  project_verified BOOLEAN NOT NULL,
  project_auto_approvable BOOLEAN NOT NULL DEFAULT false
);