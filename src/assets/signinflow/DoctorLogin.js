import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Footer from '../../components/Footer';
import { FormControl, InputLabel, MenuItem, Select, useMediaQuery } from '@mui/material';
import { getDoctorOwnProfile, registerDoctor } from '../../Utils/SmartContractUtils';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { MuiOtpInput } from 'mui-one-time-password-input';
import Modal from '@mui/material/Modal';
import { useTheme } from '@emotion/react';


const DoctorLogin = () => {
    const theme = useTheme();
    const fullscreen = useMediaQuery(theme.breakpoints.down('md'));
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "60vw",
        height: "40vh",
        minHeight: "650px",
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        ...(fullscreen && {
            height: '80vh',
            width: '80vw',
        })
    };
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const name = useRef();
    const age = useRef();
    const email = useRef();
    const phone = useRef();
    const grnumber = useRef("G-");
    const specialisation = useRef();
    const [gender, setgender] = useState('');
    const [accounts, setAccounts] = useState([]);

    const [data, setData] = useState();

   
    const [grnumberError, setGrnumberError] = useState({
        error: false,
        message: ""
    });
    const [emailError, setEmailError] = useState({
        error: false,
        message: ""
    });
    const [nameError, setNameError] = useState({
        error: false,
        message: ""
    });
    const [ageError, setAgeError] = useState({
        error: false,
        message: ""
    });
    const [phoneError, setPhoneError] = useState({
        error: false,
        message: ""
    });
    const [specialisationError, setSpecialisationError] = useState({
        error: false,
        message: ""
    });
    const [genderError, setGenderError] = useState({
        error: false,
        message: ""
    });
    const handleGenderChange = (event) => {
        setgender(event.target.value);
    };
    useEffect(() => {

        // Asking if metamask is already present or not
        if (window.ethereum) {
            enqueueSnackbar("Please give access to only one account at a time, otherwise, the first account selected in Metamask would be used to LOGIN!", { variant: "info" })
            window.ethereum
                .request({ method: "eth_requestAccounts" }).then((res) => {
                    if (res.length === 0) {
                        enqueueSnackbar("Please connect at least one account to continue!", { variant: "error" })
                        navigate("/");
                    }
                    else {
                        return res;
                    }
                })
                .then((res) => {
                    setAccounts(res);
                    // console.log(res)
                    const authenticate = async () => {
                        const getProfile = await getDoctorOwnProfile(res[0]);
                        // console.log(getProfile)
                        if (!getProfile || getProfile["name"] === "") {
                            return;
                        }
                        else if (getProfile.message) {
                            enqueueSnackbar(getProfile.message, { variant: "error" });
                            return;
                        }
                        else {
                            const profile = {
                                name: getProfile["name"],
                                age: Number(getProfile["age"]),
                                email: getProfile["email"],
                                mobile: Number(getProfile["mobile"]),
                                gender: getProfile["gender"],
                                grNumber: Number(getProfile["grNum"]),
                                degreeName: getProfile["degreeName"]
                            }
                            sessionStorage.setItem("credential", JSON.stringify({ accountType: "DOCTOR", accountAddress: res[0], profile: profile }))
                            enqueueSnackbar(`Welcome, ${profile.name}`);
                            dispatch({ type: "LOGIN", payload: { accountType: "DOCTOR", accountAddress: res[0], profile: profile } })
                            navigate("/Dashboard");
                        }
                    }
                    authenticate();
                    setIsLoading(false)
                }).catch(err => {
                    enqueueSnackbar("Please Log in to Metamask to Proceed!", { variant: "error" });
                    navigate("/");
                });
        } else {
            enqueueSnackbar("Please install Metamask to Proceed!", { variant: "error" });
            navigate("/");

        }// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = async (event) => 
    {
        event.preventDefault();
        const onlyNumber = Number(grnumber.current.value.substring(2));
        const data1 = { name: name.current.value, age: age.current.value, phone: phone.current.value, email: email.current.value, grnumber: onlyNumber, gender: gender, specialisation: specialisation.current.value };
        let flag = 0;
        if (data1.name === "") {
            setNameError({
                error: true,
                message: "Name cannot be empty"
            });
            flag = 1;
        }
        else {
            setNameError({
                error: false,
                message: ""
            });
        }
        if (data1.age === "" || isNaN(data1.age) || Number(data1.age) < 18 || Number(data1.age) > 100) {
            setAgeError({
                error: true,
                message: "Age should be between 18 and 100"
            });
            flag = 1;
        }
        else {
            setAgeError({
                error: false,
                message: ""
            });
        }
        if (data1.phone === "" || data1.phone.length !== 10 || isNaN(data1.phone)) {
            setPhoneError({
                error: true,
                message: "Phone number should be of 10 digits"
            });
            flag = 1;
        }
        else {
            setPhoneError({
                error: false,
                message: ""
            });
        }
        if (data1.gender === "") {
            setGenderError({
                error: true,
                message: "Select one of the above values"
            });
            flag = 1;
        }
        else {
            setGenderError({
                error: false,
                message: ""
            });
        }
        
        if (grnumber.current.value === "" || (grnumber.current.value.length !== 7) || !grnumber.current.value.startsWith("G-")) {
            setGrnumberError({
                error: true,
                message: "GR Number should be of 5 digits and start with G-"
            });
            flag = 1;
        }
        else {
            setGrnumberError({
                error: false,
                message: ""
            });
        }
        if (!data1.email.includes('@')) {
            setEmailError({
                error: true,
                message: "Enter a valid email address"
            });
            flag = 1;
        }
        else {
            setEmailError({
                error: false,
                message: ""
            });
        }
        if (data1.specialisation === "") {
            setSpecialisationError({
                error: true,
                message: "Specialisation cannot be empty"
            });
            flag = 1;
        }
        else {
            setSpecialisationError({
                error: false,
                message: ""
            });
        }
        if (flag === 1) {
            return;
        }

        const res = await registerDoctor(data1, accounts[0]);
        enqueueSnackbar("Please wait for a few seconds, Registration takes time!", { variant: "info" })
        if (res.message) {
            enqueueSnackbar(res.message, { variant: "error" });
        }

        else {
            setIsLoading(true);
            setTimeout(async () => {
                const getProfile = await getDoctorOwnProfile(accounts[0]);
                if (getProfile.message) {
                    enqueueSnackbar(getProfile.message, { variant: "error" });
                    setIsLoading(false);
                }
                else {
                    const profile = {
                        name: getProfile["name"],
                        age: Number(getProfile["age"]),
                        email: getProfile["email"],
                        mobile: Number(getProfile["mobile"]),
                        gender: getProfile["gender"],
                        grNumber: Number(getProfile["grNum"]),
                        degreeName: getProfile["degreeName"]
                    }
                    setIsLoading(false);
                    sessionStorage.setItem("credential", JSON.stringify({ accountType: "DOCTOR", accountAddress: accounts[0], profile: profile }))
                    enqueueSnackbar(`Welcome, ${profile.name}`);
                    dispatch({ type: "LOGIN", payload: { accountType: "DOCTOR", accountAddress: accounts[0], profile: profile } })
                    navigate("/Dashboard");
                }
            }, 20000)


        }
    };

    const handleFirstSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        let flag = 0;
        // console.log(grnumber.current.value)
        const onlyNumber = Number(grnumber.current.value.substring(2));
        const received = { name: name.current.value, age: age.current.value, email: email.current.value, phone: phone.current.value, grnumber: onlyNumber, specialisation: specialisation.current.value }
        setData(received);
        if (received.phone === "" || received.phone.length !== 10 || isNaN(received.phone)) {
            setPhoneError({
                error: true,
                message: "Phone number should be of 10 digits"
            });
            flag = 1;
        }
        else {
            setPhoneError({
                error: false,
                message: ""
            });
        }
        
        if (grnumber.current.value === "" || (grnumber.current.value.length !== 7) || !grnumber.current.value.startsWith("G-")) {
            setGrnumberError({
                error: true,
                message: "GR Number should be of 5 digits and start with G-"
            });
            flag = 1;
        }
        else {
            setGrnumberError({
                error: false,
                message: ""
            });
        }
        if (received.specialisation === "") {
            setSpecialisationError({
                error: true,
                message: "Specialisation cannot be empty"
            });
            flag = 1;
        }
        else {
            setSpecialisationError({
                error: false,
                message: ""
            });
        }
        if (flag === 1) {
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
    }


    const handleClose = (event, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        setIsLoading(false);
    }
   
    const handleSecondSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const calcAge = Number(age)
        setData({
            ...data, name: name,
            gender: gender,
            age: calcAge,
            email: email
        })

        const newData = {
            ...data,
            name: name,
            gender: gender,
            age: calcAge,
            email: email
        }

        const res = await registerDoctor(newData, accounts[0]);
        enqueueSnackbar("Please wait for a few seconds, Registration takes time!", { variant: "info" })
        if (res.message) {
            enqueueSnackbar(res.message, { variant: "error" });
            setIsLoading(false);
        }
        else {
            setIsLoading(true);
            setTimeout(async () => {
                const getProfile = await getDoctorOwnProfile(accounts[0]);
                if (getProfile.message) {
                    enqueueSnackbar(getProfile.message, { variant: "error" });
                    setIsLoading(false);
                }
                else {
                    const profile = {
                        name: getProfile["name"],
                        age: Number(getProfile["age"]),
                        email: getProfile["email"],
                        mobile: Number(getProfile["mobile"]),
                        gender: getProfile["gender"],
                        grNumber: Number(getProfile["grNum"]),
                        degreeName: getProfile["degreeName"]
                    }
                    setIsLoading(false);
                    sessionStorage.setItem("credential", JSON.stringify({ accountType: "DOCTOR", accountAddress: accounts[0], profile: profile }))
                    enqueueSnackbar(`Welcome, ${profile.name}`);
                    dispatch({ type: "LOGIN", payload: { accountType: "DOCTOR", accountAddress: accounts[0], profile: profile } })
                    navigate("/Dashboard");
                }
            }, 20000)

        }
    }

    return (
        <>
            {isLoading && <Box sx={{ display: 'flex', position: "absolute", top: "48%", left: "48%" }}> <CircularProgress /></Box>}
            {!isLoading && <>
            <Navbar />
                <Container component="main" maxWidth="s">
                    <CssBaseline />
                    {<Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LocalHospitalIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up as Doctor
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, maxWidth: "600px", marginBottom: "60px" }}>
                            <Box component="div" sx={{ display: "flex", gap: "5px" }}><TextField
                                margin="normal"
                                fullWidth
                                name="name"
                                label="Name"
                                type="text"
                                id="name"
                                inputRef={name}
                                error={nameError.error}
                                helperText={nameError.message}
                            />
                                <TextField
                                    margin="normal"
                                    fullWidth
                                    name="age"
                                    label="Age"
                                    type="number"
                                    inputProps={{ inputMode: "numeric", min: "1", max: "120" }}
                                    id="age"
                                    inputRef={age}
                                    error={ageError.error}
                                    helperText={ageError.message}
                                />
                            </Box>
                            <FormControl fullWidth sx={{ marginTop: "8px 0" }} ><InputLabel id="demo-simple-select-label">Gender * </InputLabel><Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={gender}
                                label="Gender"
                                onChange={handleGenderChange}
                                error={genderError.error}
                                helperText={genderError.message}
                            >
                                <MenuItem value={"Male"}>Male</MenuItem>
                                <MenuItem value={"Female"}>Female</MenuItem>
                                <MenuItem value={"Other"}>Other</MenuItem>
                            </Select></FormControl>
                            <TextField
                                margin="normal"
                                fullWidth
                                id="email"
                                label="E-mail"
                                name="email"
                                type='text'
                                inputRef={email}
                                error={emailError.error}
                                helperText={emailError.message}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                id="phone"
                                label="Mobile Number"
                                name="phone"
                                type='text'
                                inputRef={phone}
                                error={phoneError.error}
                                helperText={phoneError.message}
                            />
                            
                            <TextField
                                margin="normal"
                                fullWidth
                                id="GR-number"
                                label="General Registration (G.R.) Number"
                                name="grnumber"
                                type='text'
                                inputRef={grnumber}
                                error={grnumberError.error}
                                helperText={grnumberError.message}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                id="specialisation"
                                label="Specialisation"
                                name="specialisation"
                                inputRef={specialisation}
                                error={specialisationError.error}
                                helperText={specialisationError.message}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            
                        </Box>
                    </Box>
                    }
                    
                </Container>
                    </>
            }
        </>
    );

}

export default DoctorLogin;
