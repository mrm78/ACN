import React, { useState, useEffect } from "react";
import axios from "axios";
import Const from "../../static/CONST";
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
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormLabel,

} from "@material-ui/core";
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
    maxHeight:'200px',
    border: '1.5px solid rgba(120,120,120,0.5)',
    borderRadius: '5px'
  },
  tagLabel: {
    marginLeft: theme.spacing(2)
  },
  tags: {
    marginLeft: theme.spacing(2)
  }
}));

const theme = createMuiTheme({
  palette: {
    secondary: { main: "rgb(206, 64, 64)" },
  },
});

export default function EditEvent(props) {
  const classes = useStyle();
  const [Title, setTitle] = useState("");
  const [Desc, setDesc] = useState("");
  const [tags, setTags] = useState();
  const [values, setValues] = useState({});
  const [selected, setSelected] = useState([]);


  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };


  //localStorage.getItem("token")
  const handleOnClick = () => {

    const formData = Const.toFormData({
      title: values.title ? values.title : '',
      description: values.description ? values.description : '',
      tags:JSON.stringify(selected)

    });
    console.log(formData);
    axios.post(`${Const.baseUrl}/community/create_community`, formData, {
      headers : {Authorization: localStorage.getItem("token")}
    }).then((res) => {
      console.log(res.data);
      console.log(selected)
    });
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

  return (
    <Dialog
      open={props.state}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth={"sm"}
    >
      <Grid container className={classes.dialog}>
      <Grid style={{ padding: "10px" }} xs={6}>
        <Grid style={{ padding: "10px" }} xs={12}>
          <TextField
            onChange={handleChange("title")}
            size={"small"}
            fullWidth="true"
            placeholder="Title"
            label="Title"
            variant="outlined"
          />
        </Grid>
        <Grid style={{ padding: "10px" }} xs={12}>
          <TextField
            onChange={handleChange("description")}
            multiline
            rows={5}
            fullWidth="true"
            placeholder="Description"
            label="Description"
            variant="outlined"
          />
        </Grid>
        </Grid>
        <Grid style={{ position: "relative", padding: "10px" }} xs={6}>
          {tags}
        </Grid>


        <Grid style={{ padding: "10px" }} xs={12}>
          <ThemeProvider theme={theme}>
            <Button
              onClick={() => handleOnClick()}
              fullWidth="true"
              variant="contained"
              color="primary"
            >
              Create Community
            </Button>
          </ThemeProvider>
        </Grid>
      </Grid>
    </Dialog>
  )
};
