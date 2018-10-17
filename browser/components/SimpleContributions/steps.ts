import Agreement from './steps/Agreement';
import ApprovalRouter from './steps/ApprovalRouter';
import AutoApproved from './steps/AutoApproved';
import ContribDescription from './steps/ContribDescription';
import ContribType from './steps/ContribType';
import DiffEntry from './steps/DiffEntry';
import ProjectDetails from './steps/ProjectDetails';
import ProjectPicker from './steps/ProjectPicker';
import TicketSubmission from './steps/TicketSubmission';


export const steps = {
  'agreement': Agreement,
  'project-picker': ProjectPicker,
  'project-details': ProjectDetails,
  'contrib-type': ContribType,
  'contrib-description': ContribDescription,
  'diff-entry': DiffEntry,
  'approval-router': ApprovalRouter,
  'auto-approved': AutoApproved,
  'ticket-submission': TicketSubmission,
};

export type StepName = keyof typeof steps;
