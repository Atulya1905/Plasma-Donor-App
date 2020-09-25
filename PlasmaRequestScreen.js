import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      //these values you have to change
      userId : firebase.auth().currentUser.email,
      patientName:"",
      reasonToRequest:"",
      IsRequestActive : "",
      requestedBloodGroup: "",
      Status:"",
      requestId:"",
      userDocId: '',
      docId :''
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addRequest = async (bookName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_plasma').add({
        "user_id": userId,
        "patient_name":patientName,
        "reason_to_request":reasonToRequest,
        "request_id"  : randomRequestId,
        "status" : "requested",
         "date"       : firebase.firestore.FieldValue.serverTimestamp()

    })

    await  this.getPlasmaRequest()
    db.collection('users').where("email_id","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
      IsRequestActive: true
      })
    })
  })

    this.setState({
        patientName :'',
        reasonToRequest : '',
        requestId: randomRequestId
    })

    return Alert.alert(" Requested Successfully")


  }

receivedRequest=(requestedBloodGroup)=>{
  var userId = this.state.userId
  var requestId = this.state.requestId
  db.collection('received_request').add({
      "user_id": userId,
      "blood_group" :bloodGroup,
      "request_id"  : requestId,
      "request_status"  : "received",

  })
}




getIPlasmaRequestActive(){
  db.collection('users')
  .where('email_id','==',this.state.userId)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
      this.setState({
        IsPlasmaRequestActive:doc.data().IsPlasmaRequestActive,
        userDocId : doc.id
      })
    })
  })
}










getPlasmaRequest =()=>{
  
var PlasmaRequest=  db.collection('requested_plasma')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().book_status !== "received"){
        this.setState({
          requestId : doc.data().request_id,
          requestedBloodGroup: doc.data().blood_group,
          requestStatus:doc.data().request_status,
          docId     : doc.id
        })
      }
    })
})}



sendNotification=()=>{
  //to get the first name and last name
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().first_name
      var lastName = doc.data().last_name

      // to get the donor id and book nam
      db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var donorId  = doc.data().donor_id
          var bloodGroup =  doc.data().blood_group

          //targert user id is the donor id to send notification to the user
          db.collection('all_notifications').add({
            "targeted_user_id" : donorId,
            "message" : name +" " + lastName + " received plasma " + bloodGroup ,
            "notification_status" : "unread",
            "blood_group" : bloodGroup
          })
        })
      })
    })
  })
}

componentDidMount(){
  this.getPlasmaRequest()
  this.getIsPlasmaRequestActive()

}

updatePlasmaRequestStatus=()=>{
  db.collection('requested_plasma').doc(this.state.docId)
  .update({
    plasma_status : 'recieved'
  })

  //getting the  doc id to update the users doc
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      //updating the doc
      db.collection('users').doc(doc.id).update({
        IsPlamaRequestActive: false
      })
    })
  })


}


  render(){

    if(this.state.IsPlasmaRequestActive === true){
      return(

        // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Blood Group</Text>
          <Text>{this.state.requestedBloodGroup}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> Request Status </Text>

          <Text>{this.state.requestStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updatePlasmaRequestStatus();
            this.receivedPlasma(this.state.requestedBloodGroup)
          }}>
          <Text>I recieved the donation of plasma </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {
    return(
      // Form screen
        <View style={{flex:1}}>
          <MyHeader title="Request Plasma" navigation ={this.props.navigation}/>

          <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter blood group"}
                onChangeText={(text)=>{
                    this.setState({
                        bloodGroup:text
                    })
                }}
                value={this.state.bloodGroup}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"What do u need the plasma for?"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{ this.addRequest(this.state.bloodGroup,this.state.reasonToRequest);
                }}
                >
                <Text>Request</Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)
