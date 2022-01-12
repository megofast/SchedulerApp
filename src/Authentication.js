import axios from 'axios';

export const userAuth = {
    isAuthenticated: false,
    token: "",
    authenticate(username, password) {
        // send the username and password combination to the API for verification, if success a token will be returned

        // Create the Json payload from the username and password
        let userLoginDetails = JSON.stringify({
            username: username,
            password: password,
        });

        axios.post('https://localhost:44307/api/login', userLoginDetails, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            // Success
            console.log(this.isAuthenticated);
            this.token = response.data;
            this.isAuthenticated = true;
        })
        .catch(error => {
            // Failed
            //this.isAuthenticated = false;
            if (error.response) {
                console.log(error.response.data);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("error setting up API call.");
            }
        });
        
    },
    signout() {
        this.isAuthenticated = false;
        //setTimeout(callback, 100);
    }
}