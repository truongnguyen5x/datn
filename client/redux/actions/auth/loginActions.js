import { history } from "../../../history"
import axios from "axios"


// const initAuth0 = new auth0.WebAuth(configAuth)
export const loginWithJWT = user => {
  return dispatch => {
    axios
      .post("/api/user/signin", {
        email: user.email,
        password: user.password
      })
      .then(response => {
        var loggedInUser
        if (response.data) {
          loggedInUser = response.data.user
          localStorage.setItem("accessToken", response.data.accessToken)
          localStorage.setItem("refreshToken", response.data.user.refresh_token)
          dispatch({
            type: "LOGIN_WITH_JWT",
            payload: { loggedInUser, loggedInWith: "jwt" }
          })

          history.push("/")
        }
      })
      .catch(err => console.log(err))
  }
}

export const logoutWithJWT = () => {
  return dispatch => {
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
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  if (!accessToken) {
    console.log('no token')
  } else {
    axios.post("/api/user/me", { refreshToken }, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(response => {
        var loggedInUser
        if (response.data) {
          loggedInUser = response.data.user
          localStorage.setItem("accessToken", response.data.accessToken)
          localStorage.setItem("refreshToken", response.data.user.refresh_token)
          dispatch({
            type: "LOGIN_WITH_JWT",
            payload: { loggedInUser, loggedInWith: "jwt" }
          })
        }
      })
      .catch(error => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        history.push("/pages/login")
      })
  }
}