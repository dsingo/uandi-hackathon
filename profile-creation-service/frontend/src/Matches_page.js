import React, { Component, useEffect, useState } from "react";
import Match from "./matches_box";
import "./matches.css";
import Button from '@material-ui/core/Button';

const Matches_page = () => {
  const [user, setUser] = useState("dsingo")
  const [submissions, setSubmissions] = useState([])
  useEffect(() => {
    fetch(`https://api.uandi.cc/responses/${user}`).then( data =>
      data.json()
    ).then(
      data => setSubmissions(data)
    )
  }, [user])

  const handleClick = (submissionId) => {
    fetch('https://api.uandi.cc/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: user,
        submissionId: submissionId
      })
    })
  }
  return (
    (
      <div class="matches_card">
          <div class="matches_child">
              <h2>Current Conversations</h2>
              {/*<div><Match/></div>*/}
              <h2>New Responses</h2>
              <div class="response">
                { submissions.length != 0 && submissions.map(({responses, nickname, submissionId}, i) => (
                  <React.Fragment key={i}>
                    <span class="match_details">
                        <div class="names">{nickname} </div>
                        <div class="match_btn">
                            <Button variant="contained" style={{color: "white", backgroundColor: "rgb(220, 148, 220)"}} onClick={() => handleClick(submissionId)}>Match</Button>
                        </div>
                    </span>
                    <br />
                    <ul>
                      {responses.map((question,j) => (
                        <React.Fragment key={j}>
                          <li>{Object.entries(question)[0][0]}</li>
                          <span>{Object.entries(question)[0][1]}</span>
                        </React.Fragment>
                      ))}
                    </ul>
                  </React.Fragment>
                )) }
              </div>
          </div>
      </div> 
  )
  )
}

export default Matches_page;
