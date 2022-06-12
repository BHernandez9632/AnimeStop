import Alert from 'react-bootstrap/Alert';
//Universal function used to show error alert
export default function MessageBox(props) {
  return <Alert variant={props.variant || 'info'}>{props.children}</Alert>;
}
