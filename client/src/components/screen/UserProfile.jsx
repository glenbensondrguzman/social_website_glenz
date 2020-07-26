import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import UserProfileMine from './UserProfileMine';
import UserProfilePost from './UserProfilePost';



const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  }));

const UserProfile = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
        <Grid container spacing={1} justify="center">
          <Grid item xs={4}>
            <Paper className={classes.paper}><UserProfileMine/></Paper>
          </Grid>
          <Grid item xs={7}>
            <Paper className={classes.paper} ><UserProfilePost/></Paper>
          </Grid>
        </Grid>
      </div>
    )
}

export default UserProfile