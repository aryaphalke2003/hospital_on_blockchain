import Web3 from 'web3';
import { hospitalABI } from '../abis/hospital'
const web3 = new Web3(process.env.REACT_APP_BLOCKCHAIN_PROVIDER_URL);
const hospitalAddress = process.env.REACT_APP_HOSPITAL_CONTRACT_ADDRESS;
const doctorContract = new web3.eth.Contract(hospitalABI, hospitalAddress);
const hospitalContract = new web3.eth.Contract(hospitalABI, hospitalAddress);
const diagContract = new web3.eth.Contract(hospitalABI, hospitalAddress);
const clinicContract = new web3.eth.Contract(hospitalABI, hospitalAddress);


const register_patient = async (data, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: doctorContract.methods.register_patient(
                data.name,
                data.age,
                data.gender,
                data.phone,
                data.email
            ).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to register, Please check your balance or try another account"
        }
        return errObject;
    }
}

const getDiagnosticForPatient = async (accountAddress) => {
    try {
        const res = await diagContract.methods.getDiagnosticsForUser().call({
            from: accountAddress,
            gas: 3000000
        });
        return res
    } catch (error) {
        const errObject = {
            message: "Failed to fetch diagnostics, Please reload the page or try again later",
        }
        return errObject;
    }
}

const grantAccessToDiagnostic = async (address, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: diagContract.methods.grantAccessToDiagnostic(address).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to grant access, Please check your balance or try again later",
        }
        return errObject;
    }
}

const revokeAccessOfDiagnostic = async (address, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: diagContract.methods.revokeAccessDiagnostic(address).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to revoke access, Please check your balance and try again later",
        }
        return errObject;
    }
}

const getRecordsOfUser = async (patientAddress, accountAddress) => {
    try {
        const res = await doctorContract.methods.getHealthRecords(patientAddress).call({
            from: accountAddress,
            gas: 3000000
        });
        return res;
    } catch (error) {
        const errObject = {
            message: "Failed to fetch the documents, Please reload the page or try again later",
        }
        return errObject;
    }
}

const deleteDocument = async (accountAddress, cid) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: doctorContract.methods.deleteRecord(cid).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to delete your document, Please check your balance or try again later",
        }
        return errObject;
    }
}

const getAllDoctorsForAPatient = async (accountAddress) => {
    try {
        const res = await doctorContract.methods.getDoctorsForUser().call({
            from: accountAddress
        });
        const grantedDoctors = res;
        return grantedDoctors;
    } catch (error) {
        const errObject = {
            message: "Failed to fetch your doctors, Please reload the page or try again later",
        }
        return errObject;
    }
}

const getPatientOwnProfile = async (accountAddress) => {
    try {
        const result = await doctorContract.methods.getPatientOwnProfile().call({
            from: accountAddress
        })
        const userData = result;
        return userData;
    } catch (error) {
        console.log(error);
        const errObject = {
            message: "Failed to fetch your profile, Please reload the page or try again later",
        }
        return errObject;
    }
}

const grantAccessToDoctor = async (docAddress, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: doctorContract.methods.grantAccess(docAddress).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to grant access, Please check your balance or try another account",
        }
        return errObject;
    }
}

const revokeDoctorsAccess = async (docAddress, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: doctorContract.methods.revokeAccess(docAddress).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to revoke access, Please check your balance or try again later",
        }
        return errObject;
    }
}

const uploadRecordByUser = async (data, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: doctorContract.methods.addRecordByUser(
                data.org, String(data.date), String(data.doctorname), String(data.documentName), String(data.path), String(data.cid), data.docType).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to upload your document, Please check your balance or try again later",
        }
        return errObject;
    }
}



const getOrgOfDoctor = async (accountAddress) => {
    try {
        const orgAddress = await hospitalContract.methods.organization(accountAddress).call({
            from: accountAddress,
            gas: 3000000
        });
        let hospitalProfile = {
            hospname: ""
        };
        if (orgAddress !== "0x0000000000000000000000000000000000000000") {
            hospitalProfile = await hospitalContract.methods.hospitals(orgAddress).call({
                from: accountAddress,
                gas: 3000000
            });
        }
        let clinicProfile = {
            name: ""
        };
        const clinicAddress = await clinicContract.methods.DoctorToClinic(accountAddress).call({
            from: accountAddress,
            gas: 3000000
        });
        if (clinicAddress !== "0x0000000000000000000000000000000000000000") {
            clinicProfile = await clinicContract.methods.ClinicIndex(clinicAddress).call({
                from: accountAddress,
                gas: 3000000
            });
        }
        return { hospitalProfile, clinicProfile };
    }
    catch (error) {
        const errObject = {
            message: "Failed to fetch organisations, Please reload the page or try again later",
        }
        return errObject;
    }
}

