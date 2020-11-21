import React from 'react';
import { Alert } from 'react-bootstrap';

interface errorMsgProps {
  msg: string;
}

class ErrorMsg extends React.Component<errorMsgProps> {
  render() {
    if (this.props.msg !== "")
      return (
        <div className="error">
          <Alert variant="danger">
            読み込みに失敗しました。再読み込みしてください。({this.props.msg})
          </Alert>
        </div>
      );
    return (
      <div className="error">
      </div>
    );
  }
}

export default ErrorMsg;
