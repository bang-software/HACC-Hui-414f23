import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PAGE_IDS } from '../testIDs/pageIDs';

const HelpPage = () => (
    <div id={PAGE_IDS.HELP_PAGE}>
        <Card style = {{ margin: '30px', backgroundColor: '#E5F0FE' }}>
        <Row style={{ textAlign: 'center' }}>
        <p
          style={{
            fontSize: '40px',
            paddingTop: '20px',
          }}
        >
          Questions By Category
        </p>
          <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0 20px 0' }}>
            <div style={{ flex: 1, backgroundColor: 'lightgray', height: '1.5px', margin: '10px' }} />

            <p style={{ fontWeight: 'bold', margin: '0 10px' }}>GENERAL</p>

            <div style={{ flex: 1, backgroundColor: 'lightgray', height: '1.5px', margin: '10px' }} />
          </div>
            <Col style={{ paddingTop: '30px' }}>
              <h1 style={{ textAlign: 'center' }}>
                <b>How do I Register?</b>
              </h1>
        <h3 style={{ textAlign: 'center' }}>
          <a href={'https://slack.com/signin#/signin'}>
            Join The Slack Workspace
          </a>
        </h3>
        <p>
          <b>
            You will need to make a Slack account if you do not have a
            pre-existing one <br></br> Join the Slack Workspace and type
            &apos;register&apos; <br></br> You will then be given a username and password
            to login.
          </b>
        </p>
            </Col>

      <Col style={{ paddingTop: '30px' }}>
        <div>
          <h1 style={{ textAlign: 'center' }}>
            <b>What is HACC HUI?</b>
          </h1>
          <h4>
            <b>
              HACC HUI is an official HACC 2022 site to help participants create
              and manage their teams
            </b>
          </h4>
        </div>
      </Col>

          <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0 20px 0' }}>
            <div style={{ flex: 1, backgroundColor: 'lightgray', height: '1.5px', margin: '10px' }} />

            <p style={{ fontWeight: 'bold', margin: '0 10px' }}>TEAM MANAGEMENT</p>

            <div style={{ flex: 1, backgroundColor: 'lightgray', height: '1.5px', margin: '10px' }} />
          </div>
            <Col style={{ paddingTop: '30px' }}>
        <h1 style={{ textAlign: 'center' }}>
          <b>Where can I find Teammates?</b>
        </h1>
        <h3 style={{ textAlign: 'center' }}>
          <Link to='list-participants'>
            <p>List Participants Page</p>
          </Link>
        </h3>
        <p>
          <b>
            You can view/send an invitation to all participants through this
            page!
          </b>
        </p>

              <div style={{ paddingTop: '100px' }}>
          <h1 style={{ textAlign: 'center' }}>
            <b>How do I Leave/Delete my Team?</b>
          </h1>
          <h3 style={{ textAlign: 'center' }}>
            <Link to='your-teams'>
              <p>Edit Teams Page</p>
            </Link>
          </h3>
          <p>
            <b>
              Here you can leave, delete, invite, and recruit for your team!
            </b>
          </p>
        </div>
            </Col>

            <Col style={{ paddingTop: '30px' }}>
            <div>
          <h1 style={{ textAlign: 'center' }}>
            <b>How do I Create a Team?</b>
          </h1>
          <h3 style={{ textAlign: 'center' }}>
            <Link to='create-team'>
              <p>Create Teams Page</p>
            </Link>
          </h3>
          <p>
            <b>Make sure to fill out the team creation form fully</b>
          </p>
        </div>
        <div style={{ paddingTop: '115px' }}>
          <h1 style={{ textAlign: 'center' }}>
            <b>Can I be on Multiple Teams?</b>
          </h1>
          <h3 style={{ textAlign: 'center' }}>
            Yes!
          </h3>
          <p>
            <b>
              Although it is suggested that you stay with one team, you are
              allowed to join multiple teams.
            </b>
          </p>
        </div>
            </Col>
          <div style={{ display: 'flex', alignItems: 'center', padding: '20px 0 20px 0' }}>
            <div style={{ flex: 1, backgroundColor: 'lightgray', height: '1.5px', margin: '10px' }} />

            <p style={{ fontWeight: 'bold', margin: '0 10px' }}>UNEXPECTED ERRORS</p>

            <div style={{ flex: 1, backgroundColor: 'lightgray', height: '1.5px', margin: '10px' }} />
          </div>
        <div style={{ paddingTop: '10px', paddingBottom: '30px' }}>
          <h1 style={{ textAlign: 'center' }}>
            <b>Site not Functioning Properly?</b>
          </h1>
          <h4 style={{ textAlign: 'center' }}>
            Please screenshot the problem and direct message cmoore@hawaii.edu
            on Slack
          </h4>
        </div>
      </Row>
        </Card>
    </div>
    );

export default HelpPage;