const getPatientsForADoctor = async (accountAddress) => {
    try {
        const result = await doctorContract.methods.getPatients().call({
            from: accountAddress,
            gas: 3000000
        })
        return result;
    } catch (error) {
        const errObject = {
            message: "Failed to fetch your patients, Please reload the page or try again later",
        }
        return errObject;
    }
}

const registerDoctor = async (data, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: doctorContract.methods.registerDoctor(
              
                data.name,
                data.age,
                data.grnumber,
                data.phone,
                data.email,
                data.specialisation,
            ).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (err) {
        const errObject = {
            message: "Failed to register, Please check your balance or try another account"
        }
        return errObject;
    }
}


const getDoctorOwnProfile = async (accountAddress) => {
    try {
        const result = await doctorContract.methods.getDocOwnProfile().call({
            from: accountAddress
        })
        console.log(result);
        const userData = result;
        return userData
    } catch (error) {
        const errObject = {
            message: "Failed to fetch your profile, Please reload the page or try again later",
        }
        return errObject;
    }
}


const searchDoctorByAddress = async (enteredAddress, accountAddress) => {
    try {
        const res = await doctorContract.methods.DocProfileReturn(enteredAddress).call({
            from: accountAddress
        });
        const doctorProfile = res;
        return doctorProfile;
    } catch (error) {
        const errObject = {
            message: "Failed to fetch doctor profile, Please reload the page or try again later",
        }
        return errObject;
    }
}

const searchDoctorByName = async (accountAddress) => {
    try {
        const res = await doctorContract.methods.getAllDoctors().call({
            from: accountAddress
        })
        const doctorProfile = res;
        return doctorProfile;
    } catch (error) {
        const errObject = {
            message: "Failed to fetch doctor profiles, Please reload the page or try again later",
        }
        return errObject;
    }
}

const removeDoctorFromHospital = async (docAddress, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: hospitalContract.methods.removeDoctor(docAddress).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to remove doctor, Please check your balance or try again later",
        }
        return errObject;
    }
}

const addDoctorToHospital = async (docAddress, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: hospitalContract.methods.addHospital(docAddress).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        console.log(error);
        const errObject = {
            message: "Failed to add doctor, Please check your balance or try again later",
        }
        return errObject;
    }
}

const getDoctorsOfHospital = async (accountAddress) => {
    try {
        const res = await hospitalContract.methods.getAllDoctorsForHospital().call({
            from: accountAddress,
            gas: 3000000
        });
        return res;
    } catch (error) {
        const errObject = {
            message: "Failed to fetch doctors, Please reload the page or try again later",
        }
        return errObject;
    }
}

const getHospitalProfile = async (accountAddress) => {
    try {
        const res = await hospitalContract.methods.hospitals(accountAddress).call({
            from: accountAddress,
            gas: 3000000
        });
        return res;
    } catch (error) {
        const errObject = {
            message: "Failed to fetch hospital profile, Please reload the page or try again later",
        }
        return errObject;
    }
}

const revokeAllAccessOfDoctor = async (docAddress, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: hospitalContract.methods.revokeAccessToAll(docAddress).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed revoke access, Please check your balance or try again later",
        }
        return errObject;
    }
}


const registerHospital = async (data, accountAddress) => {
    console.log("regi");
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: hospitalContract.methods.registerHospital(
                data.name,
                data.email,
                data.phone,
                data.license
            ).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to register diagnostic, Please check your balance or try again later",
        }
        return errObject;
    }
}




const registerDiagnostic = async (data, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: diagContract.methods.registerDiagnostic(
                data.name,
                data.email,
                data.phone,
                data.license
            ).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to register diagnostic, Please check your balance or try again later",
        }
        return errObject;
    }
}

const getHealthRecordsOfPatient = async (patAddress, accountAddress) => {
    try {
        const res = await diagContract.methods.getHealthRecordsDiagnostic(patAddress).call({
            from: accountAddress,
            gas: 3000000
        });
        return res;
    } catch (error) {
        const errObject = {
            message: "Failed to fetch health records, Please reload the page or try again later",
        }
        return errObject;
    }
}

