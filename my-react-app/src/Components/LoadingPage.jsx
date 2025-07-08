import {Spinner} from 'react-bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css';


export function LoadingPage(){
    // console.log('loading')
    return (
        // <Spinner></Spinner>
        <div>
            <Spinner animation="border" role="status" style={{width: '40vh', height: '40vh'}}>
             <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
        // <Spinner animation="grow" />
        // <h1>Loading...</h1>
    );
}