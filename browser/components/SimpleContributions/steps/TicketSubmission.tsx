import * as React from 'react';

import { Link } from 'react-router-dom';
import ExtensionPoint from '../../../util/ExtensionPoint';
import SurveyStep from '../SurveyStep';

export default class TicketSubmission extends SurveyStep<{}> {
  render() {
    return (
      <div>
        <ExtensionPoint ext="simple-contrib-auto-approve-deny">
          <p>
            Your change was not able to be automatically approved. You must
            follow the regular <Link to="/contribute">Log Contribution </Link>
            process.
          </p>
        </ExtensionPoint>
      </div>
    );
  }
}
