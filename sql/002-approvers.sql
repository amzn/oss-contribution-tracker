CREATE TABLE approvers (
  approver_id SERIAL PRIMARY KEY NOT NULL,
  approver_alias TEXT NOT NULL,
  approver_active BOOLEAN NOT NULL
);