import {useNavigate} from 'react-router-dom'

function Anonymous ({emulator}) {
    const navigate = useNavigate();
    return (
        <div className="anonymousUI">
            <button onClick={() => navigate('/login')}>sign in</button>
        </div>
    );

}


export default Anonymous;