const getAllDiagnostics = async (accountAddress) => {
    try {
        const res = await diagContract.methods.getAllDiagnostics().call({
            from: accountAddress,
        });
        console.log(res);
        return res;
    } catch (error) {
        console.log(error);
        const errObject = {
            message: "Failed to fetch diagnostics, Please reload the page or try again later",
        }
        return errObject;
    }
}

const getDiagProfile = async (address, accountAddress) => {
    try {
        const res = await diagContract.methods.DiagnosticIndex(address).call({
            from: accountAddress,
        });
        res.myAdd = address;
        console.log(res);
        return res;
    } catch (error) {
        const errObject = {
            message: "Failed to fetch diagnostic profile, Please reload the page or try again later",
        }
        return errObject;
    }
}

const getPatientsOfDiagnostic = async (accountAddress) => {
    try {
        const res = await diagContract.methods.getPatientsForDiagnostic().call({
            from: accountAddress,
            gas: 3000000
        });
        return res
    } catch (error) {
        const errObject = {
            message: "Failed to fetch patients, Please reload the page or try again later",
        }
        return errObject;
    }
}

const uploadRecordsByDiagnostic = async (data, accountAddress, patientAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: diagContract.methods.uploadRecordsDiagnostic(
                patientAddress,
                data.org, String(data.date), String(data.documentName), String(data.doctorname), String(data.path), String(data.cid), String(data.docType)).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to upload records, Please check your balance or try again later",
        }
        return errObject;
    }
}


const registerClinic = async (data, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: clinicContract.methods.registerClinic(
                data.name,
                data.phone,
                data.email,
                data.location
            ).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to register clinic, Please check your balance or try again later",
        }
        return errObject;
    }
}

const enrollInClinicForDoctor = async (cliAddress, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: clinicContract.methods.enrollInClinic(cliAddress).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to enroll in clinic, Please check your balance or try again later",
        }
        return errObject;
    }
}

const getDoctorsOfClinic = async (accountAddress) => {
    try {
        const res = await clinicContract.methods.getAllDoctorsForClinic().call({
            from: accountAddress,
            gas: 3000000
        });
        return res
    } catch (error) {
        const errObject = {
            message: "Failed to fetch doctor profiles, Please reload the page or try again later",
        }
        return errObject;
    }
}

const getClinicProfile = async (cliAddress, accountAddress) => {
    try {
        const res = await clinicContract.methods.ClinicIndex(cliAddress).call({
            from: accountAddress,
            gas: 3000000
        });
        return res
    } catch (error) {
        const errObject = {
            message: "Failed to fetch clinic profile, Please reload the page or try again later",
        }
        return errObject;
    }
}

const exitFromClinic = async (accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: clinicContract.methods.exitFromClinic().encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        const errObject = {
            message: "Failed to exit from clinic, Please check your balance or try again later",
        }
        return errObject;
    }
}

const setCostByAdmin = async (fee, accountAddress) => {
    try {
        const transactionParams = {
            from: accountAddress,
            to: hospitalAddress,
            data: clinicContract.methods.setCost(fee).encodeABI(),
        }
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParams],
        });
        return txHash;
    } catch (error) {
        console.log(error);
        const errObject = {
            message: "Failed to update the cost of registering a hospital. Please try again later"
        }
        return errObject;
    }
}

export {
    registerDoctor,
    register_patient,
    getDoctorOwnProfile,
    getAllDoctorsForAPatient,
    getPatientsForADoctor,
    getPatientOwnProfile,
    searchDoctorByAddress,
    searchDoctorByName,
    grantAccessToDoctor, revokeDoctorsAccess, getRecordsOfUser, uploadRecordByUser,
    removeDoctorFromHospital, addDoctorToHospital, getDoctorsOfHospital, getHospitalProfile, revokeAllAccessOfDoctor, registerHospital,
    registerDiagnostic, getAllDiagnostics, getDiagProfile, getPatientsOfDiagnostic, grantAccessToDiagnostic, revokeAccessOfDiagnostic, getDiagnosticForPatient, uploadRecordsByDiagnostic, deleteDocument,
    registerClinic, enrollInClinicForDoctor, getDoctorsOfClinic,
    getClinicProfile, exitFromClinic, getOrgOfDoctor,
    getHealthRecordsOfPatient, setCostByAdmin
}
