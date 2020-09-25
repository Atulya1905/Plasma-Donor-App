import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyReceivedPlasmaScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
      receivedPlasmaList : []
    }
  this.requestRef= null
  }

  getReceivedPlasmaList =()=>{
    this.requestRef = db.collection("requested_books")
    .where('user_id','==',this.state.userId)
    .where("book_status", '==','received')
    .onSnapshot((snapshot)=>{
      var receivedPlasmaList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        receivedPlasmaList : receivedPlasmaList
      });
    })
  }

  componentDidMount(){
    this.getReceivedPlasmaList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    console.log(item.blood_group);
    return (
      <ListItem
        key={i}
        title={item.blood_group}
        subtitle={item.requestStatus}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Received Plasma" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.receivedPlasmaList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of Plasma Donations</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.receivedPlasmaList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})
