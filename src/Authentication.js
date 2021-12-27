export const fakeAuth = {
    isAuthenticated: false,
    authenticate() {
        this.isAuthenticated = true;
        //setTimeout(callback, 100);
    },
    signout() {
        this.isAuthenticated = false;
        //setTimeout(callback, 100);
    }
}