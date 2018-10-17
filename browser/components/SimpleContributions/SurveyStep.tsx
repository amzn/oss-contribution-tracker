import * as React from 'react';

import { StepName } from './steps';

/* These type definitions add some additional type checks throughout each survey step.
 * Each step has its own state, but I wanted to ensure that state could be shared
 * between steps to drive the workflow. So, the step data is pushed up one level into
 * SimpleContribWizard.
 *
 * Each step extends SurveyStep (below), providing 1) a React state structure, and
 * 2) the type of its shared step data. This is composed together with Props<D>
 * to form the overall props for step components.
 */

interface Props<D> {
  data: {[k in StepName]: any};
  ownData: D;
  trail: StepName[];
  changeStep: (nextStep: StepName) => void;
  setStepData: (data: D) => void;
}

export default class SurveyStep<S, D = any> extends React.Component<Props<D>, S> {
}