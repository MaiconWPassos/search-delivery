import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import sweetalert2 from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { LeafletMouseEvent } from 'leaflet';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';

import api from '../../services/api';
import Dropzone from '../../components/Dropzone';

import './styles.css';
import logo from '../../assets/logo.svg';

interface Service {
  id: number;
  image: string;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const swal = withReactContent(sweetalert2);

const CreateCompany = () => {
  const history = useHistory();
  const [services, setServices] = useState<Service[]>([]);
  const [ufs, setUFs] = useState<string[]>([]);
  const [citys, setCitys] = useState<string[]>([]);

  const [selectedUF, setSelectedUF] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedServices, setSelectedSevices] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });

  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/services');
      setServices(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get<IBGEUFResponse[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
      );

      const ufInitials = data.map((uf) => uf.sigla);
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

      const cityNames = data.map((city) => city.nome);

      setCitys(cityNames);
    })();
  }, [selectedUF]);

  const handleSelectUf = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUF(event.target.value);
  };

  const handleSelecTCity = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const handleMapClick = (event: LeafletMouseEvent) => {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  };

  const handleInputchange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUF;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const services = selectedServices;

    const dataSupermarket = new FormData();

    dataSupermarket.append('email', email);
    dataSupermarket.append('whatsapp', whatsapp);
    dataSupermarket.append('name', name);
    dataSupermarket.append('uf', uf);
    dataSupermarket.append('city', city);
    dataSupermarket.append('latitude', String(latitude));
    dataSupermarket.append('longitude', String(longitude));
    dataSupermarket.append('services', services.join(','));

    if (selectedFile) {
      dataSupermarket.append('image', selectedFile);
    }
    await api.post('/company', dataSupermarket);

    swal
      .fire({
        title: 'Search Delivery',
        text: 'Supermercado cadastrado com sucesso!',
        icon: 'success',
        confirmButtonText: 'Fechar',
      })
      .then(() => {
        history.push('/');
      });
  };

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="#fiqueEmCasa" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para Home.
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro de Restaurante.</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Ex: Restaurante Bom Apetite"
              onChange={handleInputchange}
              required
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Ex: contato@restaurant.com.br"
                required
                onChange={handleInputchange}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                placeholder="+5518998877665"
                onChange={handleInputchange}
                required
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa.</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>

              <select
                name="uf"
                id="uf"
                onChange={handleSelectUf}
                value={selectedUF}
                required
              >
                <option value="0">Selecione uma UF..</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                onChange={handleSelecTCity}
                value={selectedCity}
                required
              >
                <option value="0">Selecione uma UF..</option>
                {citys.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Serviços Diponíveis</h2>
            <span>Selecione um ou mais serviços abaixo.</span>
          </legend>

          <ul className="items-grid">
            {services.map((service) => (
              <li
                key={service.id}
                onClick={() => handleSelectService(service.id)}
                className={
                  selectedServices.includes(service.id) ? 'selected' : ''
                }
              >
                <img src={service.image_url} alt={service.title} />
                <span>{service.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type="submit">Cadastrar Restaurante</button>
      </form>
    </div>
  );
};

export default CreateCompany;
