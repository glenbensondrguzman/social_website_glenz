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
import { useParams,useHistory  } from 'react-router-dom'
import Box from '@material-ui/core/Box'
import Avatar from '@material-ui/core/Avatar'

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  buttons: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 20,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 25,
    padding: '0 20px',
  },

  media: {
    height: "200px",
    width: "500px",
    paddingTop: "3px",
  },
});



const UserProfileMine = () => {
  const classes = useStyles()
  const [profile, setProfile] = useState(null)
  const { userid } = useParams()
  const history = useHistory()
  const { state, dispatch } = useContext(UserContext)
  const [showfollow, setShowFollow] = useState(true)

// state?!state.following.includes(userid):

  useEffect(() => {
    fetch(`/api/user/${userid}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        //  console.log(result)
        if(result.error==="User not found"){
          history.push("/ProfileNotFound")
        }else {
          setProfile(result)
        }
      })
  }, [])


  const followUser = () => {
    fetch('/api/follow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        followId: userid
      })
    }).then(res => res.json())
      .then(data => {

        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
        localStorage.setItem("user", JSON.stringify(data))
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id]
            }
          }
        })
        setShowFollow(false)
      })
  }
  const unfollowUser = () => {
    fetch('/api/unfollow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        unfollowId: userid
      })
    }).then(res => res.json())
      .then(data => {

        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
        localStorage.setItem("user", JSON.stringify(data))

        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(item => item != data._id)
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower
            }
          }
        })
        setShowFollow(true)

      })
  }





  return (
    <>
      {profile ?
        <Card className={classes.root}>
          <CardActionArea style={{backgroundImage:'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'}}>
          <center><Avatar style={{width:(250), height:(250),marginTop:(5)}}  alt="Remy Sharp" src="http://res.cloudinary.com/glenbenson/image/upload/v1595604631/oetrlvkykapbxnhinjrj.jpg" /></center>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {profile.user.firstname}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">

                <Button className={classes.buttons} size="small" color="primary">
                  Change Profile
               </Button>

                {showfollow ?
                  <Button className={classes.buttons} size="small" color="primary"  onClick={()=>followUser()}>
                   Follow
              </Button>
                  :
                  <Button className={classes.buttons} size="small" color="primary" onClick={()=>unfollowUser()}>
                   Unfollow
                 </Button>
                }


              </Typography>
            </CardContent>
          </CardActionArea>
          <Box borderTop={2} />
          <CardActions>
          

            <Button size="small" color="primary">
              {profile.posts.length} Post
      </Button>
      <Button size="small" color="primary">
              {profile.user.followers.length} Follower
      </Button>
            <Button size="small" color="primary">
              {profile.user.following.length} Following
      </Button>

          </CardActions>
          <h7>Photo Uploaded</h7>
          {
            profile.posts.map(item => {
              return (
                <CardMedia
                  className={classes.media}
                  image={item.pic}
                  title={item.content}
                />
              )
            })
          }

        </Card>


        : <h2>Loading...</h2>
      }
    </>
  )
}
export default UserProfileMine