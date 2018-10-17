import * as React from 'react';

import SurveyStep from '../SurveyStep';

import { config } from '../../../../server/config';

export default class AutoApproved extends SurveyStep<{}> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.canAutoApprove()) {
      this.props.changeStep('auto-approved');
    } else {
      this.props.changeStep('ticket-submission');
    }
  }

  /**
   * Some of this logic is duplicated from other sections; this is
   * intentional. It's a final sanity check to make sure we don't
   * auto-approve something that shouldn't have been.
   */
  canAutoApprove = (): boolean => {
    const { data } = this.props;

    // check that a project was selected
    if (!data['project-picker'].project_id) {
      return false;
    }

    // this should never happen, but verify that nothing was entered on the
    // "not listed" page after the picker
    if (data['project-details'].name) {
      return false;
    }

    // check the contribution type
    if (!config.contributions.autoApprove.allowedTypes.includes(data['contrib-type'].type)) {
      return false;
    }

    // ensure no additional information was entered; that's a sign that
    // something tripped up earlier
    if (data['contrib-description'].details) {
      return false;
    }

    // check that diff got validated
    if (!data['diff-entry'].simple) {
      return false;
    }

    return true;
  }

  render() {
    return <p>Verifying your submission...</p>;
  }

}
