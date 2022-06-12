import Spinner from 'react-bootstrap/Spinner';
//Loadingbox used to make a global loading spinner whenever wanted
export default function LoadingBox() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Page Loading</span>
    </Spinner>
  );
}
