import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

import { View, ImageBackground, Image, StyleSheet, Text } from 'react-native';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

interface SelectPickerItem {
  label: string;
  value: any;
}

const Home: React.FC = () => {
  const navigation = useNavigation();

  const [ufs, setUFs] = useState<SelectPickerItem[]>([]);
  const [citys, setCitys] = useState<SelectPickerItem[]>([]);

  const [selectedUF, setSelectedUF] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  const handleNavigateToCompanies = () => {
    navigation.navigate('Companies', {
      uf: selectedUF,
      city: selectedCity,
    });
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
      );

      const ufInitials = data.map((uf) => ({
        label: uf.sigla,
        value: uf.sigla,
      }));

      setUFs(ufInitials);
    })();
  }, []);

  useEffect(() => {
    if (selectedUF === '0') {
      return;
    }

    (async () => {
      const { data } = await axios.get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`
      );

      const cityNames = data.map((city) => ({
        label: city.nome,
        value: city.nome,
      }));

      setCitys(cityNames);
    })();
  }, [selectedUF]);

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/home-background.png')}
      imageStyle={{
        width: 274,
        height: 274,
      }}
      resizeMode="cover"
    >
      <View style={styles.main}>
        <Image
          style={styles.logo}
          resizeMode="contain"
          source={require('../../assets/logo.png')}
        />
        <Text style={styles.title}>
          Seu marketplace para busca de delivery.
        </Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem restaurantes de forma eficiente.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.labelFooter}>
          Selecione a UF e Cidade para prosseguir:
        </Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedUF(value)}
          items={ufs}
          placeholder={{
            label: 'Selecione a UF..',
            value: null,
          }}
          style={pickerSelectStyles}
          value={selectedUF}
        />

        <RNPickerSelect
          onValueChange={(value) => setSelectedCity(value)}
          items={citys}
          placeholder={{
            label: 'Selecione a cidade',
            value: null,
          }}
          style={pickerSelectStyles}
          value={selectedCity}
        />
        <RectButton style={styles.button} onPress={handleNavigateToCompanies}>
          <View style={styles.buttonIcon}>
            <Text>
              <Feather name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  logo: {
    height: 90,
    width: 175,
  },

  title: {
    color: '#28282b',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},
  labelFooter: {
    fontWeight: '500',
    color: '#6C6C80',
    fontSize: 16,
    marginVertical: 16,
  },

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#ed6a5e',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
    position: 'relative',
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    position: 'absolute',
    right: 0,
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#ed6a5e',

    // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#ed6a5e',
    borderWidth: 1,
    borderColor: 'gray',
  },
});

export default Home;
