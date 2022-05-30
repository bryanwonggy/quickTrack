import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import FeedIcon from "@mui/icons-material/Feed";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";


export default function MainListItems() {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      console.log("Logged out")
    } catch (e) {
      console.log(e.message)
    }
  }

  
  return (
    <React.Fragment>
    <ListItemButton component={Link} to="/Dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/Cash">
      <ListItemIcon>
        <AttachMoneyIcon />
      </ListItemIcon>
      <ListItemText primary="Add/Withdraw Cash"/>
    </ListItemButton>
    <ListItemButton component={Link} to="/Stocks">
      <ListItemIcon>
        <ShowChartIcon />
      </ListItemIcon>
      <ListItemText primary="Buy/Sell Stocks" />
    </ListItemButton>
    <ListItemButton component={Link} to="/Crypto">
      <ListItemIcon>
        <CurrencyBitcoinIcon />
      </ListItemIcon>
      <ListItemText primary="Buy/Sell Crypto" />
    </ListItemButton>
    <ListItemButton component={Link} to="/Charts">
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Charts" />
    </ListItemButton>
    <ListItemButton component={Link} to="/News">
      <ListItemIcon>
        <FeedIcon />
      </ListItemIcon>
      <ListItemText primary="News" />
    </ListItemButton>
    <ListItemButton component={Link} to="/History">
      <ListItemIcon>
        <HistoryIcon />
      </ListItemIcon>
      <ListItemText primary="History" />
    </ListItemButton>
    <ListItemButton onClick={handleLogout}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  </React.Fragment>
  )
}