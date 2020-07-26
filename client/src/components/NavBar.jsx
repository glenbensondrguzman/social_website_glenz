import React, { useContext } from 'react'
import { UserContext } from '../App'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { Link, useHistory } from 'react-router-dom'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined'
import AccountBoxOutlinedIcon from '@material-ui/icons/AccountBoxOutlined'
import ExitToAppOutlinedIcon from '@material-ui/icons/ExitToAppOutlined'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));


const NavBar = () => {
  const classes = useStyles()
  const History = useHistory()
  const { state, dispatch } = useContext(UserContext)
  const renderList = () => {
    if (state) {
      return [
        <div className={classes.root} style={{ margin: 25 }}>
          <AppBar position="fixed" color="transparent" style={{ backgroundImage:'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', opacity: 0.9 }}>
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Social Website
            </Typography>
            <Link style={{ textDecoration: 'none' }} to="/Home"><Button variant="contained"  ><HomeOutlinedIcon />Home</Button></Link>
              <Link style={{ textDecoration: 'none' }} to="/Profile"><Button variant="contained"  ><AccountBoxOutlinedIcon />My Profile</Button></Link>
              <Link style={{ textDecoration: 'none' }} ><Button variant="contained" style={{ background: 'orange' }}
                onClick={() => {
                  toast.success("Session has been ended.")
                  localStorage.clear()
                  dispatch({ type: "CLEAR" })
                  History.push("/Signin")
                }} ><ExitToAppOutlinedIcon />Logout</Button></Link>
            </Toolbar>
          </AppBar>,
      </div>
      ]
    } else {
      return [
        // <Link style={{ textDecoration: 'none' }} to="/Signin"><Button variant="contained" color="primary" > SignIn</Button></Link>,
        // <Link style={{ textDecoration: 'none' }} to="/Signup"><Button variant="contained" color="primary" > SignUp</Button></Link>
      ]
    }
  }
  return (
    <>
      <ToastContainer />
      {renderList()}
    </>
  )
}

export default NavBar


