import React from 'react';
import { Jumbotron } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import Axios from 'axios';

import * as Record from '../assets/record';
import ErrorMsg from '../assets/errorMsg';

type playProps = {} & RouteComponentProps<{ id: string }>;

type GameStatus = {
  answer: string;
  solve: boolean | undefined;
  time: string | undefined;
};

type GameData = {
  name: string;
  description: string;
  answerCnt: number;
  answers: GameStatus[];
};

interface playState {
  gamaData: GameData;
  errorMsg: string;
};

class Play extends React.Component<playProps, playState> {
  constructor(props: playProps) {
    super(props);
    this.state = {
      gamaData: { name: "-", description: "-", answerCnt: 0, answers: [] },
      errorMsg: ""
    };
  }

  componentDidMount() {
    const url = "./data/" + this.props.match.params.id + ".json";
    Axios.get<GameData>(url).then((res) => {
      this.setState({ gamaData: res.data });
    }).catch(error => {
      this.setState({ errorMsg: error.response.status });
    });
  }

  render() {
    return (
      <div className="play">
        <Jumbotron id="title">
          <h3>{this.state.gamaData.name}</h3>
          <div>
            {this.state.gamaData.description}<br />
            有効回答数: {this.state.gamaData.answerCnt}<br />
            自己ベスト: {Record.get(this.props.match.params.id)}<br />
          </div>
        </Jumbotron>
        <ErrorMsg msg={this.state.errorMsg} />
      </div>
    );
  }
}

export default Play;
