import React from 'react';
import { StyleSheet, Text, View,TouchableWithoutFeedback,ScrollView,TouchableOpacity,AsyncStorage, Keyboard,Alert } from 'react-native';
import {Form,Item,Input,Label,Button} from 'native-base'
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
export default class EditContactScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      fname : "",
      lname : '',
      phone : "",
      email : "",
      address : "",
      image : null,
      key : "",
    }
  }
  static navigationOptions = {
    headerTitle : "Edit Contact"
  }

  componentWillMount(){
    const {navigation} = this.props
    navigation.addListener("willFocus",()=>{
      key = this.props.navigation.getParam("key")
      this.populateData(key)
    })
  }

  editContact = async key => {
    if(
      this.state.fname !== "" && this.state.lname !== "" &&
      this.state.phone !== ""  && this.state.email !=="" &&
      this.state.address !==""
    ){
      var contact = {
        fname : this.state.fname,
        lname : this.state.lname,
        address : this.state.address,
        phone : this.state.phone,
        email : this.state.email ,
        image : this.state.image
      }
      await AsyncStorage.mergeItem(key,JSON.stringify(contact))
      .then(()=>{
        this.props.navigation.goBack()
      })
      .catch(error => {console.log(error)})
    }else{

    }
  }

  populateData = async key => {
    await AsyncStorage.getItem(key)
    .then(result => {
      result = JSON.parse(result)
      this.setState({ 
        fname : result.fname, lname : result.lname,
        email : result.email, phone : result.phone, 
        address : result.address, key : key
      })
    })
    .catch(error => {console.log(error)})
  }

  getImage = async () => {
    var result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing : true,
      aspect : [2, 2],
      quality : 1,
    })
    if(!result.cancelled){
      this.setState({ image : result.uri })
    }
  }

  render(){
    return (
      <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss}}>
      <ScrollView style={styles.container}>
        <Form>
          <Item style={styles.inputItem}>
            <Label>First Name</Label>
            <Input 
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              value={this.state.fname}
              onChangeText={(value)=>{this.setState({ fname : value })}}
            />
          </Item>
          <Item style={styles.inputItem}>
            <Label>Last Name</Label>
            <Input 
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              value={this.state.lname}
              onChangeText={(value)=>{this.setState({ lname : value })}}
            />
          </Item>
          <Item style={styles.inputItem}>
            <Label>Phone</Label>
            <Input 
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="number-pad"
              value={this.state.phone}
              onChangeText={(value)=>{this.setState({ phone : value })}}
            />
          </Item>
          <Item style={styles.inputItem}>
            <Label>Email</Label>
            <Input 
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={(value)=>{this.setState({ email : value })}}
            />
          </Item>
          <Item style={styles.inputItem}>
            <Label>Address</Label>
            <Input 
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="default"
              value={this.state.address}
              onChangeText={(value)=>{this.setState({ address : value })}}
            />
          </Item>
          <Item style={styles.inputItem}>
                <Label>Image</Label>
                <TouchableOpacity style={{marginLeft : 50}} onPress={()=>{this.getImage()}}>
                  <Entypo name="image" size={30} />
                </TouchableOpacity>
            </Item>
        </Form>
        <Button 
          style={styles.button}
          full onPress={()=>{this.editContact(this.state.key)}}>
            <Text style={styles.buttonText}>Update</Text>
          </Button>
          <View style={styles.empty}></View>
          <View style={{height : 500,backgroundColor : "white"}}></View>
      </ScrollView>
    </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 10
  },
  inputItem: {
    margin: 10
  },
  button: {
    backgroundColor: "#B83227",
    marginTop: 40
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});