import React, { useEffect, createContext, useReducer, useContext } from 'react'
import { BrowserRouter, Route, Switch,useHistory } from 'react-router-dom'
import NavBar from './components/NavBar'
import Profile from './components/screen/Profile'
import UserProfile from './components/screen/UserProfile'
import Signin from './components/screen/Signin'
import Home from './components/screen/Home'
import Signup from './components/screen/Signup'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {reducer, initialState} from './components/reducers/userReducer'
export const UserContext = createContext()
const useStyles = makeStyles({
  gridConatiner: {
    paddingLeft: '20px',
    paddingRight: '20px'
  }
})




const Routing = () => {
  const classes = useStyles();
  const History = useHistory()
  const {state , dispatch} = useContext(UserContext)

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    console.log(typeof(user),user)
    if (user) {
      dispatch({type:"USER",payload:user})
    } else {
      History.push("/Signin")
    }
  },[])
  
  return (
    <Switch>
      <Route path="/Signin"><Signin /></Route>
      <Route path="/Signup"><Signup /></Route>
      <Route path="/Home">
        <Grid container spacing={4} classes={classes.gridConatiner} justify="center"><Home /></Grid>
      </Route>
      <Route exact  path="/"><Profile /></Route>
      <Route exact path="/Profile"><Profile /></Route>
      <Route path="/Profile/:userid"><UserProfile/></Route>
      <Route render={() => <center><h1>Page not found</h1></center>} />
     
    </Switch>
  )
}



function App() {
const [state,dispatch] =useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <NavBar />
      <Routing />
    </BrowserRouter>
    </UserContext.Provider>

  );
}

export default App;
