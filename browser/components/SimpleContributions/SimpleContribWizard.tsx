import * as React from 'react';

import { StepName, steps } from './steps';

interface State {
  step: StepName;
  trail: StepName[];
  data: {[k in StepName]: any};
}

export default class SimpleContribWizard extends React.Component<{}, State> {

  constructor(props) {
    super(props);

    const data = {};
    for (const step of Object.keys(steps)) {
      data[step] = {};
    }

    this.state = {
      step: 'agreement',
      trail: ['agreement'],
      data: data as State['data'],
    };
  }

  changeStep = (nextStep: StepName) => {
    this.setState({
      step: nextStep,
      trail: this.state.trail.concat([nextStep]),
    });
  }

  setStepData = (data: any) => {
    this.setState({
      data: {
        ...this.state.data,
        [this.state.step]: data,
      },
    });
  }

  renderStep(name: StepName) {
    const Step = steps[name];
    return <Step
      data={this.state.data}
      ownData={this.state.data[name]}
      trail={this.state.trail}
      changeStep={this.changeStep}
      setStepData={this.setStepData}
    />;
  }

  render() {
    return (
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col col-md-8 pt-3">
            {this.renderStep(this.state.step)}
          </div>
        </div>
      </div>
    );
  }

}
