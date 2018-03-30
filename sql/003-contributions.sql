CREATE TABLE contributions (
  contribution_id SERIAL PRIMARY KEY NOT NULL,
  project_id INTEGER REFERENCES projects (project_id) NOT NULL,
  contribution_description TEXT NOT NULL,
  contribution_date DATE,
  contributor_alias TEXT NOT NULL,
  contribution_github_status TEXT,
  contribution_url TEXT,
  approver_id INTEGER REFERENCES approvers (approver_id) NOT NULL,
  approval_status TEXT NOT NULL,
  approval_notes TEXT,
  approval_date DATE,
  contribution_submission_date TIMESTAMP NOT NULL,
  contribution_closed_date TIMESTAMP,
  contribution_project_review BOOLEAN NOT NULL,
  contribution_metadata JSONB
);