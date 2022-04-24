import axios from "axios";
import axiosInstance from "./axiosInstance";
import jwtDecode from "jwt-decode";
import moment from "moment";
import { Variables } from "./Variables";
import { updateFromRefreshToken } from "../Redux/LoginSlice";

const setupInterceptors = (store) => {
    axiosInstance.interceptors.request.use(async (request) => {
        // Set the authorization header to include the token
        request.headers["Authorization"] = `Bearer ${store.getState().loginReducer.token}`;

        const tokenInfo = jwtDecode(store.getState().loginReducer.token);
        const isExpired = moment().isSameOrAfter(moment.unix(tokenInfo.exp));
        

        if (!isExpired) return request;     // Return the request because the token is still valid

        // The token is expired, request new access token using refresh token
        let tokenInformation = JSON.stringify({
            accessToken: store.getState().loginReducer.token,
            refreshToken: store.getState().loginReducer.refreshToken,
        });
        
        const response = await axios.post(`${Variables.API_URL}login/refreshtoken`, tokenInformation,
            {
            headers: {
                'Content-Type': 'application/json'
            }});
        
        // New token information is contained in response, dispatch action to login reducer
        store.dispatch(updateFromRefreshToken(response));

        // Set the headers for this request to the new access token
        request.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
        return request;
    });

    axiosInstance.interceptors.response.use( (response) => {
            return response;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
}

export default setupInterceptors;