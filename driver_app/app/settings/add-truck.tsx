import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTheme } from "../../context/ThemeContext";
import { addTruck } from "../../services/truckService";

export default function AddTruckScreen() {

  const { theme } = useTheme();

  const [vehicleNo,setVehicleNo]=useState("");
  const [vehicleType,setVehicleType]=useState("");
  const [vehicleModel,setVehicleModel]=useState("");
  const [manufacturer,setManufacturer]=useState("");
  const [fuelType,setFuelType]=useState("");
  const [registrationYear,setRegistrationYear]=useState("");
  const [capacity,setCapacity]=useState("");

  const saveTruck = async()=>{

      const driverId = Number(
          await AsyncStorage.getItem("driver_id")
      );

      const result = await addTruck(driverId,{
          vehicle_no:vehicleNo,
          vehicle_type:vehicleType,
          vehicle_model:vehicleModel,
          manufacturer:manufacturer,
          fuel_type:fuelType,
          registration_year:registrationYear,
          load_capacity:capacity,
      });

      if (result.status === "success") {

          Alert.alert(
              "Success",
              "Truck submitted for admin approval."
          );

          router.back();

      }else{

          Alert.alert(
              "Error",
              result.detail || result.message
          );

      }

  };

  const input=(placeholder:string,value:string,set:any)=>(
      <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={set}
          placeholderTextColor="#888"
          style={[
              styles.input,
              {
                  backgroundColor:theme.colors.card,
                  color:theme.colors.text,
                  borderColor:theme.colors.border,
              }
          ]}
      />
  );

  return(

      <ScrollView
          style={{
              flex:1,
              backgroundColor:theme.colors.background,
          }}
          contentContainerStyle={{
              padding:20,
          }}
      >

          <View style={styles.headerRow}>

              <TouchableOpacity
                  onPress={()=>router.back()}
              >
                  <MaterialCommunityIcons
                      name="arrow-left"
                      size={28}
                      color={theme.colors.text}
                  />
              </TouchableOpacity>

              <Text
                  style={[
                      styles.header,
                      {
                          color:theme.colors.text,
                      }
                  ]}
              >
                  Add Truck
              </Text>

          </View>

          {input("Vehicle Number",vehicleNo,setVehicleNo)}

          {input("Vehicle Type",vehicleType,setVehicleType)}

          {input("Vehicle Model",vehicleModel,setVehicleModel)}

          {input("Manufacturer",manufacturer,setManufacturer)}

          {input("Fuel Type",fuelType,setFuelType)}

          {input("Registration Year",registrationYear,setRegistrationYear)}

          {input("Load Capacity",capacity,setCapacity)}

          <TouchableOpacity
              style={[
                  styles.button,
                  {
                      backgroundColor:theme.colors.primary,
                  }
              ]}
              onPress={saveTruck}
          >
              <Text style={styles.buttonText}>
                  Submit Truck
              </Text>
          </TouchableOpacity>

      </ScrollView>

  );

}

const styles=StyleSheet.create({

header:{
fontSize:28,
fontWeight:"700",
marginLeft:15,
},

headerRow:{
flexDirection:"row",
alignItems:"center",
marginBottom:25,
},

input:{
height:56,
borderWidth:1,
borderRadius:14,
paddingHorizontal:16,
marginBottom:18,
fontSize:16,
},

button:{
height:56,
borderRadius:14,
justifyContent:"center",
alignItems:"center",
marginTop:15,
},

buttonText:{
color:"#fff",
fontSize:18,
fontWeight:"700",
},

});