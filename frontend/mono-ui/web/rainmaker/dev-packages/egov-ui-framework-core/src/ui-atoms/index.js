import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "./LinearSpinner";
import AppBar from "./Appbar";
const Loading = () => <LinearProgress />;

const Div = Loadable({
  loader: () => import("./HtmlElements/Div"),
  loading: () => <Loading />
});
const Form = Loadable({
  loader: () => import("./HtmlElements/Form"),
  loading: () => <Loading />
});

const Main = Loadable({
  loader: () => import("./HtmlElements/Main"),
  loading: () => <Loading />
});
const Typegraphy = Loadable({
  loader: () => import("./Typegraphy"),
  loading: () => <Loading />
});
const Container = Loadable({
  loader: () => import("./Layout/Container"),
  loading: () => <Loading />
});
const Item = Loadable({
  loader: () => import("./Layout/Item"),
  loading: () => <Loading />
});
const Card = Loadable({
  loader: () => import("./Card"),
  loading: () => <Loading />
});
const CardContent = Loadable({
  loader: () => import("./CardContent"),
  loading: () => <Loading />
});
const CardMedia = Loadable({
  loader: () => import("./CardMedia"),
  loading: () => <Loading />
});
const Phonenumber = Loadable({
  loader: () => import("./TextFields/Phonenumber"),
  loading: () => <Loading />
});
const Text = Loadable({
  loader: () => import("./TextFields/Text"),
  loading: () => <Loading />
});
const Button = Loadable({
  loader: () => import("./Button"),
  loading: () => <Loading />
});
const Break = Loadable({
  loader: () => import("./UtilityElement/Break"),
  loading: () => <Loading />
});
const Icon = Loadable({
  loader: () => import("./Icon"),
  loading: () => <Loading />
});
const InputAdornment = Loadable({
  loader: () => import("./InputAdornment"),
  loading: () => <Loading />
});
const Drawer = Loadable({
  loader: () => import("./Drawer"),
  loading: () => <Loading />
});
const Toolbar = Loadable({
  loader: () => import("./ToolBar"),
  loading: () => <Loading />
});
const List = Loadable({
  loader: () => import("./Lists/List"),
  loading: () => <Loading />
});
const ListItem = Loadable({
  loader: () => import("./Lists/ListItem"),
  loading: () => <Loading />
});
const ListItemIcon = Loadable({
  loader: () => import("./Lists/ListItemIcon"),
  loading: () => <Loading />
});
const ListItemText = Loadable({
  loader: () => import("./Lists/ListItemText"),
  loading: () => <Loading />
});
const Label = Loadable({
  loader: () => import("./UtilityElement/Label"),
  loading: () => <Loading />
});

const Iframe = Loadable({
  loader: () => import("./HtmlElements/Iframe"),
  loading: () => <Loading />
});

const Snackbar = Loadable({
  loader: () => import("./Snackbar"),
  loading: () => <Loading />
});
const UploadFile = Loadable({
  loader: () => import("./UploadFile"),
  loading: () => <Loading />
});

const UploadedDocument = Loadable({
  loader: () => import("./UploadedDocument"),
  loading: () => <Loading />
});

const MenuButton = Loadable({
  loader: () => import("./MenuButton"),
  loading: () => <Loading />
});

const AutoSuggest = Loadable({
  loader: () => import("./AutoSuggest"),
  loading: () => <Loading />
});

const MapLocation = Loadable({
  loader: () => import("./MapLocation"),
  loading: () => <Loading />
});
const CountdownTimer = Loadable({
  loader: () => import("./CountdownTimer"),
  loading: () => <Loading />
});

const AckHeader = Loadable({
  loader: () => import("./AckHeader"),
  loading: () => <Loading />
});

const AckBody = Loadable({
  loader: () => import("./AckBody"),
  loading: () => <Loading />
});

const AckFooter = Loadable({
  loader: () => import("./AckFooter"),
  loading: () => <Loading />
});

const ApplicationNumber = Loadable({
  loader: () => import("./ApplicationNumber"),
  loading: () => <Loading />
});

export {
  Div,
  Form,
  Main,
  AppBar,
  Typegraphy,
  Container,
  Item,
  Card,
  CardContent,
  CardMedia,
  Phonenumber,
  Text,
  Button,
  Break,
  Icon,
  InputAdornment,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Label,
  LinearProgress,
  Iframe,
  Snackbar,
  UploadFile,
  UploadedDocument,
  MenuButton,
  AutoSuggest,
  MapLocation,
  CountdownTimer,
  AckHeader,
  AckBody,
  AckFooter,
  ApplicationNumber
};
