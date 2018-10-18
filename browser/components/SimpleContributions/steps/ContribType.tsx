import * as React from 'react';

import SurveyStep from '../SurveyStep';

type TypeName = 'bugfix' | 'feature' | 'doc' | 'config' | 'test' | 'other';

interface Data {
  type: TypeName;
  description: string;
}

export default class ContribType extends SurveyStep<{}, Data> {
  setDescription = e => {
    this.props.setStepData({
      ...this.props.ownData,
      description: e.target.value,
    });
  };

  setType = (type: TypeName) => {
    this.props.setStepData({
      ...this.props.ownData,
      type,
    });
  };

  nextStep = () => {
    if (
      this.props.ownData.type === 'feature' ||
      this.props.ownData.type === 'other'
    ) {
      this.props.changeStep('contrib-description');
    } else {
      this.props.changeStep('diff-entry');
    }
  };

  ready = () => {
    return (
      this.props.ownData.description != null &&
      this.props.ownData.description.length > 0 &&
      this.props.ownData.type != null
    );
  };

  render() {
    const type = this.props.ownData.type;
    return (
      <div>
        <div className="form-group">
          <label htmlFor="">
            Enter a short description of your contribution
          </label>
          <input
            type="text"
            className="form-control"
            onChange={this.setDescription}
          />
        </div>
        <p>
          <strong>
            Select a category that best describes your contribution
          </strong>
        </p>
        <div className="mb-3">
          <button
            className={`btn btn-secondary btn-lg btn-block ${type ===
              'bugfix' && 'active'}`}
            onClick={() => this.setType('bugfix')}
          >
            Bug fix
          </button>
          <button
            className={`btn btn-secondary btn-lg btn-block ${type ===
              'feature' && 'active'}`}
            onClick={() => this.setType('feature')}
          >
            New feature
          </button>
          <button
            className={`btn btn-secondary btn-lg btn-block ${type === 'doc' &&
              'active'}`}
            onClick={() => this.setType('doc')}
          >
            Documentation changes for existing features
          </button>
          <button
            className={`btn btn-secondary btn-lg btn-block ${type ===
              'config' && 'active'}`}
            onClick={() => this.setType('config')}
          >
            Configuration changes
          </button>
          <button
            className={`btn btn-secondary btn-lg btn-block ${type === 'test' &&
              'active'}`}
            onClick={() => this.setType('test')}
          >
            Test additions and changes
          </button>
          <button
            className={`btn btn-secondary btn-lg btn-block ${type === 'other' &&
              'active'}`}
            onClick={() => this.setType('other')}
          >
            Something else
          </button>
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
