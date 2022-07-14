import React, { useContext } from "react";
import { NewsContext } from "./NewsContext";
import NewsItem from "./NewsItem";
import "./news.css";

function News(props) {
  const { data, dataCrypto } = useContext(NewsContext);

  return (
    <div>
      <h1 className="StockNews">Stock News</h1>
      <div className="all_news">
        {data
          ? data.feed
              .slice(0, 15)
              .map((news) => <NewsItem data={news} key={news.url} />)
          : "Loading..."}
      </div>
      <h1 className="StockNews">Crypto News</h1>
        <div className="all_news">
          {dataCrypto
            ? dataCrypto.feed
                .slice(0, 15)
                .map((news) => <NewsItem data={news} key={news.url} />)
            : "Loading..."}
        </div>
    </div>
  );
}

export default News;
