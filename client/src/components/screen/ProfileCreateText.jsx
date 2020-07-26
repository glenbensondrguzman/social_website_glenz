import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import React, { useState, useEffect } from 'react'
import SendIcon from '@material-ui/icons/Send'
import { useHistory } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import Box from '@material-ui/core/Box'
import { ToastContainer, toast } from 'react-toastify'
import LinearProgress from '@material-ui/core/LinearProgress'
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '75ch',
    },
  },
}));

const ProfileCreateText = () => {
  const classes = useStyles()
  const history = useHistory()
  const [content, setContent] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false)
  const [disableProgress, setDisableProgress] = useState(true)
  useEffect(() => {
    if (url) {
      fetch("/api/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          content,
          pic: url
        })
      }).then(res => res.json())
        .then(data => {
          if (data.error) {
            console.log(data)
            setDisableSubmitBtn(false)
            toast.error("Fill in all the fields!")
          } else {
            toast.success("Successfully Posted!")
            setDisableSubmitBtn(false)
            setDisableProgress(true)
            // history.push("/Home")
            window.location.reload()
            console.log(data)

          }
        }).catch(error => {
          console.log(error)
          
        })
    }
    // eslint-disable-next-line
  }, [url])


  const PostDetails = () => {
    const data = new FormData()
     setDisableSubmitBtn(true)
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
         if(!data.url){
          setDisableSubmitBtn(false)
          setDisableProgress(true)
          toast.error("You need to add picture")
         }
       setUrl(data.url)
          //gettheData tapon sa useeffect
        
      })
      .catch(error => {
        setDisableSubmitBtn(false)
        setDisableProgress(true)
        toast.error("Cannot Upload File! Please Check your data Connection")
        console.log(error)
      })
  }



  return (
    <div className={classes.root} noValidate autoComplete="off">
      <TextField
        id="standard-secondary"
        label="What's on Your Mind!"
        color="secondary"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <ToastContainer autoClose={3000} />
      <input accept="image/*"
        type="file"
        id="icon-button-file"
        onChange={(e) => setImage(e.target.files[0])} />

      <LinearProgress  hidden={disableProgress} />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={() => PostDetails()}
        // disabled={props.settings.formSubmited || disableSubmitBtn}
        disabled={disableSubmitBtn}
      >
        <SendIcon /> Post</Button>
        <Box borderTop={1}   />
    </div>
  );
}
export default ProfileCreateText;