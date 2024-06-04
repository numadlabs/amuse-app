import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GooglePlacesInput = () => {
  return (
    <View style={{marginTop:100}}>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          console.log(data, details);
        }}
        query={{
          key: 'AIzaSyD6P0kwuwr_7RTb5_2UZLNteryotRLItCM',
          language: 'en',
        }}
        renderRow={(rowData) => (
          <Text style={styles.suggestion}>{rowData.description}</Text>
        )}
        listViewDisplayed="auto"
        renderDescription={(rowData) => rowData.description}
      />
      <FlatList
        data={[]}
        renderItem={({ item }) => <Text style={styles.suggestion}>{item.description}</Text>}
        keyExtractor={(item) => item.id}
        style={styles.suggestionList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  suggestion: {
    fontSize: 16,
    padding: 10,
  },
  suggestionList: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 2,
  },
});

export default GooglePlacesInput;