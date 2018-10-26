import * as React from 'react';

interface Props extends React.Props<any> {
  diff: any;
}

interface State extends React.Props<any> {}

export default class DiffDiv extends React.Component<Props, State> {
  getLineAsListItem = line => {
    if (line.charAt(0) === '+' && line.charAt(1) !== '+') {
      return <li className="diff-green">{line}</li>;
    } else if (line.charAt(0) === '-' && line.charAt(1) !== '-') {
      return <li className="diff-red">{line}</li>;
    } else {
      return <li className="diff-grey">{line}</li>;
    }
  };

  render() {
    if (this.props.diff !== null) {
      return (
        <div className="diff-container">
          <ul className="ul-nopadding">
            {this.props.diff.map(line => this.getLineAsListItem(line))}
          </ul>
        </div>
      );
    } else {
      return (
        <div className="diff-container">
          <h4>Please provide the diff file to proceed to the next step</h4>
        </div>
      );
    }
  }
}
