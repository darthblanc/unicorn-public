import ErrorUI from "./ErrorUI";
// import {Spinner} from 'react-bootstrap'

export function ErrorPage (){
    return (
        <div>
            <ErrorUI></ErrorUI>
            {/* <Spinner></Spinner> */}
            <h1>Error 404: Page does not exist/Access Denied</h1>
        </div>
    );
}