import * as React from 'react';

import ExtensionPoint from '../../../util/ExtensionPoint';
import SurveyStep from '../SurveyStep';

interface State {
  ready: boolean;
}

export default class Agreement extends SurveyStep<State> {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ ready: true });
    }, 1 * 1000);
  }

  render() {
    return (
      <div>
        <ExtensionPoint ext="simple-contrib-landing-dialog">
          <h2>Simple Contribution Process</h2>
          <p className="lead text-justify">
            This quick process will evaluate the open source contribution you
            wish to make. If it doesn't fit within our automatic-approval
            guidelines, it will be submitted for manual review.
          </p>
          <p className="lead text-justify">
            <strong>
              Deliberately falsifying survey responses or trying to "game" the
              system for automatic approval may result in disciplinary action.
            </strong>{' '}
            Be honest; if your contribution isn't auto-approved it doesn't mean
            that it <em>can't</em> be approved.
          </p>
          <p className="lead text-justify">
            This should not be seem as legal advice or a binding contract.
          </p>
        </ExtensionPoint>
        <ul>
          <ExtensionPoint ext="simple-contrib-landing-extra" />
        </ul>
        <br />
        <br />
        <button
          className="btn btn-primary btn-lg"
          onClick={() => this.props.changeStep('project-picker')}
          disabled={!this.state.ready}
        >
          <span className="glyphicon glyphicon-check" />{' '}
          {this.state.ready ? 'I Agree' : 'Wait...'}
        </button>
      </div>
    );
  }
}
