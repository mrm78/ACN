import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import {
  makeStyles,
  useTheme,
  Dialog,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
} from "@material-ui/core";
import AddPost from "./AddPost";
import AddEvent from "./AddEvent";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyle = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: 700,
    backgroundColor: "#888",
  },
}));

export default function DialogBox(props) {
  const classes = useStyle();
  const theme = useTheme();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };


  return (
    <>
      <Dialog
        open={props.state}
        onClose={props.handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth={"sm"}
      >
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="New Post" {...a11yProps(0)} />
            <Tab label="New Event" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <AddPost comId={props.comId}/>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <AddEvent comId={props.comId}/>
          </TabPanel>
        </SwipeableViews>
      </Dialog>
    </>
  );
}
