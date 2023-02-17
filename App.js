import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = '891365426212be49bae8997d8b49897a';

const icons = {
   Clouds: 'cloudy',
   Rain: 'rains',
   Clear: 'day-sunny',
   Atomosphere: 'cloudy-gusts',
   Snow: 'snow',
   Drizzle: 'rain',
   Thunderstorm: 'lightning'
};

export default function App() {
   const [city, setCity] = useState('Loading');
   const [days, setDays] = useState([]);
   const [ok, setOk] = useState(true);
   const month = new Date().getMonth() + 1;
   const date = new Date().getDate();

   const getWeather = async () => {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
         setOk(false);
      }
      const {
         coords: { latitude, longitude }
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
      setCity(location[0].city);
      const response = await fetch(
         `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
      );
      const json = await response.json();
      setDays(json.daily);
   };

   useEffect(() => {
      getWeather();
   }, []);

   return (
      <View style={styles.container}>
         <StatusBar style="light" />
         <View style={styles.city}>
            <Text style={styles.cityName}>{city}</Text>
         </View>
         <ScrollView
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            horizontal
            contentContainerStyle={styles.weather}>
            {days.length === 0 ? (
               <View style={{ ...styles.day, alignItems: 'center' }}>
                  <ActivityIndicator color="white" size="large" style={{ marginTop: 10 }} />
               </View>
            ) : (
               days.map((day, index) => (
                  <View key={index} style={styles.day}>
                     <Text style={styles.date}>
                        {month}월 {date + index * 1}일
                     </Text>
                     <View style={styles.row}>
                        <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}º</Text>
                        <Fontisto name={icons[day.weather[0].main]} style={styles.icon} />
                     </View>
                     <Text style={styles.description}>{day.weather[0].main}</Text>
                     <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                  </View>
               ))
            )}
         </ScrollView>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#D6722A'
   },
   city: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
   },
   cityName: {
      fontSize: 65,
      color: 'white',
      fontWeight: '500'
   },
   weather: {},
   date: {
      fontSize: 30,
      marginLeft: 30,
      color: 'white'
   },
   day: {
      width: SCREEN_WIDTH
   },
   row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginLeft: 20,
      marginTop: -40
   },
   temp: {
      marginTop: 50,
      fontSize: 100,
      fontWeight: '600',
      color: 'white',
      marginBottom: 30,
      marginRight: 30
   },
   icon: {
      fontSize: 60,
      color: 'white',
      marginTop: 10,
      marginRight: 40
   },
   description: {
      marginTop: -30,
      marginLeft: 35,
      fontSize: 60,
      color: 'white'
   },
   tinyText: {
      fontSize: 20,
      color: 'white',
      marginLeft: 40
   }
});
