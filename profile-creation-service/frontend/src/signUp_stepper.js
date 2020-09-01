import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SignUp from './signUp';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { useContext } from 'react';
import UserContext from './UserContext';
import { useEffect } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
    padding: '10px',
  },
}));

function getSteps() {
  return ['Fill in your personal details', 'Verify your phone number', 'Create 3 questions you want to ask your potential lover', 'Share your profile!'];
}

function getStepContent(step) {
    const {user, setUser} = useContext(UserContext);
    const {loading, phonenumber, profilelink, questions} = user;

    const setPhoneNumber = (e) => {
      const newValue = e.target.value;
      setUser(prevState => ({
        ...prevState,
        phonenumber: newValue
      }))
    }

    const setQuestion = (question_number) => (e) => {
      const newValue = e.target.value;
      setUser(prevState => ({
        ...prevState,
        questions: [
          ...prevState.questions.slice(0,question_number),
          newValue,
          ...prevState.questions.slice(question_number+1)
        ]
      }))
    }

    const setQuestionOne = setQuestion(0);
    const setQuestionTwo = setQuestion(1);
    const setQuestionThree = setQuestion(2);

    const classes = useStyles();
    switch (step) {
    case 0:
      return (
          <SignUp />
      );
    case 1:
      return (
        <TextField
        variant="outlined"
        required
        fullWidth
        label="Phone Number"
        value={phonenumber}
        onChange={setPhoneNumber}
        />
      );
    case 2:
      return (
        <form className={classes.form} noValidate>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                variant="outlined"
                required
                fullWidth
                label="Question 1"
                value={questions[0]}
                onChange={setQuestionOne}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                variant="outlined"
                required
                fullWidth
                label="question_2"
                value={questions[1]}
                onChange={setQuestionTwo}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                variant="outlined"
                required
                fullWidth
                label="question_3"
                value={questions[2]}
                onChange={setQuestionThree}
                />
            </Grid>
            </Grid>
        </form>
    );
    case 3:
      return (
        <>
          {loading ? (
            <span>Generating your profile...</span>
          ) : (
          <span>Congratulations! Share your profile with link <a href={`https://uandi.cc/${profilelink}`}>uandi.cc/{profilelink}</a></span>
          )}
        </>
      )
    default:
      return 'Unknown step';
  }
}

export default function VerticalLinearStepper() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const {user, setUser} = useContext(UserContext);

  useEffect(() => {
    console.log(user)
    if (activeStep === steps.length - 1) {
      setUser(prevUser => ({
        ...prevUser,
        loading: true
      }))
      fetch('https://api.uandi.cc/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phonenumber: user.phonenumber,
          profilelink: user.profilelink,
          nickname: user.nickname,
          bio: user.bio,
          questions: user.questions
        })
      }).then(
        data => data.text
      ).then(
        setUser(prevUser => ({
          ...prevUser,
          loading:false
        })
      ))
    }
  },[activeStep])

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  { activeStep < steps.length - 1 &&
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                  }
                  <Button
                    style={{ "backgroundColor":"rgb(220, 148, 220)", color:"white" }}
                    type="submit"
                    variant="contained"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 2 ? 'Create' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}