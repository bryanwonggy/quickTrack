import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const NewsContext = createContext();

export const NewsContextProvider = (props) => {
  const [data, setData] = useState();
  const [dataCrypto, setDataCrypto] = useState();
  const API_KEY = "R8QVYYFNVOKVRKP4"; //AlphaVantage
  const API_KEY_2 = "AQ84YYYGZLMH5O2S";
  const API_KEY_3 = "T7GOS9UY9JV7Y6QF";
  const APICallString = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=${API_KEY_2}`;
  const APICallStringCRYPTO = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=CRYPTO:BTC&apikey=${API_KEY_3}`;

  useEffect(() => {
    axios
      .get(APICallString)
      .then((response) => setData(response.data))
      .catch((error) => console.log(error));

    axios
      .get(APICallStringCRYPTO)
      .then((response) => setDataCrypto(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <NewsContext.Provider value={{ data, dataCrypto }}>
      {props.children}
    </NewsContext.Provider>
  );
};
