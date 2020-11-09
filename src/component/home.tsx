import React from 'react';
import { Jumbotron, Button, Collapse, Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Axios from 'axios';

import ErrorMsg from '../assets/errorMsg';

import './home.scss';

interface homeProps {
}

type Theme = {
  title: string;
  answerCnt: Number;
  path: string;
};

interface homeState {
  isOpen: boolean;
  themes: Theme[];
  errorMsg: string;
}

class Home extends React.Component<homeProps, homeState> {
  constructor(props: homeProps) {
    super(props);
    this.state = {
      isOpen: false,
      themes: [],
      errorMsg: ""
    };
  }

  componentDidMount() {
    const url = "./theme.json";
    Axios.get<Theme[]>(url).then((res) => {
      this.setState({ themes: res.data });
    }).catch(error => {
      this.setState({ errorMsg: error.response.status });
    });
  }

  render() {
    return (
      <div className="home">
        <Jumbotron id="title">
          <h1>言えるかな?</h1>
          <div>
            <Button onClick={() => this.setState({ isOpen: !this.state.isOpen })} variant="primary">遊び方</Button>
            <Collapse in={this.state.isOpen}>
              <Card>
                1. 下のリストから挑戦したいお題を選択します。<br />
                2. ページに飛んで、準備が出来たら開始ボタンを押して3秒のカウントダウンの後開始します。<br />
                3. 開始したらフォームでお題の答えを出来るだけ入力します。<br />
                4. 思い浮かばなくなったら、降参ボタンで終了します。<br />
                5. 結果をツイートするボタンが出てきます<br />
              </Card>
            </Collapse>
          </div>
        </Jumbotron>
        <ErrorMsg msg={this.state.errorMsg} />
        <Table bordered id="theme-list">
          <thead>
            <tr>
              <th id="title">お題</th>
              <th id="answer-cnt">有効回答数</th>
              <th id="personal-best">自己ベスト</th>
              <th id="play"></th>
            </tr>
          </thead>
          <tbody>
            {this.state.themes.map((theme) => (
              <tr key={theme.path}>
                <td>{theme.title}</td>
                <td>{theme.answerCnt}</td>
                <td>-</td>
                <td><Link to={theme.path}>遊ぶ</Link></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Home;
