import * as React from 'react';

import SurveyStep from '../SurveyStep';

interface Data {
  details?: string;
}

export default class ContribDescription extends SurveyStep<{}, Data> {
  setContribDetails = e => {
    this.props.setStepData({
      details: e.target.value,
    });
  };

  nextStep = () => {
    const seenDiffStep = this.props.data['diff-entry'].visited;
    if (seenDiffStep) {
      this.props.changeStep('ticket-submission');
    } else {
      this.props.changeStep('diff-entry');
    }
  };

  ready = () => {
    return (
      this.props.ownData.details != null &&
      this.props.ownData.details.length > 0
    );
  };

  render() {
    return (
      <div>
        <p>We need a little more information on the change.</p>
        <div className="form-group">
          <label htmlFor="">Describe the change you're making in detail</label>
          <textarea
            className="form-control"
            onChange={this.setContribDetails}
          />
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={this.nextStep}
          disabled={!this.ready()}
        >
          Next <span className="glyphicon glyphicon-chevron-right" />
        </button>
      </div>
    );
  }
}
