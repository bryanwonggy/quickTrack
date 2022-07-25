## Team Name:
camelCase

## Proposed Level of Achievement: 
Apollo 11

## Motivation:
Similar to the fact that most people own more than 1 bank account, we realised that more and more people are getting into investing, be it stocks or cryptocurrency and they tend to have more than 1 brokerage account to get the best fees. This causes a problem for retail investors in keeping track of their total profit and losses over all their accounts as well as tracking the total current value of their portfolios since most brokerage platforms only either do crypto or stocks, but not both. 

These days there are also many news platforms for financial news but most of the time such sites have too much information, which are often not curated to our preferences. This makes it troublesome for owners of both stocks and cryptocurrency to get updated on the latest news at a glance as they search the news platform just to get an update on news that might concern their portfolios. 

## User Stories
1. As a student who holds stocks and cryptocurrency on different brokerage platforms, I want to be able to track the components of my entire portfolio on a single platform.

2. As a student who trades stocks and cryptocurrency on different brokerage platforms, I want to be able to track my total profit/loss on a single platform. 

3. As a retail investor, I want to be able to be constantly updated on the latest financial news for both stocks and cryptocurrency.

4. As a retail investor, I want to be able to assess my current net worth, consisting of both cash as well as stock equity and crypto all on a single platform.

5. As a retail investor, I want to be able to view my previous trade history for both stock and crypto all on a single platform

6. As a retail investor, I want to be able to visualise the long term progress of my stock and crypto portfolio in the form of charts and graphs

## Project Scope
quickTrack is a one-stop web application for retail investors to track their stock and cryptocurrency portfolio, together with their net profit/loss. 

Users can use our application to track their entire portfolio, be it stocks or cryptocurrency, and see the performance of their portfolio over time. They will be able to log down their buys and sells from their brokerage platforms and our application can allow them to track their total profit/loss all on a single platform. Furthermore, they will be able to view financial news relevant to their holdings on the application.


