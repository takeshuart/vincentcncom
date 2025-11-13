"use strict";

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var __spreadArrays = void 0 && (void 0).__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

exports.__esModule = true;

var react_1 = require("react");

var react_router_dom_1 = require("react-router-dom");

var material_1 = require("@mui/material");

require("react-photo-view/dist/react-photo-view.css");

var useArtworkDetails_1 = require("../hooks/useArtworkDetails");

var ArtworkImage_1 = require("../components/ArtworkImage");

var ArrowBackIos_1 = require("@mui/icons-material/ArrowBackIos");

var ArtworkSections_1 = require("../components/ArtworkSections");

var icons_material_1 = require("@mui/icons-material");

var Favorite_1 = require("@mui/icons-material/Favorite");

var FavoriteBorder_1 = require("@mui/icons-material/FavoriteBorder");

var useSearchContextNavigation_1 = require("../hooks/useSearchContextNavigation");

var useAuth_1 = require("@/hooks/useAuth");

var react_hot_toast_1 = require("react-hot-toast");

var useFavorite_1 = require("@/hooks/useFavorites");

var titleStyle = {
  fontWeight: 600,
  lineHeight: 2,
  fontFamily: 'Microsoft YaHei',
  fontSize: {
    xs: 18,
    md: 18
  },
  color: '#333'
};

