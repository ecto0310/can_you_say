import React from 'react';
import { Jumbotron, Button, InputGroup, Col, Form } from 'react-bootstrap';
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

type PlayData = {
  play: boolean;
  startUnixTime: number;
  answerCnt: number;
  answers: GameStatus[];
};

interface playState {
  gameData: GameData;
  playData: PlayData;
  timer: number;
  timerId: NodeJS.Timeout | undefined;
  input: string;
  errorMsg: string;
};

class Play extends React.Component<playProps, playState> {
  constructor(props: playProps) {
    super(props);
    this.state = {
      gameData: {
        name: "-",
        description: "-",
        answerCnt: 0,
        answers: []
      },
      playData: {
        play: false,
        startUnixTime: 0,
        answerCnt: 0,
        answers: []
      },
      timer: 0,
      timerId: undefined,
      input: "",
      errorMsg: ""
    };
  }

  componentDidMount() {
    const url = "./data/" + this.props.match.params.id + ".json";
    Axios.get<GameData>(url).then((res) => {
      this.setState({ gameData: res.data });
    }).catch(error => {
      this.setState({ errorMsg: error.response.status });
    });
  }

  endGame() {
    clearInterval(this.state.timerId!);
    Record.set(this.props.match.params.id, this.state.timer, this.state.gameData.answerCnt - this.state.playData.answerCnt);
  }

  submit() {
    let playData = this.state.playData;
    if (this.state.playData.play) {
      playData.answers.forEach(i => { if (i.answer === this.state.input && !i.solve) { i.solve = true; i.time = Record.convertString(this.state.timer); playData.answerCnt--; } });
      this.setState({ playData: playData, input: "" });
      if (playData.answerCnt === 0) {
        this.endGame();
      }
    } else {
      playData.play = true
      playData.answers = this.state.gameData.answers;
      playData.answerCnt = this.state.gameData.answerCnt;
      playData.answers.forEach(i => { i.solve = false });
      playData.startUnixTime = Math.floor(new Date().getTime() / 10);
      let timerId = setInterval(() => { this.setState({ timer: Math.floor(new Date().getTime() / 10 - playData.startUnixTime) }) }, 10);
      this.setState({ playData: playData, timerId: timerId, input: "" });
    }
    console.log(this.state);
  }

  render() {
    return (
      <div className="play">
        <Jumbotron id="title">
          <h3>{this.state.gameData.name}</h3>
          <div>
            {this.state.gameData.description}<br />
            有効回答数: {this.state.gameData.answerCnt}<br />
            自己ベスト: {Record.get(this.props.match.params.id)}<br />
          </div>
        </Jumbotron>
        <ErrorMsg msg={this.state.errorMsg} />
        <Form>
          <Form.Row className="align-items-center">
            <Col xs="auto">
              <Form.Control
                type="text"
                id="timer"
                value={Record.convertString(this.state.timer)}
                disabled={true}
              />
            </Col>
            <Col xs="auto">
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>残り</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="text"
                  id="solve-count"
                  value={this.state.playData.answerCnt}
                  disabled={true}
                />
              </InputGroup>
            </Col>
            <Col xs="auto">
              <Form.Control
                type="text"
                value={this.state.input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { this.setState({ input: e.target.value }) }}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") this.submit() }}
              />
            </Col>
            <Col xs="auto">
              <Button type="button" variant="success" onClick={() => this.submit()}>
                回答
              </Button>
            </Col>
            <Col xs="auto">
              <Button type="button" variant="danger" onClick={() => this.endGame()}>
                降参
              </Button>
            </Col>
          </Form.Row>
        </Form>
      </div>
    );
  }
}

export default Play;
