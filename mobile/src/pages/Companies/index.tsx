import React, { useEffect, useState } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import api from '../../services/api';

interface Service {
  id: number;
  image: string;
  title: string;
  image_url: string;
}

interface Company {
  id: number;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
  image_url: string;
}

interface Params {
  uf: string;
  city: string;
}

const Companies: React.FC = () => {
  const navigation = useNavigation();

  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedSevices] = useState<number[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/services');
      setServices(data);
    })();
  }, []);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          '🙁 Ooops...',
          'Precisamos de sua permissão para obter a localização.'
        );

        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setInitialPosition([latitude, longitude]);
    }

    loadPosition();
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/company', {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          services: selectedServices,
        },
      });

      setCompanies(data);
    })();
  }, [selectedServices]);

  const handleNavigationBack = () => {
    navigation.goBack();
  };

  const handleNavigateToDetail = (id: number) => {
    navigation.navigate('Detail', {
      company_id: id,
    });
  };

  const handleSelectService = (id: number) => {
    const alreadySelected = selectedServices.findIndex(
      (service) => service === id
    );

    if (alreadySelected >= 0) {
      const filteredServices = selectedServices.filter(
        (service) => service !== id
      );
      setSelectedSevices(filteredServices);
    } else {
      setSelectedSevices([...selectedServices, id]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigationBack}>
          <Icon name="arrow-left" size={20} color="#ed6a5e" />
        </TouchableOpacity>

        <Text style={styles.title}>😀 Bem Vindo</Text>
        <Text style={styles.description}>
          Encontre no mapa seu restaurante.
        </Text>

        <View style={styles.mapContainer}>
          {initialPosition[0] !== 0 && (
            <MapView
              showsUserLocation
              style={styles.map}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {companies.map((company) => (
                <Marker
                  style={styles.mapMarker}
                  coordinate={{
                    latitude: company.latitude,
                    longitude: company.longitude,
                  }}
                  onPress={() => handleNavigateToDetail(company.id)}
                  key={String(company.id)}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: company.image_url,
                      }}
                    />
                    <Text numberOfLines={1} style={styles.mapMarkerTitle}>
                      {company.name}
                    </Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        {services.map((service) => (
          <TouchableOpacity
            key={String(service.id)}
            style={[
              styles.item,
              selectedServices.includes(service.id) ? styles.selectedItem : {},
            ]}
            onPress={() => handleSelectService(service.id)}
            activeOpacity={0.6}
          >
            <SvgUri width={43} height={43} uri={service.image_url} />
            <Text style={styles.itemTitle}>{service.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: Platform.OS === 'android' ? 20 + Constants.statusBarHeight : 20,
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular',
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  mapMarker: {
    width: 90,
    height: 80,
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#ed6a5e',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover',
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23,
    paddingHorizontal: 5,
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center',
  },

  selectedItem: {
    borderColor: '#ed6a5e',
    borderWidth: 2,
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13,
  },
});
export default Companies;
