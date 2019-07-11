import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import CheckboxList from '../../components/CheckBoxList/CheckBoxList'

// Card UI Components
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
// List UI Components
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// Icon Ui Components

// Packages
import axios from "axios";

// Components
import Footer from "../../components/Footer/Footer";
import DriverList from "../../components/DriverList/DriverList";

// Import config
const config = require("../../config/config");

class CheckDocument extends Component {
  state = {
      dataContact: [],
      dataDocuments: [],
      isLoading: true
  };
  componentDidMount() {
    this.getDataDriver()
  }

  getDataDriver = async () => {
    const uuid = this.props.match.params.uuid;
    const token = localStorage.getItem('token')  
    
    await axios({
        method: "Get",
        url: `http://localhost:${config.port}/users/${uuid}`,
        headers: {
          "x-access-token": `${token}`
        }
      })
        .then(res => {
            console.log(res.data[0]);
            const driver = res.data[0]
            this.setState({
                dataContact: {
                    firstname: driver.firstname, 
                    name: driver.name, 
                    mail: driver.mail, 
                    phone: driver.phone,
                    picture: driver.picture,
                    docVerified: driver.docVerified 
                }
            })
            // dataDrivers.push({
            //     firstname: driver.firstname, 
            //     name: driver.name, 
            //     mail: driver.mail, 
            //     phone: driver.phone 
            // })
          console.log(this.state.dataContact)
        })
        .catch(error => {
          console.log(error);
        });
    
        await axios({
            method: "Get",
            url: `http://localhost:${config.port}/users/${uuid}/driverPapers`,
            headers: {
              "x-access-token": `${token}`
            }
          }).then(res => {
            console.log(res.data);
            const driver = res.data
            this.setState({
                dataDocuments: {
                    identityCard: driver.identityCard, 
                    driverLicense: driver.driverLicense, 
                    proofOfResidence: driver.proofOfResidence,
                    rib: driver.rib, 
                    nSiret: driver.nSiret
                },
                isLoading: false
            })
            console.log(this.state.dataDocuments)
          }).catch(error => {
            console.log(error); 
          })
  }

  render() {
      console.log(this.props.location.documentProps)
      console.log(this.props)
      // General states
      const { isLoading } = this.state
      // Driver contact states
      const { firstname, mail, name, phone, docVerified } = this.state.dataContact;
      // Driver ocument states
      const { identityCard, driverLicense, proofOfResidence, rib, nSiret } = this.state.dataDocuments;

      if (!isLoading) {
          return !docVerified ? (
            <Card>
              <CardHeader
                title={firstname + " " + name}
                subheader={mail + " " + phone}
              />
              <CardContent>
                {/* <List>
                  <ListItem button>
                    <ListItemIcon>
                      <i class="fas fa-cloud-download-alt"></i>
                    </ListItemIcon>
                    <ListItemText primary={identityCard} />
                  </ListItem>
                </List> */}
                <CheckboxList dataDocuments={this.state.dataDocuments}/>
                {/* <ul>
                  <li>{identityCard}</li>
                  <li>{driverLicense}</li>
                  <li>{proofOfResidence}</li>
                  <li>{rib}</li>
                  <li>{nSiret}</li>
                </ul> */}
              </CardContent>
            </Card>
          ) : (
            <Redirect to="admin" />
          );
      } else {
          return <p>Loading...</p>
      }
  }
}

export default CheckDocument;
