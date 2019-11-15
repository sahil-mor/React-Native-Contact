import React from 'react';
import { StyleSheet, Text, View,AsyncStorage,TouchableOpacity,ScrollView,Linking,Platform,Alert,Image,Share } from 'react-native';
import {Card , CardItem} from 'native-base'
import {Entypo} from '@expo/vector-icons'
export default class ViewContactScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      fname : "",
      lname : "",
      email : "",
      phone : "",
      address : "",
      key : "",
      image : null
    }
  }
  static navigationOptions = {
    headerTitle : "View Contact"
  }
  componentDidMount(){
    const {navigation} = this.props
    navigation.addListener("willFocus", () => {
      var key = this.props.navigation.getParam("key")
      this.findContact(key)
    })
  }
  findContact = async (key) => {
    await AsyncStorage.getItem(key)
    .then( result => {
      result = JSON.parse(result)
      this.setState({ 
        fname : (result).fname , lname : (result).lname,
        phone : (result).phone, email : (result).email,
        address : (result).address, key : key
      })
      if(result.image !== null){
        this.setState({ image : (result.image) })
      }
    } 
    )
    .catch(error => {console.log(error)})
  }

  callAction = phone => {
    var phoneNumber = phone
    if(phone.length === 10){
      if(Platform.OS !== 'android'){
        phoneNumber = `telpromt:${phone}`
      }else{
        phoneNumber  = `tel:${phone}`
      }
      Linking.canOpenURL(phoneNumber)  //if phone number can open that action or not
      .then( supported => {
        if(!supported){
          Alert.alert("Phone Number is not available")
        }else{
          return Linking.openURL(phoneNumber) // opening the link
        }
      } )
      .catch(error => {console.log(error)})
    }else{
      Alert.alert("Phone number is wrong")
    }
  }

  smsAction = phone => {
    var phoneNumber = phone
    if(phone.length === 10){
      phoneNumber = `sms:${phone}`
      Linking.canOpenURL(phoneNumber)  //if phone number can open that action or not
      .then( supported => {
        if(!supported){
          Alert.alert("Phone Number is not available")
        }else{
          return Linking.openURL(phoneNumber) // opening the link
        }
      } )
      .catch(error => {console.log(error)})
    }else{
      Alert.alert("Phone number is wrong")
    }  
  }

  editContact = key => {
    this.props.navigation.navigate("Edit",{
      key : key
    })
  }

  deleteContact = key => {
    Alert.alert(
      "Delete Contact",
      `${this.state.fname} ${this.state.lname}`,
      [
        {
          text : "Cancel", onPress : () => { console.log("cancel tapped") }
        },
        {
          text : "OK", onPress : async () => { 
          await AsyncStorage.removeItem(key)
          .then( () => {
            this.props.navigation.navigate('Home',{
              deleteContact : true,newContactAdded : false
            })
          } )
          .catch(error => {console.log(error)})
          }
        }
      ]
    )
  }

  shareContact = async (key) => {
    await AsyncStorage.getItem(key)
    .then(contact => {
      contact = JSON.parse(contact)
      this.sendData(contact)
    })
    .catch(err => { console.log(err) })
  }
  sendData = async(contact) => {
    const result = await Share.share({
      message : contact.fname + " " + contact.lname + " - " + contact.phone
    })
    console.log(result)
  }
  render(){
    return (
      <ScrollView style={styles.container}>
        <View style={[styles.contactIconContainer, this.state.image !== undefined ? {height : 400} : {} ]}>
          { this.state.image != null ?
            <Image source={{uri : this.state.image}} style={{width : "100%",height : "100%",resizeMode : "cover"}} />    
            : 
            <Text style={styles.contactIcon}>
               {this.state.fname[0]} {this.state.lname[0]}
            </Text> }
            
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {this.state.fname} {this.state.lname}
              </Text>
          </View>
        </View>      
        <View style={styles.infoContainer}>
          <Card>
            <CardItem bordered>
              <Text style={styles.infoText}>Phone </Text>
            </CardItem>
            <CardItem bordered>
              <Text style={styles.infoText}> {this.state.phone} </Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem bordered>
              <Text style={styles.infoText}>Email </Text>
            </CardItem>
            <CardItem bordered>
              <Text style={styles.infoText}> {this.state.email} </Text>
            </CardItem>
          </Card>
          <Card>
            <CardItem bordered>
              <Text style={styles.infoText}>Address </Text>
            </CardItem>
            <CardItem bordered>
              <Text style={styles.infoText}> {this.state.address} </Text>
            </CardItem>
          </Card> 
        </View>
        <Card style={styles.actionContainer}>
          <CardItem bordered style={styles.actionButton}>
              <TouchableOpacity onPress={()=>{this.smsAction(this.state.phone)}}>
                <Entypo name="message" size={50} color="#B83227" />
              </TouchableOpacity>
          </CardItem>
          <CardItem bordered style={styles.actionButton}>
              <TouchableOpacity onPress={()=>{this.callAction(this.state.phone)}}>
                <Entypo name="phone" size={50} color="#B83227" />
              </TouchableOpacity>
          </CardItem>
        </Card>
        <Card style={styles.actionContainer}>
          <CardItem bordered style={styles.actionButton}>
                <TouchableOpacity onPress={()=>{this.editContact(this.state.key)}}>
                  <Entypo name="edit" size={50} color="#B83227" />
                </TouchableOpacity>
            </CardItem>
            <CardItem bordered style={styles.actionButton}>
                <TouchableOpacity onPress={()=>{this.shareContact(this.state.key)}}>
                  <Entypo name="share" size={50} color="#B83227" />
                </TouchableOpacity>
            </CardItem>
            <CardItem bordered style={styles.actionButton}>
                <TouchableOpacity onPress={()=>{this.deleteContact(this.state.key)}}>
                  <Entypo name="trash" size={50} color="#B83227" />
                </TouchableOpacity>
            </CardItem>
        </Card>
       </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  infoContainer : {
    flexDirection : "column"
  },
  contactIconContainer: {
    height: 200,
    backgroundColor: "#B83227",
    alignItems: "center",
    justifyContent: "center"
  },
  contactIcon: {
    fontSize: 100,
    fontWeight: "bold",
    color: "#fff"
  },
  nameContainer: {
    width: "100%",
    height: 70,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.5)",
    justifyContent: "center",
    position: "absolute",
    bottom: 0
  },
  name: {
    fontSize: 24,
    color: "#000",
    fontWeight: "900"
  },
  infoText: {
    fontSize: 18,
    fontWeight: "300"
  },
  actionContainer: {
    flexDirection: "row"
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  actionText: {
    color: "#B83227",
    fontWeight: "900"
  }
});
