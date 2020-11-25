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
          loggedInUser = response.data.data.user
          localStorage.setItem("token", response.data.data.accessToken)
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
    localStorage.removeItem("token")
    dispatch({ type: "LOGOUT_WITH_JWT", payload: null })
    history.push("/pages/login")
  }
}


export const changeRole = role => {
  return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
}


export const getProfile = () => dispatch => {
  const token = localStorage.getItem('token')
  if (!token) {
    console.log('no token')
  } else {
    axios.get("/api/user/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => console.log(res.data))
  }
}