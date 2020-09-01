import React, {useContext} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import UserContext from './UserContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "rgb(220, 148, 220)",
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const {user, setUser} = useContext(UserContext);
  const {nickname, profilelink, bio} = user;

  const setNickname = (e) => {
    const newValue = e.target.value;
    setUser(prevState => ({
      ...prevState,
      nickname: newValue
    }));
  }

  const setProfileLink = (e) => {
    const newValue = e.target.value;
    setUser(prevState => ({
      ...prevState,
      profilelink: newValue
    }))
  }

  const setBio = (e) => {
    const newValue = e.target.value;
    setUser(prevState => ({
      ...prevState,
      bio: newValue
    }))
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Nickname"
                autoFocus
                value={nickname}
                onChange={setNickname}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Profile Link (e.g. uandi.cc/urlink)"
                value={profilelink}
                onChange={setProfileLink}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Tell us about yourself"
                value={bio}
                onChange={setBio}
              />
            </Grid>
          </Grid>

          {/*
          <Button
            variant="contained"
            component="label"
            >
            Upload Image
            <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
            />
            </Button>
          */}
        </form>
      </div>
    </Container>
  );
}