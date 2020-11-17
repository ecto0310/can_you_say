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
        <Form>
          <Form.Row className="align-items-center">
            <Col xs="auto">
              <Form.Control
                type="text"
                id="timer"
                value="00:00.0"
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
                  value="000"
                  disabled={true}
                />
              </InputGroup>
            </Col>
            <Col xs="auto">
              <Form.Control
                type="text"
              />
            </Col>
            <Col xs="auto">
              <Button type="button" variant="success">
                回答
              </Button>
            </Col>
            <Col xs="auto">
              <Button type="button" variant="danger">
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
