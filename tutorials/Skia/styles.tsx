import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
constainer :{
    flex:1,
    backgroundColor:"black"
},
canvas:{
    flex:1
},
playerCar:{
  position: 'absolute',
  bottom: 20,
},
scoreText:{
    color:"white",
    fontSize:24,
    marginBottom:38
},
 scoreDisplay: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  currentScore: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  speedText: {
    color: 'white',
    fontSize: 16,
    marginTop:5
  },
  gameOver:{
    position:"absolute",
    top:0,
    zIndex:2,
    left:0,
    right:0,
    bottom:0,
    backgroundColor:"rgba(0,0,0,0.8)",
    justifyContent:"center",
    alignItems:"center"
  },
  gameOverText:{
    color:"white",
    fontSize:48,
    fontWeight:"bold",
    marginBottom:28
  },
  restartButton:{
    backgroundColor:"white",
    paddingHorizontal:30,
    paddingVertical:15,
    borderRadius:10
  },
  restartText:{
    fontSize:20,
    fontWeight:"bold"
  },
  

})