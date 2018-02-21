CREATE TABLE approvers (
  approver_id SERIAL PRIMARY KEY NOT NULL,
  approver_alias TEXT NOT NULL,
  approver_active BOOLEAN NOT NULL
);
-- insert an auto-approver user if it did not already exist
INSERT INTO approvers (approver_alias, approver_active)
  SELECT 'auto-approver', 1
  WHERE NOT EXISTS (
    SELECT approver_id FROM approvers WHERE approver_alias = 'auto-approver'
  );