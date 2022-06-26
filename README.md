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
+ History Page
+ Pulls data from backend Firebase and shows all previous transactions executed by the user (Deposit/Withdraw/Buy/Sell, Ticker Symbol, Date, Quantity, Price)
+ Displays the data in a table format

### Timeline and Development Plan: 

| Milestone     | Date          | Description  | In-Charge |
| ------------- | ------------- | ------------ | --------- |
| 3   | 28/6 - 17/7 | Plot a chart on realised P&L against time <br /> Able to display financial news <br /> Filtering news to user’s holdings | Bryan <br /> Ying Jie |
| 3 | 18/7 - 25/7      |   UI / UX enhancements <br /> Tidying up of code & fixing bugs | Bryan <br /> Ying Jie |





## How to use our web app: 
Go to our web app: https://master.daain0yesm9fy.amplifyapp.com 
Sign in to our webapp with your email and password if you are an existing user. If you are not an existing user, you may want to sign up for a new account with us via the sign up link. 
(NOTE: If u have previously signed up with us during Milestone 1, please kindly sign up for a new account for Milestone 2 as there are new features that are not initialised in your previous Milestone 1 account settings)
After logging into the account, you will be redirected to the dashboard where you will see your email username on the top right hand corner of the web app
Once there, any of the icons on the sidebar will route you to the other pages that we have in our web app. Currently, the cash, stocks, crypto & history pages are fully ready for testing. Parts of the dashboard & charts page are enabled.
[Please refer to the patch updates above to see which features are currently enabled]
Once done, the user can simply click on the logout icon button on the sidebar to exit from our web app and he / she will be redirected to the login page.

## Work Log: 
https://docs.google.com/spreadsheets/d/1aM_a9qod_enT3JA0SUo_tSakVWYWPVw3hAc1Ejy9KHc/edit?usp=sharing 
