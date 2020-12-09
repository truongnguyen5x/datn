import { history } from "../../../history"
import { FetchApi } from "../axios"

// const initAuth0 = new auth0.WebAuth(configAuth)
export const loginWithJWT = user => {
  return dispatch => {
    FetchApi("/api/user/signin", "POST", {
      email: user.email,
      password: user.password
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

export const logoutWithJWT = () => {
  return dispatch => {
    FetchApi("/api/user/logout", "POST")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    dispatch({ type: "LOGOUT_WITH_JWT", payload: null })
    history.push("/pages/login")
  }
}


export const changeRole = role => {
  return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
}


export const getProfile = () => dispatch => {
  const refreshToken = localStorage.getItem('refreshToken')
  FetchApi("/api/user/me", "POST", { refreshToken })
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
      } else {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        console.log('from get me')
        history.push("/pages/login")
      }
    })
}