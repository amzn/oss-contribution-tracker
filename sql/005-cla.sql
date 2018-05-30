CREATE TABLE cla(
  project_id SERIAL NOT NULL,
  project_name TEXT NOT NULL,
  signatory_name TEXT NOT NULL,
  approver_name TEXT NOT NULL, 
  contact_name  TEXT NOT NULL, 
  date_signed DATE, 
  date_approved DATE,
  ticket_link TEXT, 
  contributor_name TEXT NOT NULL,
  additional_notes TEXT NOT NULL,
  external_view_link TEXT
);