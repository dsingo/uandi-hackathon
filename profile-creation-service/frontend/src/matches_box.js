import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CloseIcon from '@material-ui/icons/Close';
import "./matches.css";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
  },
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function PositionedPopper() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(true);
  const [placement, setPlacement] = React.useState();
  const classes = useStyles();

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(placement === false);
    setPlacement(newPlacement);
  };

  return (
    <div className={classes.root}>
      <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            {/*
            <Card>
              <CardContent>
                <table cellpadding="0" >
                  <tr>
                    <td width="150px">
                      <Typography  style={{fontWeight:"700"}} class="description" className={classes.typography}>Person's name</Typography>
                      <Typography class="description" className={classes.typography}>Phone </Typography>
                    </td>
                    <td>
                      <div class="close_btn"><CloseIcon onClick={handleClick('top')} /></div>
                    </td>
                  </tr>
                </table>
              </CardContent>
            </Card>*/}
            <div>
              <p>Andrew</p>
              <p>123456789</p>
              <div class="close_btn"><CloseIcon onClick={handleClick('top')} /></div>
            </div>
          
          </Fade>
        )}
      </Popper>
     
    </div>
  );
}
