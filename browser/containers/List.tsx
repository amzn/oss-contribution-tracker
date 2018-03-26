/* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
import * as React from 'react';
import { connect } from 'react-redux';
import { reqJSON } from '../util/index';

import ContributionsTable from '../components/ContributionsTable';

interface Props {
}

interface State {
  contributionList: any;
}

class List extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      contributionList: [],
    };
  }

  componentWillMount() {
    reqJSON('/api/contributions').then((temp) => {
      this.setState({contributionList: temp.contributionList});
    });
  }

  render() {
    return (
      <div id="contributionsListAll">
        <ContributionsTable contributionList={ this.state.contributionList } type="all" />
      </div>
    );
  }
}

export default connect((state) => {
  return {  };
})(List);