## Patch Updates: 
### Milestone 1
+ Login system that allows users to sign up, sign in or logout using their email and password
+ Protected routes such that users are not able to access the web app if they are not signed in. (Unable to bypass by just using `/${directory}` command
+ Navigation bar has different buttons that will link users to different directory/pages of their choice
+ In the stocks and crypto directory, users can search for a stock/crypto of their choice and the relevant information such as real-time stock quotes and charts of their historic prices will be displayed

### Milestone 2
#### Dashboard Page
+ Created realised P&L tracker that tracks profit & losses from user’s trades
+ Created a currents holding table that lists all of the user’s current holdings, be it stock or crypto (shows ticker symbol, quantity, average cost and total cost)
#### Cash Page
+ Created cash component as a user property in backend and created a whole new cash page comprising of a Deposit/Withdraw Cash form & Current Cash indicator in user’s account
+ Deposit/Withdraw Cash form consists of 4 components (Deposit/Withdraw dropdown selector, Date input, Amount and Submit Button)
+ Form is connected to backend and parses data into user’s cash property
+ Current Cash indicator reflects realtime cash data in user’s account
#### Stocks & Crypto Page
+ Created a Buy/Sell Form for both Stock & Crypto page. Form consists of 6 components (Buy/Sell dropdown selector, Date input, Ticker Symbol input, Quantity input, Price input and Submit Button)
+ Form is connected to backend and parses input data into user’s property in Firebase
+ Fixed bugs for search bar and submit button
+ Now handles exceptions for Buy/Sell transactions (Eg. Not enough Cash to purchase, unable to sell something user does not own, unable to sell more Stock/Crypto than quantity that user actually owns)
#### Charts Page
+ Plots a pie chart to show the Risk Allocation of Capital for each user (Realtime Valuation of user’s exposure to Cash, Stock & Crypto)
#### History Page
+ Pulls data from backend Firebase and shows all previous transactions executed by the user (Deposit/Withdraw/Buy/Sell, Ticker Symbol, Date, Quantity, Price)
+ Displays the data in a table format

## Testing:
Throughout our web application project, we have used many different types of testing. However, 3 prominent ways we have tested our web application were through the use of Unit Testing, Integration Testing and Systems Testing.

### Unit Testing
+ Every function in our web application has gone through a unit test. This is done via a console.log at multiple lines inside of our function. This ensures that if the function does not work the way we intended it to or the function throws an error, we are able to pinpoint which specific line of code results in the error and rectify it promptly
+ To test our API calls, we have further tested them by first ensuring that the API hypertext links return an array of data containing the data that we want to pull. In this case, when testing our web application, we already know that the API hypertext link is working and that any other errors surrounding the API call are not due to a malfunctioning hypertext link.


### Integration Testing
+ As our web application has many features and some of the features interact with each other, we have also applied the logic of Integration Testing in our testing processes. For example, as the Stock page and Crypto page interact with our History page as well as our Dashboard page (Stock and Crypto transactions to be tracked and displayed on our History page), we have gone with a bottom-up approach when testing the applications. In this case, we have ensured that the Stock and Crypto pages were fully functioning independently before we embarked on working on the History and Dashboard pages. This is to prevent confusion when there is an error due to the inability to pinpoint the root cause of the error.

### Systems Testing
+ As we have different pages in our web application, namely the Dashboard / Cash / Stocks / Crypto / Charts / News / History pages and each page comprises many different parts, we have carried out systems testing on each of the pages. For each feature of each page, there are many functions that are underlying and these have already been tested via unit testing. In this case, we made sure that all the different features on each page are able to run at the same time and do not crash/malfunction. This was done mainly by repeatedly running the code, testing the code on different computers as well as testing the code on localhost as well as while it is hosted








## Features:
### Dashboard Page
![](/public/dashboard.png)

#### Description of features
+ Realised P&L over Time graph
Plots a graph of P&L made over time in chronological order.
+ Realised Total P&L indicator
Gets the total value of profits after the user has sold his positions in stocks/crypto that he held. Losses will be indicated as a negative value.
+ List of current holdings
Shows the quantity of current specific stock/crypto held by user as well as the average price bought in.
#### How it was implemented
+ For the realised P/L over time, we collected the data as the user sells his/her stock/crypto and logged it down in our database. Using the data from our database, we were able to get the graph and also the realised P/L value. 
+ As for the real-time (almost) P/L of the stock/crypto to date, we called the API and stored the latest price of the stock/crypto in our database every time the page was refreshed and compared it to the average cost to get the P/L.
#### Problems faced during implementation and how we resolved it
+ The main issue we faced when implementing this page was the fact that the API calls were asynchronous and we could not get the values immediately for them to be shown on the page. Therefore, we had to resort to storing the latest price in our database for this to work. 


### Cash Page
![](/public/cash.png)

#### Description of features
+ The top part comprises a grid box with a current cash value.
+ The bottom part comprises a form which allows the user to indicate deposit or withdraw a certain amount of cash with the current date indicated. It also has a submit button to submit the form.
#### How it was implemented
+ For the top part, we pulled the real-time cash valuation in the user’s account in our backend firebase database and transmitted the value onto the page.
+ For the bottom part, we used a simple form styled with material UI and customised it to our preference for our web application.
#### Problems faced during implementation and how we resolved it
+ Not many problems faced here




### Stock Page
![](/public/stock%20historical.png)

#### Description of features
+ The top portion comprises 2 parts. At the top left, there is a form as well as a chart grid. Upon searching for the ticker symbol of a legitimate stock, the chart will produce a graph of the daily price movement of the stock. At this time, the grid box on the top right would also display all the necessary statistics of the stock price movement such as open price and close price as well as the PE ratio.
+ The bottom portion is a form which allows the user to key in their buys and sells for stocks. The required inputs are Buy/Sell action, Stock ticker, quantity, price as well as the date. Upon submitting the form, the data will be logged into the user’s backend firebase data and it will be logged in the history as well as dashboard section.
#### How it was implemented
+ For the top portion, we used a stock price API from AlphaVantage as well as IEX Cloud. The IEX Cloud API is used to display data on the right whereas the AlphaVantage API is used to pull the time series data to plot the chart. We used Plotly.js to plot the graph from the pulled time series data
+ For the bottom portion, we used a simple form styled with material UI and customised it to our preference for our web application.
#### Problems faced during implementation and how we resolved it
+ Initially, we faced problems and bugs such as the user being able to buy stocks that do not exist, sell stocks that he does not own as well as sell more stocks than he actually owns. Furthermore, we faced an issue of certain data such as the ask price, bid price, ask size and bid size not being able to show due to the stock market’s operating hours. (US Stock market only opens from 9.30 am - 4 pm daily)
+ After intensive testing via unit testing methods, we created a wrapper function to wrap around the API call to ensure that only legitimate ticker symbols are parsed into the next function and allowed to proceed. Any incorrect ticker symbols as well as errors would be captured and be displayed as an error message in red just below the form. We also went a step further to display a success message in green just below the form for any successful submission of the form to notify the user that his transaction has been logged. For the issue of the stock market not being open resulting in some data not being available, we went with a conditional statement. Should the data not be available, we would simply indicate “Market Not Open” beside the unavailable data.


### Crypto Page
![](/public/crypto%20historical.png)

#### Description of features
+ The top portion comprises 2 parts. At the top left, there is a form as well as a chart grid. Upon searching for the ticker symbol of legitimate crypto, the chart will produce a graph of the daily price movement of the crypto. At this time, the grid box on the top right would also display all the necessary statistics of the crypto price movement such as open price and close price.
+ The bottom portion is a form which allows the user to key in their buys and sells for crypto. The required inputs are Buy/Sell action, Crypto ticker, quantity, price as well as the date. Upon submitting the form, the data will be logged into the user’s backend firebase data and it will be logged in the history as well as dashboard section.
#### How it was implemented
+ For the top portion, we used a stock price API from AlphaVantage as well as IEX Cloud. The IEX Cloud API is used to display data on the right whereas the AlphaVantage API is used to pull the time series data to plot the chart. We used Plotly.js to plot the graph from the pulled time series data.
+ For the bottom portion, we used a simple form styled with material UI and customised it to our preference for our web application.
#### Problems faced during implementation and how we resolved it
+ Initially, we faced problems and bugs such as the user being able to buy crypto that do not exist, sell crypto that he does not own as well as sell more crypto than he actually owns.
+ After intensive testing via unit testing methods, we created a wrapper function to wrap around the API call to ensure that only legitimate ticker symbols are parsed into the next function and allowed to proceed. Any fake ticker symbols as well as errors would be captured and be displayed as an error message in red just below the form. We also went a step further to display a success message in green just below the form for any successful submission of the form to notify the user that his transaction has been logged.

### Charts Page
![](/public/charts.png)

#### Description of features
+ For the first chart, it is a risk allocation chart which shows the portfolio allocation of the user’s assets. This can take the form of cash, stocks and crypto.
+ For the second chart, it is a Stock portfolio chart which breaks down and shows how much of each stock the user owns amongst his total stock holdings.
+ For the last chart, it is a Crypto portfolio chart which breaks down and shows how much of each crypto the user owns amongst his total crypto holdings.
#### How it was implemented
+ We used a third-party extension Plotly.js to plot all 3 charts as seen above.
+ To make the different slices in the pie chart, we pulled data from our backend Firebase database, where we have neatly stored the type of asset owned (cash, stock, crypto) as well as the different ticker symbols and their quantity under stock and crypto.
#### Problems faced during implementation and how we resolved it
+ Not much problem faced in this section.

### News Page
![](/public/news.png)

#### Description of features
+ 2 different types of news. Stock news and crypto news. News includes image, title, summary as well as URL to the news article on the news website.
#### How it was implemented
+ Using AlphaVantage News API for stock and crypto, we pulled the relevant news articles into an array and mapped each of them onto a row of 3 grid boxes and each grid box is styled with CSS
#### Problems faced during implementation and how we resolved it
+ Initially, there was a lag due to the API call and it resulted in the program breaking as there was nothing in the array to run a .map function. However, after much researching, we found that we could use an await keyword in our asynchronous API call function such that the program would only proceed after the API call was successfully called and its contents retrieved in an array.

### History Page
![](/public/history.png)

#### Description of features
+ This is a list of past transactions made by the user. It includes receipts of Deposit / Withdraw transactions, Buy / Sell transactions for both Stock as well as Crypto
+ It also has a search bar which allows the user to filter based on his preference. Users are able to filter based on action (Deposit/Withdraw/Buy/Sell) as well as filter based on ticker symbol, date or amount.
#### How it was implemented
+ For every buy/sell of stock/crypto, we logged them down in the database and to display it on a table here, we just had to fetch the data from our database and displayed it in this format. 
+ To make our table more interactive, we also implemented a filter function as well as a sort descending/ascending function. 
#### Problems faced during implementation and how we resolved it
+ Not much problem is faced here besides the fact that the database calls are asynchronous and it might take some time for the page to load. 

## Unified Modelling Language (UML Diagram):
![](/public/uml.png)

### Further Implementation: 

| Feature     | Description     | 
| ----------- | --------------- |
| Candlestick Charts   | Candlestick charts to show the historical data of stocks and crypto for users to be able to view the Open, High, Low, Close (OHLC) prices | 
| Sentiment Analysis |  Allows users to be able to view the current stock and crypto sentiments  |   
| Heat Map | Allows users to view the current stock/crypto climate at a glance |   




## How to use our web app: 
+ Go to our web app: https://master.d1ic8mam84iqdi.amplifyapp.com/
+ Sign in to our webapp with your email and password if you are an existing user. If you are not an existing user, you may want to sign up for a new account with us via the sign up link. 
(NOTE: If u have previously signed up with us during Milestone 1/2, please kindly sign up for a new account for Milestone 3 as there are new features that are not initialised in your previous Milestone 1/2 account settings)
+ After logging into the account, you will be redirected to the dashboard where you will see your email username on the top right hand corner of the web app
+ Once there, any of the icons on the sidebar will route you to the other pages that we have in our web app. Currently, the cash, stocks, crypto & history pages are fully ready for testing. Parts of the dashboard & charts page are enabled.
[Please refer to the patch updates above to see which features are currently enabled]
+ Once done, the user can simply click on the logout icon button on the sidebar to exit from our web app and he / she will be redirected to the login page.

## Work Log: 
https://docs.google.com/spreadsheets/d/1aM_a9qod_enT3JA0SUo_tSakVWYWPVw3hAc1Ejy9KHc/edit?usp=sharing 
