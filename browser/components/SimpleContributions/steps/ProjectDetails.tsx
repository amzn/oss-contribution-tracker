import * as React from 'react';

import SurveyStep from '../SurveyStep';

interface Data {
  name: string;
  website: string;
  license: string;
  cla: string;
}

export default class ProjectDetails extends SurveyStep<{}, Data> {
  setDetail = (field: keyof Data) => e => {
    this.props.setStepData({
      ...this.props.ownData,
      [field]: e.target.value,
    });
  };

  ready = () => {
    return (
      this.props.ownData.name != null &&
      this.props.ownData.name.length > 0 &&
      this.props.ownData.website != null &&
      this.props.ownData.website.length > 0 &&
      this.props.ownData.license != null &&
      this.props.ownData.license.length > 0
    );
  };

  render() {
    return (
      <div>
        <div className="form-group">
          <label>Project Name</label>
          <input
            type="text"
            className="form-control"
            onChange={this.setDetail('name')}
          />
        </div>
        <div className="form-group">
          <label>Website</label>
          <input
            type="text"
            className="form-control"
            onChange={this.setDetail('website')}
          />
        </div>
        <div className="form-group">
          <label>License</label>
          <input
            type="text"
            className="form-control"
            onChange={this.setDetail('license')}
          />
        </div>
        <div className="form-group">
          <label>
            Does the project require you to sign any agreements? Provide links
            if able.
          </label>
          <input
            type="text"
            className="form-control"
            onChange={this.setDetail('cla')}
          />
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => this.props.changeStep('contrib-description')}
          disabled={!this.ready()}
        >
          Next <span className="glyphicon glyphicon-chevron-right" />
        </button>
      </div>
    );
  }
}
