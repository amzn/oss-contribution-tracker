/* Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

import GithubLink from '../components/GithubLink';

interface Props {
  dispatch: any;
}

interface State {
  user: string;
  contributionList: object;
}

class GithubLinkUpdater extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      contributionList: {},
    };
  }

  async componentWillMount() {
    await this.getData();
  }

  getData = async () => {
    const user = await reqJSON('/api/user');
    this.setState({
      user: user.user,
    });
    const clist = await reqJSON(`/api/contributions/${user.user}`);
    this.sortList(clist.contributionList);
  };

  sortList = cL => {
    const list = {};
    for (const key of Object.keys(cL)) {
      const value = cL[key];
      value.map(entry => {
        list[entry.contribution_id] = entry;
      });
    }
    this.setState({
      contributionList: list,
    });
  };

  render() {
    return (
      <GithubLink
        contributionList={this.state.contributionList}
        user={this.state.user}
      />
    );
  }
}

export default connect(state => ({}))(GithubLinkUpdater);
