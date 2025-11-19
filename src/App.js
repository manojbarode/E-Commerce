import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Categories", to: "/products" },
    { label: "Offers", to: "/offers" },
    { label: "Seller", to: "/seller" },
    { label: "Help", to: "/help" },
  ];

  const toggleDrawer = () => setOpen(!open);

  return (
    <>
      <AppBar position="sticky" elevation={2} sx={{ background: "#fff", color: "#000" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

          {/* LOGO */}
          <Box sx={{ fontSize: "28px", fontWeight: 800, color: "#2563eb" }}>
            ShopsyClone
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 4 }}>
            {navItems.map((item, i) => (
              <Box
                key={i}
                component={Link}
                to={item.to}
                sx={{
                  textDecoration: "none",
                  color: "#555",
                  fontWeight: 500,
                  position: "relative",
                  "&:hover": { color: "#2563eb" },
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: -3,
                    height: "3px",
                    width: "0%",
                    background:
                      i === 0
                        ? "linear-gradient(to right, #60a5fa, #2563eb)"
                        : i === 1
                        ? "linear-gradient(to right, #c084fc, #9333ea)"
                        : i === 2
                        ? "linear-gradient(to right, #f87171, #ef4444)"
                        : i === 3
                        ? "linear-gradient(to right, #34d399, #059669)"
                        : "linear-gradient(to right, #fb7185, #ec4899)",
                    transition: "0.4s",
                  },
                  "&:hover:after": { width: "100%" },
                }}
              >
                {item.label}
              </Box>
            ))}
          </Box>

          {/* Desktop Search */}
          <Paper
            component="form"
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              px: 2,
              py: 0.6,
              width: 300,
              borderRadius: "30px",
              border: "1px solid #ccc",
              transition: "0.3s",
              "&:focus-within": {
                boxShadow: "0 0 10px rgba(37, 99, 235, 0.5)",
                borderColor: "#2563eb",
              },
            }}
          >
            <SearchIcon sx={{ mr: 1, color: "#555" }} />
            <InputBase placeholder="Search for products, brands..." sx={{ width: "100%" }} />
          </Paper>

          {/* Desktop Icons */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, fontSize: "26px" }}>
            <IconButton component={Link} to="/wishlist">
              <FavoriteIcon sx={{ color: "#2563eb" }} />
            </IconButton>

            <IconButton component={Link} to="/cart">
              <ShoppingCartIcon sx={{ color: "#2563eb" }} />
            </IconButton>

            <IconButton component={Link} to="/profile">
              <AccountCircleIcon sx={{ color: "#2563eb" }} />
            </IconButton>
          </Box>

          {/* MOBILE MENU ICON */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 2 }}>
            <IconButton>
              <SearchIcon />
            </IconButton>

            <IconButton component={Link} to="/cart">
              <ShoppingCartIcon />
            </IconButton>

            <IconButton onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 260, p: 2 }}>
          {/* Mobile Search */}
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              borderRadius: "30px",
              mb: 2,
            }}
          >
            <SearchIcon sx={{ mr: 1 }} />
            <InputBase placeholder="Search..." sx={{ width: "100%" }} />
          </Paper>

          <List>
            {navItems.map((item, i) => (
              <ListItem button component={Link} to={item.to} key={i} onClick={toggleDrawer}>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}

            <Divider sx={{ my: 1 }} />

            {/* Mobile icons */}
            <Box sx={{ display: "flex", justifyContent: "space-around", pt: 2 }}>
              <FavoriteIcon />
              <ShoppingCartIcon />
              <AccountCircleIcon />
            </Box>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
