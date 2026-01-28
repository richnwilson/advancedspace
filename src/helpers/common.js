import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";

const common = {
    displayMessage: (level, Msg) => {
        let msg = '';
        switch (true) {
            case /.*Firebase.*auth\/too-many-requests.*/.test(Msg):
                msg = 'Error 403. Too many authentication requests';
                break;            
            case /.*Firebase.*auth.*/.test(Msg):
                msg = 'Error 400. Authentication error';
                break;
            default:
                msg = Msg
                break;

        }
        return toast[level](msg);
    },
    decodeToken: (token) => {
        const { exp } = jwtDecode(token)
        return exp * 1000 >= Date.now();
    }  
}
export default common;