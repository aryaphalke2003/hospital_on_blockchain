import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import pdf from "../../assets/images/File.png";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { deleteDocument } from '../../Utils/SmartContractUtils';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSelector } from 'react-redux';
import { enqueueSnackbar } from 'notistack';
import ConfirmDialog from '../ConfirmDialog';
import axios from 'axios';
// const JWT = process.env.JWT;
const JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIyNTMyZDc0YS1jMGM4LTQxZGQtYjlmMC1hYmYyN2QyZmIxZDUiLCJlbWFpbCI6ImFyeWFwaGFsa2UyMDAzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJjMDExMTA1MDA4YTRmMjVjYWM4ZSIsInNjb3BlZEtleVNlY3JldCI6IjgxMjhhNTA4MWYwY2FjZjQ2MmEzMDEwOTNkMzE4MWNmNzIwOTM1ZDU0MjMwMmI1YzE0YjRiZjNjZDMzYzgwOTkiLCJpYXQiOjE3MDEwNDAyMDZ9.ZnV2x5B6WRD64h4dAFKlyoVBdx9mZtgfC6Nmt6D8jyU';

const RecordCard = (props) => {

    const [isLoading, setIsLoading] = useState(false);
    const accountAddress = useSelector(state => state.accountAddress);
    const { refresh, setRefresh, data } = props;
    const [confirm, setConfirm] = useState(false);
    
    const deletePinFromIPFS = async (hashToUnpin) => {
        try {
          const res = await axios.delete(`https://api.pinata.cloud/pinning/unpin/${hashToUnpin}`, {
            headers: {
              Authorization: JWT
            }
          })
          console.log(res.status)
        } catch (error) {
          console.log(error)
        }
      }

    const unpinFromPinata = async (hash) => {

        deletePinFromIPFS(hash);
       
    }

    const removeDocFromBlock = async (hash) => {
        await deleteDocument(accountAddress, hash)
    }

    const handleRemove = async () => {
        setIsLoading(true);
        try {
            await unpinFromPinata(data.documentPath);
            await removeDocFromBlock(data.documentCid);
            enqueueSnackbar("Record DELETED successfully!", { variant: "success" });
        }
        catch (err) {
            enqueueSnackbar("Failed to DELETE record!", { variant: "error" });
        }
        setIsLoading(false);
        setRefresh(!refresh);
    }

    return (
        <><ConfirmDialog open={confirm} setOpen={setConfirm} onConfirm={handleRemove} title={"Delete Record"} children={"Are you sure you want to DELETE this record?"} />
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Card sx={{ maxWidth: 400, width: 200 }}>
                <CardMedia
                    component="img"
                    alt="No image Found"
                    height="180"
                    image={pdf}
                    sx={{ marginTop: "8px" }}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {data.documentName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data.documentType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data.organisation}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {new Date(data.date).toLocaleDateString() + " " + new Date(data.date).toLocaleTimeString("en-IN")}
                    </Typography>
                </CardContent>
                <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                    <a href={`https://orange-legal-jay-931.mypinata.cloud/ipfs/${data.documentPath}`} target='_blank' rel='noreferrer'><IconButton><VisibilityIcon /></IconButton></a>
                    <IconButton onClick={() => {
                        setConfirm(true);
                    }}><DeleteIcon /></IconButton>
                </CardActions>
            </Card>
        </>
    );
}

export default RecordCard;
