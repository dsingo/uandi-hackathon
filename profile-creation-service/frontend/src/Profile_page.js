import React, { Component } from "react";
import Profile from './profile';
import './Profile.css';

class Profile_page extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Alex",
            bio: "I like cheese",
            image: "/assets/images/generic_person.jpg",
            location: "Australia",
            phone: "123456789"
        }
        // this.handle_state = this.handle_state.bind(this);
        // this.get_profile_details();
    }
    /*
    handle_state(name, bio) {
        this.setState({
            name: name,
            bio: bio,
		})
    }
    
    async componentDidMount() {
		try {
			const response = await fetch('api.uandi.cc/create_profile.disease');
			let data = await response.json();
            
            console.log(data);
            
            const id = data.profile_id;
            let nickname = data.nickname;
            let bio = data.bio;
            let questions = data.questions;
            console.log("success!"); 
            console.log(id, nickname, bio, questions);

           // this.handle_state(nickname, bio);
		} catch (error) {
			console.error(error);
		}
    }
    
    get_profile_details() {
        let apiUrl = 'api.uandi.cc/create_profile';
        const payload = {
            method: 'GET',
            mode: 'cors',
            headers: {
            'Content-Type': 'application/json'
            }
        }
        
        //console.log("here!");
        fetch(apiUrl, payload)
		.then(response => response.json())
		.then(data => {
            console.log(data);
            //console.log("called! second");
            
            //const id = data.'profile_id';
            //let nickname = data.'nickname';
            //let bio = data['bio'];
            //let questions = data['questions'];
            console.log(id, nickname, bio, questions);

            this.handle_state(nickname, bio);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
    }
    */
   
    render() {
        return (
            <div class="profile_card">
                <div class="profile">
                    <Profile name={this.state.name} description={this.state.description} image={this.state.image} location={this.state.location} phone={this.state.phone} />
                </div>
            </div> 
        );
  }
}

export default Profile_page;
