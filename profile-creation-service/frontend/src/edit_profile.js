import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
  },
});

export default function Edit_profile(props) {
  const classes = useStyles();
//'/assets/images/generic_person.jpg'
  return (
    <div class="profile_card">
      <Card className={classes.root}>
        <CardMedia
          component="img"
          alt="Generic Person"
          height="250"
          image={props.image}
          title="Generic Person"
        />
        <CardContent>
          <TextField
            id="outlined-multiline-static"
            label="Name"
            defaultValue={props.location}
            variant="outlined"
            onInput = {(e) =>{
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,20)
          }}/>
          <TextField
            id="outlined-multiline-static"
            label="Location"
            defaultValue={props.location}
            variant="outlined"
            onInput = {(e) =>{
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,200)
          }}/>
          <TextField
            id="outlined-multiline-static"
            label="Phone Number"
            defaultValue={props.phone}
            variant="outlined"
            onInput = {(e) =>{
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,10)
          }}/>
          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={4}
            defaultValue={props.description}
            variant="outlined"
            onInput = {(e) =>{
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,200)
          }}/>
          <TextField
            id="outlined-multiline-static"
            label="Question 1"
            multiline
            rows={2}
            defaultValue={props.question_1}
            variant="outlined"
            onInput = {(e) =>{
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,100)
          }}/>
          <TextField
            id="outlined-multiline-static"
            label="Question 2"
            multiline
            rows={2}
            defaultValue={props.question_2}
            variant="outlined"
            onInput = {(e) =>{
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,100)
          }}/>
          <TextField
            id="outlined-multiline-static"
            label="Question 3"
            multiline
            rows={2}
            defaultValue={props.question_3}
            variant="outlined"
            onInput = {(e) =>{
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,100)
          }}/> 
        </CardContent>
        <Button
         type="submit"
         variant="contained"
         color="primary"
         >
           SAVE CHANGES
        </Button>
      </Card>
    </div>
  );
}