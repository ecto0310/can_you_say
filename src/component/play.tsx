import React from 'react';
import { Jumbotron, Button, InputGroup, Col, Form, Table } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { Share } from 'react-twitter-widgets'
import Axios from 'axios';

import * as Record from '../assets/record';
import ErrorMsg from '../assets/errorMsg';

import './play.scss';

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
  play: number;
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
        play: 0,
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
      this.setState({
        playData: {
          play: 0,
          startUnixTime: 0,
          answerCnt: res.data.answerCnt,
          answers: res.data.answers
        }
      });
    }).catch(error => {
      this.setState({ errorMsg: error.response.status });
    });
  }

  endGame() {
    let playData = this.state.playData;
    playData.play = 2;
    this.setState({ playData: playData });
    clearInterval(this.state.timerId!);
    Record.set(this.props.match.params.id, this.state.timer, this.state.gameData.answerCnt - this.state.playData.answerCnt);
  }

  submit() {
    let playData = this.state.playData;
    if (this.state.playData.play === 1) {
      playData.answers.forEach(i => { if (i.answer === this.state.input && !i.solve) { i.solve = true; i.time = Record.convertString(this.state.timer); playData.answerCnt--; } });
      this.setState({ playData: playData, input: "" });
      if (playData.answerCnt === 0) {
        this.endGame();
      }
    } else if (this.state.playData.play === 0) {
      playData.play = 1;
      playData.answers = this.state.gameData.answers;
      playData.answerCnt = this.state.gameData.answerCnt;
      playData.answers.forEach(i => { i.solve = false });
      playData.startUnixTime = Math.floor(new Date().getTime() / 10);
      let timerId = setInterval(() => { this.setState({ timer: Math.floor(new Date().getTime() / 10 - playData.startUnixTime) }) }, 10);
      this.setState({ playData: playData, timerId: timerId, input: "" });
    }
  }

  answerTable(): JSX.Element[] {
    return this.state.playData.answers.map((answer) => {
      if (answer.solve) {
        return (
          <tr key={answer.answer}>
            <td>{answer.answer}</td>
            <td>{answer.time}</td>
          </tr>
        );
      }
      if (this.state.playData.play === 2) {
        return (
          <tr key={answer.answer} id="wrong">
            <td>{answer.answer}</td>
            <td>{answer.time}</td>
          </tr>
        );
      }
      return (
        <tr key={answer.answer}>
          <td>-</td>
          <td>-</td>
        </tr>
      );
    });
  }

  getTweetText(): string {
    if (this.state.playData.play === 2) {
      if (this.state.playData.answerCnt === 0)
        return "あなたは" + Record.convertString(this.state.timer) + "かけて" + this.state.gameData.answerCnt + "個の" + this.state.gameData.name + "を全て言えました。";
      else
        return "あなたは" + Record.convertString(this.state.timer) + "かけて" + (this.state.gameData.answerCnt-this.state.playData.answerCnt) + "個の" + this.state.gameData.name + "を言えました。" + this.state.playData.answerCnt + "個言えませんでした。";
    }
    if (this.state.playData.play === 1) {
      return "あなたは" + this.state.gameData.name + "を全て言うのに挑戦中です。";
    }
    return this.state.gameData.name + "全て言えるかな?";
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
                {(this.state.playData.play === 0 ? "開始" : "回答")}
              </Button>
            </Col>
            <Col xs="auto">
              <Button type="button" variant="danger" onClick={() => this.endGame()}>
                降参
              </Button>
            </Col>
            <Col xs="auto">
              <Share url={window.location.href} options={{ text: this.getTweetText(), hashtags: "言えるかな" }} />
            </Col>
          </Form.Row>
        </Form>
        <Table bordered id="answer-list" size="sm">
          <thead>
            <tr>
              <th id="answer">答え</th>
              <th id="answer-time">回答時間</th>
            </tr>
          </thead>
          <tbody>
            {this.answerTable()}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Play;
