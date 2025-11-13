"use strict";

exports.__esModule = true;

var material_1 = require("@mui/material");

var react_router_dom_1 = require("react-router-dom");

var ArrowBack_1 = require("@mui/icons-material/ArrowBack");

var Settings_1 = require("@mui/icons-material/Settings");

var AccountCircle_1 = require("@mui/icons-material/AccountCircle");

var icons_material_1 = require("@mui/icons-material");

var react_1 = require("react");

var useAuth_1 = require("@/hooks/useAuth");

var stringToColor = function stringToColor(str) {
  var hash = 0;

  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return "hsl(" + hash % 360 + ", 60%, 60%)";
};

var AppHeader = function AppHeader() {
  var theme = material_1.useTheme();
  var navigate = react_router_dom_1.useNavigate();
  var location = react_router_dom_1.useLocation();
  var shouldShowBack = location.pathname.startsWith("/vincent/");

  var _a = useAuth_1.useAuth(),
      user = _a.user,
      logout = _a.logout,
      isLoading = _a.isLoading;

  var isLoggedIn = !!user;

  var _b = react_1.useState(null),
      anchorEl = _b[0],
      setAnchorEl = _b[1];

  var open = Boolean(anchorEl);
  var avatarDetails = react_1.useMemo(function () {
    var _a, _b;

    var nickname = (_a = user === null || user === void 0 ? void 0 : user.nickname) !== null && _a !== void 0 ? _a : "Guest";
    var letter = ((_b = nickname.charAt(0)) === null || _b === void 0 ? void 0 : _b.toUpperCase()) || "G";
    return {
      color: stringToColor(nickname),
      letter: letter
    };
  }, [user]);

  var handleMenuOpen = function handleMenuOpen(event) {
    return setAnchorEl(event.currentTarget);
  };

  var handleMenuClose = function handleMenuClose() {
    return setAnchorEl(null);
  };

  var handleLogoutClick = function handleLogoutClick() {
    logout();
    handleMenuClose();
    navigate("/search");
  };

  var handleLoginClick = function handleLoginClick() {
    return navigate("/auth");
  };

  var goBack = function goBack() {
    return navigate("/search" + location.search);
  };

  return React.createElement(material_1.AppBar, {
    position: "absolute",
    color: "transparent",
    sx: {
      boxShadow: "none",
      height: 40,
      zIndex: 999
    }
  }, React.createElement(material_1.Toolbar, {
    sx: {
      bgcolor: "transparent"
    }
  }, shouldShowBack ? React.createElement(material_1.Box, {
    display: "flex",
    alignItems: "center",
    onClick: goBack,
    sx: {
      mr: 2,
      cursor: "pointer",
      color: "black"
    }
  }, React.createElement(ArrowBack_1["default"], null)) : React.createElement(material_1.Box, {
    sx: {
      width: 30,
      mr: 2
    }
  }), React.createElement(material_1.Typography, {
    component: react_router_dom_1.Link,
    to: "/",
    sx: {
      color: "black",
      fontWeight: 500,
      textDecoration: "none",
      fontSize: {
        xs: "1rem",
        sm: "1rem",
        md: "1.25rem"
      }
    }
  }, "\u68B5\xB7\u9AD8\u6863\u6848\u9986"), React.createElement(material_1.Box, {
    sx: {
      display: "flex",
      alignItems: "center",
      ml: "auto"
    }
  }, isLoading ? React.createElement(material_1.CircularProgress, {
    size: 24,
    sx: {
      color: "gray"
    }
  }) : isLoggedIn ? React.createElement(React.Fragment, null, React.createElement(material_1.IconButton, {
    onClick: handleMenuOpen,
    size: "small",
    sx: {
      ml: 2,
      p: 0
    }
  }, React.createElement(material_1.Avatar, {
    sx: {
      width: 40,
      height: 40,
      bgcolor: avatarDetails.color,
      color: "white",
      fontWeight: 600
    }
  }, avatarDetails.letter)), React.createElement(material_1.Menu, {
    anchorEl: anchorEl,
    id: "account-menu",
    open: open,
    onClose: handleMenuClose,
    transformOrigin: {
      horizontal: "right",
      vertical: "top"
    },
    anchorOrigin: {
      horizontal: "right",
      vertical: "bottom"
    }
  }, React.createElement(material_1.MenuItem, {
    disabled: true
  }, React.createElement(material_1.Avatar, {
    sx: {
      bgcolor: avatarDetails.color,
      color: "white",
      mr: 1
    }
  }, avatarDetails.letter), (user === null || user === void 0 ? void 0 : user.nickname) || "User"), React.createElement("hr", {
    style: {
      margin: "4px 0",
      border: "none",
      borderTop: "1px solid #eee"
    }
  }), React.createElement(material_1.MenuItem, {
    onClick: handleMenuClose
  }, React.createElement(material_1.ListItemIcon, null, React.createElement(AccountCircle_1["default"], {
    fontSize: "small"
  })), "\u6211\u7684\u4E3B\u9875"), React.createElement(material_1.MenuItem, {
    onClick: handleMenuClose
  }, React.createElement(material_1.ListItemIcon, null, React.createElement(Settings_1["default"], {
    fontSize: "small"
  })), "\u8BBE\u7F6E"), React.createElement("hr", {
    style: {
      margin: "4px 0",
      border: "none",
      borderTop: "1px solid #eee"
    }
  }), React.createElement(material_1.MenuItem, {
    onClick: handleLogoutClick
  }, React.createElement(material_1.ListItemIcon, null, React.createElement(icons_material_1.Logout, {
    fontSize: "small"
  })), "\u6CE8\u9500"))) : React.createElement(material_1.Button, {
    onClick: handleLoginClick,
    variant: "contained",
    disableElevation: true,
    sx: {
      textTransform: 'none',
      borderRadius: 1,
      padding: '5px 25px',
      fontSize: '1rem',
      fontWeight: 600,
      backgroundColor: '#2e74b6ff',
      color: 'white',
      transition: 'background-color 0.2s ease-out',
      '&:hover': {
        backgroundColor: '#2a6ba8ff',
        boxShadow: '0 0 10px 3px rgba(39, 101, 160, 0.2)'
      }
    }
  }, "\u767B\u5F55"))));
};

exports["default"] = AppHeader;