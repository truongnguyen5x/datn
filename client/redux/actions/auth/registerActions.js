
import { history } from "../../../history"
import { FetchApi } from "../axios"

export const signupWithJWT = (email, password, name) => {
  return dispatch => {
    FetchApi("/api/user/signup", 'POST', {
        email: email,
        password: password,
        name: name
      })
      .then(response => {
        var loggedInUser
        if (response.code) {
          loggedInUser = response.data.user
          localStorage.setItem("accessToken", response.data.accessToken)
          localStorage.setItem("refreshToken", response.data.user.refresh_token)
          dispatch({
            type: "LOGIN_WITH_JWT",
            payload: { loggedInUser, loggedInWith: "jwt" }
          })
          const userRole = response.data.user.role == 0 ? "admin" : "editor"
          dispatch({ type: "CHANGE_ROLE", userRole })
          history.push("/")
        }
      })
      .catch(err => console.log(err))

  }
}
