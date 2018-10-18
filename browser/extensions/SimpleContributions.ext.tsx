import * as React from 'react';
import { Link, Route } from 'react-router-dom';

import { register } from '../ext';

import SimpleContribWizard from '../components/SimpleContributions/SimpleContribWizard';

register('routes-additional', ({ user }) => {
  return (
    <Route
      exact={true}
      path="/contribute/intake"
      component={SimpleContribWizard}
    />
  );
});

register('navbar-contribution', ({ user }) => {
  if (!user.roles.includes('auto-approve')) {
    return null;
  }

  return (
    <Link to="/contribute/intake" className="nav-link">
      Submit New Contribution
    </Link>
  );
});

register('navbar-admin-links', props => {
  return (
    <Link to="/contribute" className="nav-link">
      Log Contribution
    </Link>
  );
});
