import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './styles.css';
import logo from '../../assets/logo.svg';

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={logo} alt="#fiqueEmCasa" />
        </header>

        <main>
          <h1>
            Seu marketplace <br /> para busca de delivery.
          </h1>
          <p>Ajudamos pessoas a encontrarem restaurantes de forma eficiente.</p>

          <Link to="/create-supermarket">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastre seu Restaurante.</strong>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Home;
