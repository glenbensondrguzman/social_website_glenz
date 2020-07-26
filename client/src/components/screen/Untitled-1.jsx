import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Collapse from '@material-ui/core/Collapse'
import { red } from '@material-ui/core/colors'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import clsx from 'clsx'
import React, { useState, useEffect, useContext } from 'react'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt'
import { UserContext } from '../../App'
import TextField from '@material-ui/core/TextField'
import { Link } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    width: "500px",
    margin: "20px",
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '55ch',
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


  },
  media: {

    height: 10,
    paddingTop: '60%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },

}))


const Home = () => {
  const [data, setData] = useState([])
  console.log(data)
  const classes = useStyles()
  const { state, dispatch } = useContext(UserContext)
  const [expandedId, setExpandedId] = React.useState(-1);
  const handleExpandClick = i => {
    setExpandedId(expandedId === i ? -1 : i);
  }
  
  useEffect(() => {
    fetch('/api/allpost', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        // console.log(result)
        setData(result.posts)
      })
  }, [])


  const likePost = (id) => {
    fetch('/api/like', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then(result => {
        //   console.log(result)
        const newData = data.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      }).catch(err => {
        console.log(err)
      })
  }
  const unlikePost = (id) => {
    fetch('/api/unlike', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json())
      .then(result => {
        // console.log(result)
        const newData = data.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      }).catch(error => {
        console.log(error)
      })
  }
  const makeComment = (text, postId) => {
    fetch('/api/comment', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId,
        text
      })
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        const newData = data.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setData(newData)
      }).catch(error => {
        console.log(error)
      })
  }
  const deletePost = (postid) => {
    fetch(`/api/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        const newData = data.filter(item => {
          return item._id !== result._id
        })
        setData(newData)
      })
  }
  return (
    <div >
      {
        data.map((item, i) => {
          const name = `${item.postedBy.firstname} ${item.postedBy.lastname}`
          return (
            <Card className={classes.root} key={item._id}>

              <CardHeader
                avatar={
                  <Avatar alt="Remy Sharp" src={item.pic} />
                }
                action={
                  <IconButton aria-label="settings">
                    {item.postedBy._id == state._id &&
                      <Button className={classes.buttons} size="small" color="primary" onClick={() => deletePost(item._id)}>Delete</Button>
                    }
                  </IconButton>
                }
                title={<Link style={{ textDecoration: 'none' }} to={item.postedBy._id !== state._id ? "/User/" + item.postedBy._id : "/Profile"}>{name}</Link>}
                subheader={item.createdAt}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  {item.content}{item.postedBy._id}
                </Typography>
              </CardContent>
              <CardMedia
                className={classes.media}
                image={item.pic}
              // title="Paella dish"
              />

              <CardActions disableSpacing>
                {
                  item.likes.includes(state._id)
                    ?
                    <IconButton onClick={() => { unlikePost(item._id) }} >
                      <ThumbDownAltIcon />
                    </IconButton>
                    :
                    <IconButton onClick={() => { likePost(item._id) }} >
                      <ThumbUpIcon />
                    </IconButton>
                }

                {item.likes.length} Like

                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expandedId,
                  })}
                  onClick={() => handleExpandClick(i)}
                  aria-expanded={expandedId === i}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>{item.comments.length}  Comments
              </CardActions>


              <Collapse in={expandedId === i} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph>Comments:</Typography>
                  {
                    item.comments.map(record => {
                      console.log(record)
                      return (


                        <Typography paragraph>
                          <h6 key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy.firstname} {record.postedBy.lastname}</span> {record.text}</h6>
                        </Typography>
                      )
                    })
                  }

                </CardContent>
              </Collapse>
              <form onSubmit={(e) => {
                e.preventDefault()
                makeComment(e.target[0].value, item._id)
              }}>
                <TextField id="outlined-basic" label="Comment Here!" variant="outlined" />
              </form>
            </Card>

          )
        })
      }

    </div>
  )
}

export default Home
