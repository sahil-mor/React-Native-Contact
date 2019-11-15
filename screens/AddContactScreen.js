import React from 'react';
import { StyleSheet, Text, View,
  Keyboard,AsyncStorage,Alert,TouchableWithoutFeedback,ScrollView } from 'react-native';
import {Form,Item,Input,Label,Button} from 'native-base'
import * as ImagePicker from 'expo-image-picker'
import { TouchableOpacity } from 'react-native-gesture-handler';
import {Entypo} from '@expo/vector-icons'
export default class AddContactScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      fname : "",lname : "",phone : "",email : "",address : "",image : null
    }
  }
  static navigationOptions = {
    headerTitle : "Contact App"
  }

  saveContact = async () => {
    if(
      this.state.fname !== "" && this.state.lname !== "" &&
      this.state.phone !== ""  && this.state.email !=="" &&
      this.state.address !==""
    ){

      //create an object to store all info

      var contact = {
        fname : this.state.fname,
        lname : this.state.lname,
        phone : this.state.phone,
        email : this.state.email,
        address : this.state.address
      }
      if(this.state.image !== null){
        contact.image = this.state.image
      }
      await AsyncStorage.setItem(Date.now().toString(),
      JSON.stringify(contact)
      )
      .then(() => {
        this.props.navigation.navigate('Home',{
          newContactAdded : true
        })
      })
      .catch(error => {
        console.log(error)
      })
    }else{
      Alert.alert("All fields are required!!!")
    }
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
                  onChangeText={(value)=>{this.setState({ fname : value })}}
                />
              </Item>
              <Item style={styles.inputItem}>
                <Label>Last Name</Label>
                <Input 
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={(value)=>{this.setState({ lname : value })}}
                />
              </Item>
              <Item style={styles.inputItem}>
                <Label>Phone</Label>
                <Input 
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  onChangeText={(value)=>{this.setState({ phone : value })}}
                />
              </Item>
              <Item style={styles.inputItem}>
                <Label>Email</Label>
                <Input 
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={(value)=>{this.setState({ email : value })}}
                />
              </Item>
              <Item style={styles.inputItem}>
                <Label>Address</Label>
                <Input 
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="default"
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
              full onPress={()=>{this.saveContact()}}>
                <Text style={styles.buttonText}>Save</Text>
              </Button>
              <View style={styles.empty}></View>
          </ScrollView>
        </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 10,
    height: 500
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
  },
  empty: {
    height: 500,
    backgroundColor: "#FFF"
  }
});
