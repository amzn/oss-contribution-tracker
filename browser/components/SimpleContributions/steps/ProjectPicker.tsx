import * as React from 'react';

import { reqJSON } from '../../../util/index';
import SurveyStep from '../SurveyStep';

interface State {
  projects: any[];
}

interface Data {
  project_id: string;
  metadata: any;
}

export default class ProjectPicker extends SurveyStep<State, Data> {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    };
  }

  componentWillMount() {
    // tslint:disable-next-line:no-floating-promises
    this.fetchProjects();
  }

  fetchProjects = async () => {
    const projectData = await reqJSON('/api/projects');
    let projects = projectData.projectList.filter(project => {
      return project.project_auto_approvable;
    });
    projects = projects.sort(function compare(a, b) {
      // Use toUpperCase() to ignore character casing
      const nameA = a.project_name.toUpperCase();
      const nameB = b.project_name.toUpperCase();
      let comparison = 0;
      if (nameA > nameB) {
        comparison = 1;
      } else if (nameA < nameB) {
        comparison = -1;
      }
      return comparison;
    });
    this.setState({ projects });
  };

  selectProject = e => {
    const projectId = parseInt(e.target.value, 10);
    this.props.setStepData({
      ...this.props.ownData,
      project_id: e.target.value,
      metadata: this.state.projects.find(p => p.project_id === projectId),
    });
  };

  ready = () => {
    return (
      this.props.ownData.project_id != null &&
      this.props.ownData.project_id.length > 0
    );
  };

  render() {
    return (
      <div>
        <div className="form-group">
          <label htmlFor="">Select the project you want to contribute to</label>
          <select
            name="project"
            className="form-control"
            onChange={this.selectProject}
          >
            <option value="" />
            {this.state.projects.map(proj => (
              <option value={proj.project_id} key={proj.project_id}>
                {proj.project_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <button
            className="btn btn-outline-dark"
            onClick={() => this.props.changeStep('project-details')}
          >
            The project isn't listed here
          </button>
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => this.props.changeStep('contrib-type')}
          disabled={!this.ready()}
        >
          Next <span className="glyphicon glyphicon-chevron-right" />
        </button>
      </div>
    );
  }
}