var DetailsPage = function DetailsPage() {
  var isMobile = material_1.useMediaQuery('(max-width:600px)');
  var addFavoriteMutation = useFavorite_1.useAddFavoriteMutation();
  var removeFavoriteMutation = useFavorite_1.useRemoveFavoriteMutation();
  var id = react_router_dom_1.useParams().id;
  var user = useAuth_1.useAuth().user;
  var navigate = react_router_dom_1.useNavigate();
  var artworkId = id;

  var _a = useArtworkDetails_1["default"](artworkId),
      artwork = _a.artwork,
      extLinks = _a.extLinks,
      activeSection = _a.activeSection,
      lettersData = _a.lettersData,
      isLoadingLetters = _a.isLoadingLetters,
      isLoadingArtwork = _a.isLoadingArtwork,
      sections = _a.sections,
      setActiveSection = _a.setActiveSection;

  var _b = react_1.useState(artwork === null || artwork === void 0 ? void 0 : artwork.isFavorited),
      isFavorited = _b[0],
      setIsFavorited = _b[1];

  var _c = useSearchContextNavigation_1["default"](id),
      canGoNext = _c.canGoNext,
      canGoPrev = _c.canGoPrev,
      goToNext = _c.goToNext,
      goToPrev = _c.goToPrev;

  var handleToggleFavorite = function handleToggleFavorite() {
    return __awaiter(void 0, void 0, void 0, function () {
      var variables, error_1, errorMessage;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!user) {
              navigate('/auth');
              return [2
              /*return*/
              ];
            } //optimistic UI: Update the local status first and do not wait for the server's result


            setIsFavorited(function (prev) {
              return !prev;
            });
            _a.label = 1;

          case 1:
            _a.trys.push([1, 6,, 7]);

            variables = {
              userId: user.userId,
              artworkId: artworkId
            };
            if (!isFavorited) return [3
            /*break*/
            , 3];
            return [4
            /*yield*/
            , removeFavoriteMutation.mutateAsync(variables)];

          case 2:
            _a.sent();

            return [3
            /*break*/
            , 5];

          case 3:
            return [4
            /*yield*/
            , addFavoriteMutation.mutateAsync(variables)];

          case 4:
            _a.sent();

            _a.label = 5;

          case 5:
            return [3
            /*break*/
            , 7];

          case 6:
            error_1 = _a.sent(); //rollback 

            setIsFavorited(function (prev) {
              return !prev;
            });
            errorMessage = isFavorited ? '取消收藏失败' : '收藏失败';
            console.error(errorMessage, error_1);
            react_hot_toast_1["default"].error(errorMessage);
            return [3
            /*break*/
            , 7];

          case 7:
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  var renderContent = function renderContent() {
    if (!artwork) return null;

    switch (activeSection) {
      case 'overview':
        return react_1["default"].createElement(ArtworkSections_1.ArtworkOverview, {
          artwork: artwork,
          extLinks: extLinks
        });

      case 'letters':
        return react_1["default"].createElement(ArtworkSections_1.ArtworkLetters, {
          isLoading: isLoadingLetters,
          lettersData: lettersData
        });

      case 'exhibition':
        return react_1["default"].createElement(ArtworkSections_1.ArtworkExhibition, {
          exhibitions: artwork.exhibitionHistory
        });

      case 'provenance':
        return react_1["default"].createElement(material_1.Typography, null, artwork.provenance || '暂无作品出处信息。');

      case 'references':
        return react_1["default"].createElement(material_1.Typography, null, artwork.references || '暂无参考文献。');

      default:
        return null;
    }
  };

  if (!isLoadingArtwork && !artwork) {
    return react_1["default"].createElement(material_1.Box, {
      sx: {
        p: 5,
        textAlign: 'center'
      }
    }, "\u672A\u80FD\u52A0\u8F7D\u4F5C\u54C1\u8BE6\u60C5\u3002");
  }

  var renderFavoriteButton = function renderFavoriteButton() {
    // const isMutating = addFavoriteMutation.isPending || removeFavoriteMutation.isPending;
    if (isLoadingArtwork) {
      return react_1["default"].createElement(material_1.Skeleton, {
        variant: "circular",
        width: 40,
        height: 40,
        sx: {
          ml: 1
        }
      });
    }

    var IconComponent = isFavorited ? Favorite_1["default"] : FavoriteBorder_1["default"];
    var tooltipText = isFavorited ? '取消收藏' : user ? '收藏' : '登录后收藏';
    return react_1["default"].createElement(material_1.IconButton, {
      onClick: handleToggleFavorite,
      "aria-label": tooltipText,
      sx: {
        color: '#C93636',
        ml: 1
      }
    }, react_1["default"].createElement(IconComponent, {
      sx: {
        fontSize: 30
      }
    }));
  };

  return react_1["default"].createElement(material_1.Grid, {
    container: true,
    justifyContent: "center",
    sx: {
      paddingTop: 10
    }
  }, react_1["default"].createElement(material_1.Box, {
    sx: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      height: isMobile ? '80vh' : 650,
      backgroundColor: '#fafafa'
    }
  }, isLoadingArtwork ? react_1["default"].createElement(material_1.Skeleton, {
    variant: "rectangular",
    width: isMobile ? '100%' : 600,
    height: isMobile ? '80vh' : 650,
    sx: {
      borderRadius: 2
    }
  }) : react_1["default"].createElement(ArtworkImage_1["default"], {
    src: artwork === null || artwork === void 0 ? void 0 : artwork.primaryImageMedium,
    isMobile: isMobile
  }), !isLoadingArtwork && canGoPrev && react_1["default"].createElement(material_1.Box, {
    onClick: goToPrev,
    sx: __assign(__assign({}, NAV_BUTTON_STYLE), {
      left: '5%'
    })
  }, react_1["default"].createElement(ArrowBackIos_1["default"], {
    fontSize: "small",
    sx: __assign({}, ARROWICON)
  })), !isLoadingArtwork && canGoNext && react_1["default"].createElement(material_1.Box, {
    onClick: goToNext,
    sx: __assign(__assign({}, NAV_BUTTON_STYLE), {
      right: '5%'
    })
  }, react_1["default"].createElement(icons_material_1.ArrowForwardIos, {
    fontSize: "small",
    sx: __assign({}, ARROWICON)
  }))), react_1["default"].createElement(material_1.Grid, {
    container: true,
    justifyContent: "center"
  }, react_1["default"].createElement(material_1.Grid, {
    item: true,
    xs: 10,
    sm: 8,
    md: 6
  }, react_1["default"].createElement(material_1.Divider, {
    sx: {
      my: 3
    }
  }), react_1["default"].createElement(material_1.Box, {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }, react_1["default"].createElement(material_1.Box, {
    flexGrow: 1
  }, isLoadingArtwork ? react_1["default"].createElement(react_1["default"].Fragment, null, react_1["default"].createElement(material_1.Skeleton, {
    width: "60%",
    height: 30
  }), react_1["default"].createElement(material_1.Skeleton, {
    width: "40%",
    height: 20
  })) : react_1["default"].createElement(react_1["default"].Fragment, null, react_1["default"].createElement(material_1.Typography, {
    sx: titleStyle
  }, (artwork === null || artwork === void 0 ? void 0 : artwork.titleZh) || (artwork === null || artwork === void 0 ? void 0 : artwork.titleEn)), react_1["default"].createElement(material_1.Typography, {
    color: "#999595ff",
    fontWeight: 600,
    sx: {
      mb: 2,
      fontSize: 14
    }
  }, artwork === null || artwork === void 0 ? void 0 : artwork.displayDate))), !isLoadingArtwork && renderFavoriteButton()))), react_1["default"].createElement(material_1.Grid, {
    container: true,
    justifyContent: "center"
  }, react_1["default"].createElement(material_1.Grid, {
    item: true,
    xs: 10,
    sm: 8,
    md: 6
  }, isLoadingArtwork ? react_1["default"].createElement(react_1["default"].Fragment, null, react_1["default"].createElement(material_1.Skeleton, {
    width: "100%",
    height: 20
  }), react_1["default"].createElement(material_1.Skeleton, {
    width: "90%",
    height: 20
  }), react_1["default"].createElement(material_1.Skeleton, {
    width: "80%",
    height: 20
  })) : (artwork === null || artwork === void 0 ? void 0 : artwork.shortDesc) && react_1["default"].createElement(material_1.Box, {
    sx: {
      mb: 3,
      mt: 3
    }
  }, react_1["default"].createElement(material_1.Typography, null, artwork.shortDesc)))), react_1["default"].createElement(material_1.Grid, {
    container: true,
    justifyContent: "center",
    sx: {
      mt: 5,
      mb: 10
    }
  }, react_1["default"].createElement(material_1.Grid, {
    item: true,
    xs: 10,
    sm: 8,
    md: 8
  }, react_1["default"].createElement(material_1.Grid, {
    container: true
  }, !isMobile && react_1["default"].createElement(material_1.Grid, {
    item: true,
    md: 2,
    sx: {
      pr: 3,
      borderRight: '1px solid #eee'
    }
  }, isLoadingArtwork ? react_1["default"].createElement(material_1.List, {
    sx: {
      p: 0
    }
  }, __spreadArrays(Array(4)).map(function (_, i) {
    return react_1["default"].createElement(material_1.ListItem, {
      key: i
    }, react_1["default"].createElement(material_1.Skeleton, {
      width: "80%",
      height: 24
    }));
  })) : react_1["default"].createElement(material_1.List, {
    component: "nav",
    sx: {
      p: 0
    }
  }, sections.map(function (section) {
    return react_1["default"].createElement(material_1.ListItem, {
      key: section.id,
      disablePadding: true
    }, react_1["default"].createElement(material_1.ListItemButton, {
      selected: activeSection === section.id,
      onClick: function onClick() {
        return setActiveSection(section.id);
      },
      sx: {
        borderRadius: '4px',
        '&.Mui-selected': {
          backgroundColor: '#f0f0f0',
          borderRight: '3px solid #C93636',
          color: '#C93636',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#e0e0e0'
          }
        },
        py: 1
      }
    }, react_1["default"].createElement(material_1.Typography, {
      variant: "body1"
    }, section.label)));
  }))), react_1["default"].createElement(material_1.Grid, {
    item: true,
    xs: 12,
    md: 10,
    sx: {
      pl: isMobile ? 0 : 3
    }
  }, react_1["default"].createElement(material_1.Box, {
    sx: {
      minHeight: '400px'
    }
  }, isLoadingArtwork ? react_1["default"].createElement(react_1["default"].Fragment, null, react_1["default"].createElement(material_1.Skeleton, {
    width: "100%",
    height: 30
  }), react_1["default"].createElement(material_1.Skeleton, {
    width: "90%",
    height: 20
  }), react_1["default"].createElement(material_1.Skeleton, {
    width: "95%",
    height: 20
  }), react_1["default"].createElement(material_1.Skeleton, {
    width: "85%",
    height: 20
  })) : renderContent()))))), react_1["default"].createElement(material_1.Grid, {
    container: true,
    mt: "50px",
    justifyContent: "center",
    sx: {
      backgroundColor: '#fafafa',
      height: '100px',
      width: '100%',
      py: 3
    }
  }, react_1["default"].createElement(material_1.Typography, {
    alignContent: "center"
  }, "\u68B5\xB7\u9AD8\u6863\u6848\u9986 2024")));
};

exports["default"] = DetailsPage;
var NAV_BUTTON_STYLE = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 100,
  cursor: 'pointer',
  width: '60px',
  height: '60px',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: '50%',
  ml: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 3,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    boxShadow: 4
  },
  '@media (max-width:600px)': {
    width: '40px',
    height: '40px',
    ml: 1,
    boxShadow: 1,
    '&:hover': {
      boxShadow: 2
    }
  }
};
var ARROWICON = {
  ml: 0.5,
  color: '#31d847ff'
};