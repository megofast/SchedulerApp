import axios from "axios";
import axiosInstance from "./axiosInstance";
import jwtDecode from "jwt-decode";
import moment from "moment";
import { Variables } from "./Variables";
import { updateFromRefreshToken, updateRefreshing } from "../Redux/LoginSlice";

let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach( promise => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve(token);
        }
    })
}

const setupInterceptors = (store) => {
    axiosInstance.interceptors.request.use(async (request) => {
        // Set the authorization header to include the token
        request.headers["Authorization"] = `Bearer ${store.getState().loginReducer.token}`;

        const tokenInfo = jwtDecode(store.getState().loginReducer.token);
        const isExpired = moment().isSameOrAfter(moment.unix(tokenInfo.exp));
        

        if (!isExpired) return request;     // Return the request because the token is still valid

        // The token is expired, request new access token using refresh token
        
        if (store.getState().loginReducer.refreshing === false) {
            // Set the status to refreshing so no other data request can initiate token request
            store.dispatch(updateRefreshing(true));

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

            // Now that the refresh token has been processed, work the queue
            processQueue(null, response.data.accessToken);

            // Set the headers for this request to the new access token
            request.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
            return request;
        } else {
            // Token is refreshing currently, return a promise instead of the request
            return new Promise( (resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then( (token) => {
                request.headers["Authorization"] = `Bearer ${token}`;
                return request;
            }).catch( error => error);
        }
        
    });

    axiosInstance.interceptors.response.use( (response) => {
            return response;
        }, (error) => {
            return Promise.reject(error);
        }
    );
}

export default setupInterceptors;