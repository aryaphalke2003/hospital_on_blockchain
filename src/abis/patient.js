export const patientABI =  [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "DiagnosticIndex",
      "outputs": [
        {
          "internalType": "string",
          "name": "Diagname",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "email",
          "type": "string"
        },
        {
          "internalType": "uint128",
          "name": "phone",
          "type": "uint128"
        },
        {
          "internalType": "string",
          "name": "license",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_doctor",
          "type": "address"
        }
      ],
      "name": "DocProfileReturn",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint16",
              "name": "age",
              "type": "uint16"
            },
            {
              "internalType": "uint64",
              "name": "grNum",
              "type": "uint64"
            },
            {
              "internalType": "string",
              "name": "degreeName",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "myAdd",
              "type": "address"
            }
          ],
          "internalType": "struct patient.DocProfile",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint16",
          "name": "_age",
          "type": "uint16"
        },
        {
          "internalType": "string",
          "name": "_gender",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_mobile",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_email",
          "type": "string"
        }
      ],
      "name": "register_patient",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_doctorAddress",
          "type": "address"
        }
      ],
      "name": "grantAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_diagnosticAddress",
          "type": "address"
        }
      ],
      "name": "grantAccessToDiagnostic",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_org",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_date",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_doctorName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_documentName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_path",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_cid",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_docType",
          "type": "string"
        }
      ],
      "name": "addRecordByUser",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_doctor",
          "type": "address"
        }
      ],
      "name": "revokeAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPatientOwnProfile",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint16",
              "name": "age",
              "type": "uint16"
            },
            {
              "internalType": "string",
              "name": "gender",
              "type": "string"
            },
            {
              "internalType": "uint128",
              "name": "mobile",
              "type": "uint128"
            },
            {
              "internalType": "string",
              "name": "email",
              "type": "string"
            }
          ],
          "internalType": "struct patient.Patient",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_cid",
          "type": "string"
        }
      ],
      "name": "deleteRecord",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]