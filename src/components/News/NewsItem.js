import React from 'react'
import "./news.css"

const NewsItem = ({ data }) => {
    return (
        <div className="news">
            <img src={data.banner_image} alr="New Image" />
            <h3 className="news_title">
                <a href={data.url}>{data.title}</a>
            </h3>
            <p className="news_summary">{data.summary}</p>
        </div>
    )
}

export default NewsItem