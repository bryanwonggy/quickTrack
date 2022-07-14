import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MainListItems from "../Sidebar/listItems";
import Chart from "../Dashboard/Chart";
import Deposits from "../Dashboard/Deposits";
import Orders from "../Dashboard/Orders";
import { UserAuth } from "../../context/AuthContext";
import axios from "axios";
import NewsItem from "./NewsItem";
import { NewsContextProvider } from "./NewsContext";
import News from "./News"

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#3f50b5",
    },
  },
});

function DashboardContent() {
  //MAIN CODE HERE
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const { user, logout } = UserAuth();
  const API_KEY = "R8QVYYFNVOKVRKP4"; //AlphaVantage
  const API_KEY_2 = "AQ84YYYGZLMH5O2S";
  const API_KEY_3 = "T7GOS9UY9JV7Y6QF";
  const [stockNews, updateStockNews] = React.useState([]);
  const [cryptoNews, updateCryptoNews] = React.useState({});
  const tempStockNews = [];
  var APICallString = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=${API_KEY_2}`;

  // function searchForStock(event) {
  //   var APICallString = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=${API_KEY_2}`; //check AlphaVantage API (outputsize=full for full 20years data)

  //   axios //NEW FOR STOCK INFO
  //     .get(APICallString)
  //     .then(function (response) {
  //       for (let i = 0; i < 50; i++) {
  //         tempStockNews.push(response.data.feed[i]);
  //       }
  //       updateStockNews(tempStockNews)
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }

  // searchForStock();
  // console.log(stockNews)
  // const searchForNews = async () => {
  //   try {
  //     const response = await axios.get(APICallString).then(function (response) {
  //       for (let i = 0; i < 10; i++) {
  //         tempStockNews.push(response.data.feed[i]);
  //       }
  //     });
  //     updateStockNews(tempStockNews);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // searchForNews()
  // console.log("one");
  // console.log(stockNews);
  // console.log("two");

  // React.useEffect(() => {
  //   const getStockArticles = async () => {
  //     const response = await axios.get(APICallString).then(function (response) {
  //       for (let i = 0; i < 12; i++) {
  //         tempStockNews.push(response.data.feed[i])
  //       }
  //     });
  //     updateStockNews(tempStockNews)
  //   };
  //   // getStockArticles().then(function (response) {
  //   //   for (let i = 0; i < 12; i++) {
  //   //     tempStockNews.push(response.data.feed[i]);
  //   //   }
  //   // }).then;
  //   getStockArticles();
  // })

  // React.useEffect(() => {
  //   axios
  //     .get(APICallString)
  //     .then((response) => updateStockNews(response.data.feed))
  //     .catch((error) => console.log(error));
  // }, [stockNews]);

  // console.log("here");
  // console.log(tempStockNews);
  // console.log("there");
  // console.log(stockNews);

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} style={{ background: "#000" }}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              News
            </Typography>
            {user && user.email}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <NewsContextProvider>
            <News />
          </NewsContextProvider>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
