import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Collapse from '@material-ui/core/Collapse';
import { red } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareIcon from '@material-ui/icons/Share';
import clsx from 'clsx';
import React, { useEffect, useState,useContext} from 'react';
import {UserContext} from '../../App'
import {useParams,useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 700,


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

}));


const UserProfilePost = () => {
  const [profile, setProfile] = useState(null)
  const history = useHistory()
  // const { state, dispatch } = useContext(UserContext)
  const { userid } = useParams()

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  useEffect(()=>{
    fetch(`/api/user/${userid}`,{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result) 
        if(result.error==="User not found"){
          history.push("/ProfileNotFound")
        }else {
          setProfile(result)
        }
        
    })
 },[])


  return (
    <>
{profile ? 

<div>
{
  profile.posts.map(item => {
     const name = `${item.postedBy.firstname} ${item.postedBy.lastname}`
    return (
      <Card className={classes.root} key={item._id}>
         <CardHeader
                avatar={
                  <Avatar alt="Remy Sharp" src={item.pic} />
                }

                title={name}
                subheader="September 14, 2016"
              />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {item.content}
          </Typography>
        </CardContent>
        <CardMedia
          className={classes.media}
          image={item?item.pic:<h5>Loading</h5>}
          title={item?item.content:<h5>Loading</h5>}
        />

        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Comments:</Typography>
            <Typography paragraph>
              Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
              minutes.
          </Typography>
          </CardContent>
        </Collapse>
      </Card>
    )
  })
}
</div>


: <h4>Loding...</h4>}
     

    </>
  )
}

export default UserProfilePost
