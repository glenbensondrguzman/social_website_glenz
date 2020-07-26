import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ProfileMine from './ProfileMine';
import ProfileCreateText from './ProfileCreateText';
import ProfilePost from './ProfilePost';
 


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
     
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
     
    },
  }));

const Profile = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
        <Grid container spacing={1} justify="center">
          <Grid item xs={4}>
            <Paper style={{ position: "sticky",  top: -300}}  className={classes.paper}><ProfileMine/></Paper>
          </Grid>
          <Grid item xs={7}>
          <Paper className={classes.paper} ><ProfileCreateText/></Paper>
            <Paper className={classes.paper} ><ProfilePost/></Paper>
          </Grid>
        </Grid>
      </div>
    )
}

export default Profile;