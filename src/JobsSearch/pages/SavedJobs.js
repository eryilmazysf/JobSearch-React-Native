import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import {JobItem} from '../components';

const SavedJobs = (props) => {
  const [jobList, setJobList] = useState([]);

  AsyncStorage.getItem('@SAVED_JOBS').then((res) => {
    const list = JSON.parse(res);
    setJobList(list);
  });
  const renderList = ({item}) => <JobItem job={item} />;

  let clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }

    console.log('Done.');
  };

  return (
    <SafeAreaView>
      <View>
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={jobList}
          renderItem={renderList}
        />
        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 10,
            position: 'absolute', // zindex :1 ,depend body , float in the body
            top: 20,
            right: 10,
          }}
          onPress={clearAll}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Clear</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export {SavedJobs};
