import React from 'react';
import { Jumbotron, Button, Collapse, Card } from 'react-bootstrap';

interface homeProps {
}

interface homeState {
  isOpen: boolean;
}

class Home extends React.Component<homeProps, homeState> {
  constructor(props: homeProps) {
    super(props);
    this.state = {
      isOpen: false
    }
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
      </div>
    );
  }
}

export default Home;
