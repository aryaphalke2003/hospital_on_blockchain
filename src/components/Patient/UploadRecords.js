import React, { useRef, useState } from 'react';
import { MuiFileInput } from 'mui-file-input';
import { Box, Button, Container, CssBaseline, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { uploadRecordByUser } from '../../Utils/SmartContractUtils';
import { useSelector } from 'react-redux';
import { enqueueSnackbar } from 'notistack';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import FormData from 'form-data';

// const projectId = process.env.REACT_APP_PROJECT_ID;
// const projectSecretKey = process.env.REACT_APP_PROJECT_KEY;
// const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);





// const JWT = process.env.JWT_TOKEN;
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyNTMyZDc0YS1jMGM4LTQxZGQtYjlmMC1hYmYyN2QyZmIxZDUiLCJlbWFpbCI6ImFyeWFwaGFsa2UyMDAzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMDExMTA1MDA4YTRmMjVjYWM4ZSIsInNjb3BlZEtleVNlY3JldCI6IjgxMjhhNTA4MWYwY2FjZjQ2MmEzMDEwOTNkMzE4MWNmNzIwOTM1ZDU0MjMwMmI1YzE0YjRiZjNjZDMzYzgwOTkiLCJpYXQiOjE3MDEwNDAyMDZ9.ZnV2x5B6WRD64h4dAFKlyoVBdx9mZtgfC6Nmt6D8jyU';
console.log("jwt");
// console.log(JWT);

const pinFileToIPFS = async (file, name) => {

    const formData = new FormData();
    formData.append('file', file)
    const pinataMetadata = JSON.stringify({
        name: name,
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${JWT}`
            }
        });
        console.log(res.data);
        console.log("success");

        if (res.data && res.data.IpfsHash && res.data.PinSize) {
            return {
                cid: res.data.IpfsHash,
                path: res.data.IpfsPath
            };
        } else {
            throw new Error('Unexpected response format');
        }

    } catch (error) {
        console.log(error);
    }
}

const UploadRecords = () => {
    const [isLoading, setIsLoading] = useState(false);
    const accountAddress = useSelector(state => state.accountAddress);
    const [file, setFile] = useState(null);

    const [docType, setDocType] = useState('');
    const [fileErr, setFileErr] = useState(false);
    const recordname = useRef();
    const docName = useRef();
    const orgName = useRef();
    const [recordNameError, setRecordNameError] = useState({
        error: false,
        message: ""
    });
    const [docNameError, setDocNameError] = useState({
        error: false,
        message: ""
    });
    const [orgNameError, setOrgNameError] = useState({
        error: false,
        message: ""
    });
    const [docTypeError, setDocTypeError] = useState({
        error: false,
        message: ""
    });
    const handleChange = (event) => {
        setDocType(event.target.value);
    };
    const handleFileChange = (val) => {
        setFile(val)
        setFileErr(false);
    }
    const resetHandler = () => {
        setDocType('');
        setFile(null);
    }
    console.log("enter");
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        let flag = 0;
        if (recordname.current.value === "") {
            setRecordNameError({
                error: true,
                message: "Record Name is required"
            })
            flag = 1;
        }
        else {
            setRecordNameError({
                error: false,
                message: ""
            })
        }
        if (docName.current.value === "") {
            setDocNameError({
                error: true,
                message: "Doctor's Name is required"
            })
            flag = 1;
        }
        else {
            setDocNameError({
                error: false,
                message: ""
            })
        }
        if (orgName.current.value === "") {
            setOrgNameError({
                error: true,
                message: "Organisation's Name is required"
            })
            flag = 1;
        }
        else {
            setOrgNameError({
                error: false,
                message: ""
            })
        }
        if (docType === "") {
            setDocTypeError({
                error: true,
                message: "Document Type is required"
            })
            flag = 1;
        }
        else {
            setDocTypeError({
                error: false,
                message: ""
            })
        }
        if (flag === 1) {
            return;
        }
        if (file === null) {
            setFileErr(true);
        }
        else {
            setIsLoading(true);
            try {
                console.log("pinata");
                
                // const result = await ipfs.add(file);
                const result = await pinFileToIPFS(file, docName.current.value);
                const { cid, path } = result;
                console.log(`CID: ${cid}`);
                // console.log(`Path: ${path}`);

                const data = {
                    org: orgName.current.value,
                    date: new Date(),
                    doctorname: docName.current.value,
                    documentName: recordname.current.value,
                    path: cid,
                    cid: cid,
                    docType: docType
                }
                const res = await uploadRecordByUser(
                    data,
                    accountAddress
                )
                if (res.message) {
                    enqueueSnackbar(res.message, { variant: "error" })
                }
                else {
                    enqueueSnackbar("File upload successful!", { variant: "success" });
                    event.target.reset();
                    setDocType('');
                    setFile(null);
                }
                setIsLoading(false);
            } catch (err) {
                enqueueSnackbar("Failed to upload record", { variant: "error" });
                setIsLoading(false);
            }
        }
    }

    return (<><Container component="main" maxwidth="s" minwidth="xs"><CssBaseline />
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
        >
            <CircularProgress color="inherit" />
        </Backdrop><Box component="form" onSubmit={onSubmitHandler} sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: "20px"
        }}>  <TextField
                autoComplete='off'
                margin="normal"
                fullWidth
                name="name"
                label="Record Name"
                type="text"
                id="name"
                inputRef={recordname}
                sx={{ width: "40vw", maxWidth: "405px", minWidth: "250px" }}
                error={recordNameError.error}
            helperText={recordNameError.message}
            /><TextField
                autoComplete='off'
                margin="normal"
                fullWidth
                name="docname"
                label="Doctor or Issuer's Name"
                type="text"
                id="docname"
                inputRef={docName}
                sx={{ width: "40vw", maxWidth: "405px", minWidth: "250px", marginTop: "0" }}
                error={docNameError.error}
            helperText={docNameError.message}
            /><TextField
                autoComplete='off'
                margin="normal"
                fullWidth
                name="orgname"
                label="Organisation's Name"
                type="text"
                id="orgname"
                inputRef={orgName}
                sx={{ width: "40vw", maxWidth: "405px", minWidth: "250px", marginTop: "0" }}
                error={orgNameError.error}
            helperText={orgNameError.message}
            /><FormControl sx={{ width: "40vw", maxWidth: "405px", minWidth: "250px" }}><InputLabel id="demo-simple-select-label">Record Type *</InputLabel><Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={docType}
                label="Record Type *"
                onChange={handleChange}
                error={docTypeError.error}
            helperText={docTypeError.message}
            >
                <MenuItem value={"Certificate"}>Certificate</MenuItem>
                <MenuItem value={"Report"}>Report</MenuItem>
                <MenuItem value={"Prescription"}>Prescription</MenuItem>
                <MenuItem value={"Mediclaim"}>MediClaim</MenuItem>
            </Select></FormControl><MuiFileInput error={fileErr} sx={{ width: "40vw", maxWidth: "405px", minWidth: "250px" }} label="Upload File" value={file} onChange={handleFileChange} /><Box sx={{ display: "flex", gap: "20px", justifyContent: "center", padding: "20px" }}><Button type="submit" variant='contained'>SUBMIT</Button><Button onClick={resetHandler} type="reset" color='neutral' variant='outlined'>DISCARD</Button></Box></Box></Container></>)
}

export default UploadRecords;
