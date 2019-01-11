import * as React from 'react';

import { postJSON } from '../../../util/index';
import SurveyStep from '../SurveyStep';

interface State {
  validationLoading: boolean;
  validationError: string | null;
}

interface Data {
  diff: string;
  simple: boolean;
  visited: boolean;
}

export default class DiffEntry extends SurveyStep<State, Data> {
  constructor(props) {
    super(props);
    this.state = {
      validationLoading: false,
      validationError: null,
    };
  }

  componentDidMount() {
    this.props.setStepData({
      ...this.props.ownData,
      visited: true,
    });
  }

  diffChanged = e => {
    this.props.setStepData({
      ...this.props.ownData,
      diff: e.target.value,
    });
    this.setState({
      validationError: null,
    });
  };

  diffNotReady = () => {
    const details = this.props.data['contrib-description'].details;
    if (details == null || details.length === 0) {
      this.props.changeStep('contrib-description');
    } else {
      this.props.changeStep('ticket-submission');
    }
  };

  ready = () => {
    return (
      !this.state.validationLoading &&
      this.props.ownData.diff != null &&
      this.props.ownData.diff.length > 10
    );
  };

  nextStep = async () => {
    try {
      const simple = await this.validateDiff();
      this.props.setStepData({
        ...this.props.ownData,
        simple,
      });
      this.props.changeStep('approval-router');
    } catch (error) {
      this.setState({
        validationLoading: false,
        validationError: `An error occurred while processing your diff: ${
          error.message
        }`,
      });
    }
  };

  validateDiff = async () => {
    const result = await postJSON('/api/contributions/diffcheck', {
      diff: this.props.ownData.diff,
    });
    return result.ok;
  };

  render() {
    return (
      <div>
        <div
          className={`form-group ${this.state.validationError && 'has-error'}`}
        >
          <label htmlFor="">
            Paste in a unified diff/patch of your changes
          </label>
          <textarea
            className="form-control"
            value={this.props.ownData.diff}
            onChange={this.diffChanged}
          />
          {this.state.validationError && (
            <div className="help-block">{this.state.validationError}</div>
          )}
          <div className="help-block">
            <strong>Not sure what that is?</strong> A "diff" is a list of
            changes, in code form. It includes <code>+</code> and <code>-</code>{' '}
            markers showing where code was added or removed. See below for
            information on how to generate one.
          </div>
        </div>

        <p>
          <button className="btn btn-outline-dark" onClick={this.diffNotReady}>
            I haven't written this change yet
          </button>
        </p>

        <p>
          Your diff will be evaluated based on the volume of changes it
          contains. We'll try to erase changes only involving whitespace, but
          for the best accuracy you should generate your diff excluding that up
          front:
        </p>

        <p>
          For Git: <code>git diff --ignore-all-space 'HEAD^'</code> (replace{' '}
          <code>'HEAD^'</code> with a commit hash if diffing multiple commits,
          or omit it entirely it you haven't yet made a commit)
          <br />
          Diff two files or folders: <code>diff -uwB original changed</code>
        </p>

        <button
          className="btn btn-primary btn-lg"
          onClick={this.nextStep}
          disabled={!this.ready()}
        >
          {this.state.validationLoading ? (
            <span>Please wait...</span>
          ) : (
            <span>
              Next <span className="glyphicon glyphicon-chevron-right" />
            </span>
          )}
        </button>
      </div>
    );
  }
}
