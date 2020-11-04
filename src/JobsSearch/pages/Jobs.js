import Axios from 'axios';
import Modal from 'react-native-modal';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // hangi sayfada kullanacaksan o sayfaya ekle
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';

import {jobs} from '../styles';
import {JobItem} from '../components';

const Jobs = (props) => {
  const [data, setData] = useState([]); // to keep language
  const [selectedJob, setSelectedJob] = useState('');
  const [modalFlag, setModalFlag] = useState(false);
  const {selectedLanguage} = props.route.params; //from introduction to bring props

  const fetchData = async () => {
    const response = await Axios.get(
      `https://jobs.github.com/positions.json?search=${selectedLanguage.toLowerCase()}`,
    );
    setData(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []); // eger birkez kullanicaksak [] koyuyoruz

  const onJobSelect = (job) => {
    setModalFlag(true);
    setSelectedJob(job);
  };

  const renderJobs = ({item}) => (
    <JobItem job={item} onSelect={() => onJobSelect(item)} />
  );

  const onJobSave = async () => {
    let savedJobList = await AsyncStorage.getItem('@SAVED_JOBS');
    savedJobList = savedJobList == null ? [] : JSON.parse(savedJobList);

    const updatedJobList = [...savedJobList, selectedJob];

    AsyncStorage.setItem('@SAVED_JOBS', JSON.stringify(updatedJobList));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            color: 'orange',
          }}>
          JOBS FOR {selectedLanguage.toUpperCase()}
        </Text>
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={data}
          renderItem={renderJobs}
        />

        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 10,
            position: 'absolute', // zindex :1 ,depend body , float in the body
            bottom: 10,
            right: 10,
          }}
          onPress={() => props.navigation.navigate('SavedJobs')}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>
            Look Register
          </Text>
        </TouchableOpacity>

        <Modal
          isVisible={modalFlag}
          // bos ekrana basinca modal_flag kapanir
          onBackdropPress={() => setModalFlag(false)}>
          <View style={jobs.modalBackground}>
            <View style={{borderBottomWidth: 2, borderColor: '#7cb342'}}>
              <Text style={jobs.jobTitle}>{selectedJob.title}</Text>
              <Text>
                {selectedJob.location} / {selectedJob.title}
              </Text>
              <Text>{selectedJob.company}</Text>
            </View>
            <View style={jobs.jobDesc}>
              <Text numberOfLines={10}>{selectedJob.description}</Text>
            </View>
            <Button title="Register" color="red" onPress={onJobSave} />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export {Jobs};
