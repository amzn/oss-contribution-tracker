import * as React from 'react';

import { postJSON } from '../../../util/index';
import SurveyStep from '../SurveyStep';

interface State {
  loading: boolean;
  error: string | null;
}

export default class AutoApproved extends SurveyStep<State> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    const trail = this.props.trail;
    // last element (len-1) is this step; look for second-to-last
    if (trail[trail.length - 2] !== 'approval-router') {
      // usage of console intentional
      // tslint:disable-next-line:no-console
      console.error(
        'Reached auto-approval step before router. This is a bug!',
        trail
      );
      throw new Error('Invalid approval state');
    }
    // tslint:disable-next-line:no-floating-promises
    this.submitAutoContribution();
  }

  submitAutoContribution = async () => {
    this.setState({ loading: true, error: null });
    const data = this.props.data;
    const trail = this.props.trail;
    try {
      await postJSON('/api/contributions/new/auto', {
        projectId: data['project-picker'].project_id,
        description: data['contrib-type'].description,
        meta: {
          data,
          trail,
        },
      });
    } catch (err) {
      this.setState({
        error: err.message,
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    if (this.state.loading) {
      return (
        <div>
          <h3>Submitting, please wait...</h3>
        </div>
      );
    }

    if (this.state.error) {
      return (
        <div>
          There was a problem submitting your contribution:
          <p>{this.state.error}</p>
          <button
            className="btn btn-secondary"
            onClick={this.submitAutoContribution}
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div>
        <p>
          Your contribution falls within auto-approvable policies. It has been
          logged as a pending contribution. Submit your contribution to the
          upstream project, then return here to update it:
        </p>
        <p>
          <a href="/contribute/link">Manage pending contributions</a>
        </p>
        <p>Thank you for contributing to open source!</p>
      </div>
    );
  }
}
