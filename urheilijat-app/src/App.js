import React, { useState, useEffect } from 'react';
import axios from 'axios';


const App = () => {
  const [urheilijat, setUrheilijat] = useState([]);
  const [uusiUrheilija, setUusiUrheilija] = useState({
    etunimi: '',
    sukunimi: '',
    syntymavuosi: '',
    paino: '',
    kuvalinkki: '',
    laji: '',
    saavutukset: '',
  });
  const [muokattavaUrheilija, setMuokattavaUrheilija] = useState(null);

  useEffect(() => {
    haeUrheilijat();
  }, []);

  const haeUrheilijat = async () => {
    try {
      const response = await axios.get('http://localhost:3006/urheilijat');
      setUrheilijat(response.data);
    } catch (error) {
      console.error('Virhe urheilijoiden hakemisessa:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUusiUrheilija((prevUrheilija) => ({
      ...prevUrheilija,
      [name]: value,
    }));
  };

  const lisaaUrheilija = async () => {
    try {
      if (uusiUrheilija.etunimi && uusiUrheilija.sukunimi) {
        const response = await axios.post('http://localhost:3006/urheilijat', uusiUrheilija);
        setUrheilijat([...urheilijat, response.data]);
        setUusiUrheilija({
          etunimi: '',
          sukunimi: '',
          syntymavuosi: '',
          paino: '',
          kuvalinkki: '',
          laji: '',
          saavutukset: '',
        });
      } else {
        console.error('Etunimi ja sukunimi ovat pakollisia.');
      }
    } catch (error) {
      console.error('Virhe urheilijan lisäämisessä:', error);
    }
  };

  const paivitaUrheilija = async () => {
    try {
        if (muokattavaUrheilija && muokattavaUrheilija.id) {
            const syntymavuosiDate = new Date(uusiUrheilija.syntymavuosi);
            const formattedSyntymavuosi = syntymavuosiDate.toISOString().split('T')[0];
            const paivitettyUrheilija = {
                ...uusiUrheilija,
                syntymavuosi: formattedSyntymavuosi,
            };

            const response = await fetch(`http://localhost:3006/urheilijat/${muokattavaUrheilija.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paivitettyUrheilija),
            });

            if (response.ok) {
                // Nollaa tilat ja päivitä lista
                setMuokattavaUrheilija(null);
                haeUrheilijat();
            } else {
                console.error('Virhe päivittäessä urheilijaa.');
            }
        } else {
            console.error('Virhe päivittäessä urheilijaa. Tarkista, että muokattava urheilija on asetettu.');
        }
    } catch (error) {
        console.error('Virhe urheilijan päivittämisessä:', error);
    }
};
  
  
  
  

  const poistaUrheilija = async (urheilijaId) => {
    try {
      await axios.delete(`http://localhost:3006/urheilijat/${urheilijaId}`);
      haeUrheilijat();
    } catch (error) {
      console.error('Virhe urheilijan poistamisessa:', error);
    }
  };

  const aloitaMuokkaus = (urheilija) => {
    setMuokattavaUrheilija(urheilija);
    setUusiUrheilija(urheilija);
  };

  const peruutaMuokkaus = () => {
    setMuokattavaUrheilija(null);
    setUusiUrheilija({
      etunimi: '',
      sukunimi: '',
      syntymavuosi: '',
      paino: '',
      kuvalinkki: '',
      laji: '',
      saavutukset: '',
    });
  };

  return (
    <div className="container mt-5"> {/* Add margin-top for space */}
      <h2 className="text-center mb-4">Urheilijat</h2>
      <ul className="list-group">
        {urheilijat.map((urheilija) => (
          <li key={urheilija.id} className="list-group-item d-flex justify-content-between align-items-center">
            {urheilija.etunimi} {urheilija.sukunimi}
            <div>
              <button className="btn btn-danger me-2" onClick={() => poistaUrheilija(urheilija.id)}>
                Poista
              </button>
              <button className="btn btn-warning" onClick={() => aloitaMuokkaus(urheilija)}>
                Muokkaa
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h3 className="mt-4">{muokattavaUrheilija ? 'Muokkaa urheilijaa:' : 'Lisää uusi urheilija:'}</h3>
      <form>
  <div className="mb-3">
    <label className="form-label">Etunimi:</label>
    <input type="text" className="form-control" name="etunimi" value={uusiUrheilija.etunimi} onChange={handleInputChange} />
  </div>
  <div className="mb-3">
    <label className="form-label">Sukunimi:</label>
    <input type="text" className="form-control" name="sukunimi" value={uusiUrheilija.sukunimi} onChange={handleInputChange} />
  </div>
  <div className="mb-3">
    <label className="form-label">Syntymävuosi:</label>
    <input type="text" className="form-control" name="syntymavuosi" placeholder="YYYY" value={uusiUrheilija.syntymavuosi} onChange={handleInputChange} />
  </div>
  <div className="mb-3">
    <label className="form-label">Paino:</label>
    <input type="text" className="form-control" name="paino" value={uusiUrheilija.paino} onChange={handleInputChange} />
  </div>
  <div className="mb-3">
    <label className="form-label">Kuvalinkki:</label>
    <input type="text" className="form-control" name="kuvalinkki" value={uusiUrheilija.kuvalinkki} onChange={handleInputChange} />
  </div>
  <div className="mb-3">
    <label className="form-label">Laji:</label>
    <input type="text" className="form-control" name="laji" value={uusiUrheilija.laji} onChange={handleInputChange} />
  </div>
  <div className="mb-3">
    <label className="form-label">Saavutukset:</label>
    <input type="text" className="form-control" name="saavutukset" value={uusiUrheilija.saavutukset} onChange={handleInputChange} />
  </div>
  {muokattavaUrheilija ? (
    <>
      <button type="button" className="btn btn-primary me-2" onClick={paivitaUrheilija}>
        Päivitä urheilija
      </button>
      <button type="button" className="btn btn-secondary" onClick={peruutaMuokkaus}>
        Peruuta muokkaus
      </button>
    </>
  ) : (
    <button type="button" className="btn btn-success" onClick={lisaaUrheilija}>
      Lisää urheilija
    </button>
  )}
</form>

    </div>
  );
};

export default App;

