import React,{ Component } from 'react';
import { Link } from "react-router-dom";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import RoomIcon from '@material-ui/icons/Room';
import PhoneIcon from '@material-ui/icons/Phone';
import pink from '@material-ui/core/colors/pink';
import Person from "./assets/images/generic_person.jpg";

class Profile extends Component {
  render() {
    return (
      <Card style={{maxWidth: '400'}}>
        <CardMedia
          component="img"
          alt="Generic Person"
          height="300"
          image={Person}
          title="Generic Person"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
          {this.props.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <div class="main-details" style={{"font-size":"14px"}}>
              <div><RoomIcon style={{ color: pink[200] }}/>{this.props.location}</div>
              <div><PhoneIcon style={{ color: pink[200]}}/>{this.props.phone}</div><br />
            </div>
          {this.props.description}
          </Typography>
        </CardContent>
        {/*
        <Link style={{ textDecoration: 'none', fontWeight: "600" }} to="/profile/edit">
            <Button>EDIT PROFILE</Button>
        </Link>*/}
      </Card>
    );
  }
}

export default Profile;