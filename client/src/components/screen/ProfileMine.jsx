import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React, { useEffect, useContext, useState } from 'react'
import { UserContext } from '../../App'
import Box from '@material-ui/core/Box'
import Avatar from '@material-ui/core/Avatar'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import LinearProgress from '@material-ui/core/LinearProgress'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    position: "z-index",
    top: 0
  },
  

  gridList: {
    width: 500,
    height: 450,
  },
  buttons: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 20,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 30,
    padding: '0 30px',
  },
  media: {
    height: "300px",
    width: "350px",
    objectFit: "contain",
    display: "block"
  },
})




const ProfileMine = () => {
  const classes = useStyles()
  const [image, setImage] = useState("")
  const [data, setData] = useState([])
  const [disableProgress, setDisableProgress] = useState(true)

  console.log(data)
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    fetch('/api/mypost', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        // console.log(result)
        setData(result.mypost)
      })
  }, [])




  useEffect(() => {
    if (image) {
      const data = new FormData()
      setDisableProgress(false)
      data.append("file", image)
      data.append("upload_preset", "social_website_glenz")
      data.append("cloud_name", "glenbenson")
      fetch("https://api.cloudinary.com/v1_1/glenbenson/image/upload", {
        method: "post",
        body: data
      })
        .then(res => res.json())
        .then(data => {


          fetch('/api/updatepic', {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
              pic: data.url
            })
          }).then(res => res.json())
            .then(result => {
              console.log(result)
              setDisableProgress(true)
              localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
              dispatch({ type: "UPDATEPIC", payload: result.pic })
              //window.location.reload()
              toast.success("Successfully Changed Profile!")
            })

        })
        .catch(err => {
          console.log(err)
          setDisableProgress(true)
          toast.error("Check Your Data Connection and retry!")
        })
    }
  }, [image])
  const updatePhoto = (file) => {
    setImage(file)
  }





  return (
    <Card className={classes.root}>
      <CardActionArea style={{ backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <center><Avatar style={{ width: (250), height: (250), marginTop: (5) }} alt="Remy Sharp" src={state?state.pic:<h2>Loading...</h2>} /></center>
        <CardContent>
        <LinearProgress  hidden={disableProgress} />
          <Typography gutterBottom variant="h5" component="h2">
            {state ? state.firstname : "loading"} {state ? state.lastname : "loading"}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
         

      <input 
       accept="image/*"
       style={{display:"none"}}
       id="contained-button-file"
       multiple
      type="file" 
      onChange={(e)=>updatePhoto(e.target.files[0])} />
         <label htmlFor="contained-button-file">
        <Button className={classes.buttons} variant="contained" color="primary" component="span">
          Update Profile Picture
        </Button>
      </label>
          </Typography>
        </CardContent>
      </CardActionArea>
      <Box borderTop={2} />
      <CardActions>
        <Button size="small" color="primary">
          {/* {data.length} Post */}
      </Button>
        <Button size="small" color="primary">
          {/* {state ? state.followers.length : "0"} followers */}
      </Button>
        <Button size="small" color="primary">
          {/* {state ? state.following.length : "0"} following */}
      </Button>
      </CardActions>
      <h7>Photo Uploaded</h7>
      <>
        <GridList cellHeight={100} className={classes.gridList} cols={1.5}>
          {

            data.map(item => {
              return (

                <GridListTile>
                  <img src={item ? item.pic : "loading"} alt={item ? item.content : "loading"} />
                </GridListTile>

              )
            })
          }
        </GridList>
      </>


    </Card>
  )
}
export default ProfileMine