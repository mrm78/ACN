import React, { useState, useEffect } from "react";
import axios from "axios";
import Const from "../../static/CONST";
import { useHistory } from "react-router-dom";
import {
  makeStyles,
  Dialog,
  ButtonGroup,
  Button,
  ThemeProvider,
  createMuiTheme,
  Grid,
  MenuItem,
  TextField,
  Avatar,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormLabel,
  Paper,
  Snackbar,
  Portal,

} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Add, Remove } from "@material-ui/icons";
import DateFnsUtils from "@date-io/date-fns";

const useStyle = makeStyles((theme) => ({
  dialog: {
    padding: theme.spacing(2),
  },
  paper: {
    maxHeight: "200px",
  },
  pop: {
    zIndex: "15000",
  },
  Gp: {
    position: "absolute",
    top: "10px",
    left: "10px",
  },
  tagContainer: {
    overflow: 'auto',
    maxHeight:'205px',
    border: '1.5px solid rgba(120,120,120,0.5)',
    borderRadius: '5px'
  },
  errorTexts: {
    color: "#f00",
    fontSize: 12,
  },
  tagLabel: {
    marginLeft: theme.spacing(2)
  },
  tags: {
    marginLeft: theme.spacing(2)
  },
  avatar: {
    width: 80,
    height: 80,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  avatarPaper: {
    borderRadius: "50%",
    height: 90,
    width: 90,
    margin:'auto',
    position: "relative",
    left: '50%',
    top:'50%',
    boxShadow: "0 0 5px rgba(0,0,0,0.5)",
    transform: "translate(-50%, 0%)",
    margin: theme.spacing(1),
    backgroundImage:
      "linear-gradient(to right, #4040ce 0%, #4040ce 50%, white 50%, white 100%)",
    // backgroundSize: "100% 50px, 50%",
  },
  buttonContainer: {
  margin: theme.spacing(2),
},
button: {
  margin: 0,
}
}));

const theme = createMuiTheme({
  palette: {
    secondary: { main: "rgb(206, 64, 64)" },
  },
});

export default function CreateCommunity(props) {
  const history = useHistory();
  const classes = useStyle();
  const [Title, setTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [Desc, setDesc] = useState("");
  const [tags, setTags] = useState();
  const [ttl, setTtl] = useState();
  const [err, setErr] = useState("");
  const initialStates = {
    title: "",
    description: ""
  };
  const [values, setValues] = useState(initialStates);
  const [avatar, setAvatar] = useState();
  const [selected, setSelected] = useState([]);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };


  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    if (prop === "title") {
      setTtl(event.target.value);
    }
  };

  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    setValues({ ...values, ['avatar']: e.target.files[0] });
    setAvatar(URL.createObjectURL(e.target.files[0]));
    //getAvatar(file);
  };


  const handleValidation = () => {
    let titleError = "";

    if (!ttl) {
      titleError = "Community needs a title!";
    }
    setErr({
      titleError
    });
    if (titleError) {
      return false;
    }
    return true;
  };


  const getAvatar = () => {
    setAvatar(props.values.avatar);
  };


  //localStorage.getItem("token")
  async function handleOnClick(event) {
    const isValid = handleValidation();
    if (true) {
      const formData = Const.toFormData({
        title: values.title ? values.title : '',
        description: values.description ? values.description : '',
        tags:JSON.stringify(selected),
        image: values.avatar
      });
      axios.post(`${Const.baseUrl}/community/create_community`, formData, {
        headers : {Authorization: localStorage.getItem("token")}
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.status === "success") {
            history.push(`/community/${res.data.id}`)
          } else {
            if (res.data.error === "empty title") {
              setAlertMessage("You have to enter a title.");
              setOpen(true);
            } else if (res.data.error === "invalid tags") {
              setAlertMessage("These tags do not exist.");
              setOpen(true);
            }
          }
        }
      });
    }
  };

    const handleDelete = (chipToDelete) =>{
        setSelected((chips) => chips.filter((chip) => chip !== chipToDelete));

      };
    const handleAdd = (item) =>{
        if(!item.target.checked){
            handleDelete(item.target.name)
        }
        else{
          setSelected(selected => [ ...selected, item.target.name]);
    }};


  useEffect(() => {
    setValues(props.data);
    axios.get(`${Const.baseUrl}/community/tags`).then((response) => {
      setTags(<div className={classes.tagContainer}>
        <FormLabel className={classes.tagLabel}>Tags</FormLabel>
        <FormGroup>
        {response.data.map((item) =>{
          const Tagbox =
          <FormControlLabel
          control={
          <Checkbox
              name={item['id']}
              color="primary"
              className={classes.tags}
              onChange={handleAdd}
            />}
            label={item['name']}
            />
            ;

            return Tagbox
          })}
          </FormGroup>
      </div>);
      console.log(tags)
    });
  }, []);

  //useEffect(() => getAvatar(), [props.values]);

  return (
    <>
    <Dialog
      open={props.state}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth={"sm"}
    >
      <Grid container className={classes.dialog}>

      <Portal>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          className={classes.alertMessage}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Alert onClose={handleClose} variant="filled" severity="error">
            {alertMessage}
          </Alert>
        </Snackbar>
      </Portal>
      <Grid
        item
        lg={7}
        sm={8}
        xs={10}
        className={classes.errorTexts}
      >
        {err}
      </Grid>


      <Grid style={{ padding: "10px" }} xs={6}>
        <Grid style={{ padding:"10px"}} xs={12}>
        <div style={{width:'100%'}}>
        <Paper elevation={0} className={classes.avatarPaper}>
        <Avatar

              src={avatar}
              className={classes.avatar}
            />
            </Paper>
            </div>
        </Grid>
        <Grid
        item

        xs={12}
        justify="center"
        alignItems="center"
        className={classes.buttonContainer}
      >
        <Grid
          item
          container

          xs={12}
          justify="center"
          alignItems="center"
          className={classes.button}
        >
          <Button
            variant="contained"
            component="label"
            color="primary"
            fullWidth="true"
            style={{backgroundColor:"#4040ce"}}
          >
            Upload
            <input type="file" hidden onChange={handleChangeAvatar} />
          </Button>
        </Grid>
        </Grid>
        <Grid style={{ position: "relative", margin: theme.spacing(2) }} xs={12}>
          {tags}
        </Grid>
        </Grid>
        <Grid style={{ padding: "10px" }} xs={6}>
        <Grid style={{ padding: "10px" }} xs={12}>
          <TextField
            onChange={handleChange("title")}
            size={"small"}
            fullWidth="true"
            placeholder="Title"
            label="Title"
            variant="outlined"
            style={{marginTop: "30px"}}
          />
        </Grid>
        <Grid style={{ padding: "10px" }} xs={12}>
          <TextField
            onChange={handleChange("description")}
            multiline
            rows={12}
            fullWidth="true"
            placeholder="Description"
            label="Description"
            variant="outlined"
            style={{marginTop: "40px"}}
          />
        </Grid>
        </Grid>


        <Grid style={{ padding: "10px" }} xs={12}>
          <ThemeProvider theme={theme}>
            <Button
              onClick={() => handleOnClick()}
              fullWidth="true"
              variant="contained"
              color="primary"
              style={{backgroundColor:"#4040ce"}}
            >
              Create Community
            </Button>
          </ThemeProvider>
        </Grid>
      </Grid>
    </Dialog>
    <Portal>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        className={classes.alertMessage}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert onClose={handleClose} variant="filled" severity="error">
          {alertMessage}
        </Alert>
      </Snackbar>
    </Portal>
    </>
  )
};
