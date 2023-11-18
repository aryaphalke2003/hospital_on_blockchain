// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./diagnostics.sol";
import "./Ownable.sol";

library HospitalLib {
    struct Hospital {
        string hospname;
        string email;
        uint128 phone;
        string license;
    }
}


contract hospital is diagnostics, Ownable {
    uint256 public cost = 0.1 ether;
    
    using HospitalLib for hospital;


    // Maps a user address to a hospital struct
    mapping(address => HospitalLib.Hospital) public hospitals;
    // Maps a user address to a hospital address
    mapping(address => address) public organization;

    // Check if the doctor is authorized to access the hospital
    modifier authorizedHospital(address _doctor, address _hospital) {
        require(organization[_doctor] == _hospital, "Unauthorized");
        _;
    }

    // Returns all doctors enrolled in the hospital
    function getAllDoctorsForHospital()
        external
        view
        returns (DocProfile[] memory)
    {
        uint256 doctorCount = 0;

        for (uint256 i = 0; i < doctors.length; i++) {
            if (organization[doctors[i]] == msg.sender) {
                doctorCount++;
            }
        }

        DocProfile[] memory myDoctors = new DocProfile[](doctorCount);

        uint256 index = 0;
        for (uint256 i = 0; i < doctors.length; i++) {
            if (organization[doctors[i]] == msg.sender) {
                myDoctors[index] = DocProfileReturn(doctors[i]);
                index++;
            }
        }

        return myDoctors;
    }

    function registerHospital(
        string memory _hospname,
        string memory _email,
        uint _phone,
        string memory _license
    ) external payable {
        require(msg.value >= cost);
        hospitals[msg.sender] = HospitalLib.Hospital(
            _hospname,
            _email,
            uint128(_phone),
            _license
        );
    }

    // Allows hospital to remove a doctor
    function removeDoctor(
        address _doctor
    ) external authorizedHospital(_doctor, msg.sender) {
        delete organization[_doctor];
    }

    // Allows hospital to add a doctor
    function addHospital(address _doctor) external {
        organization[_doctor] = msg.sender;
    }

    // Allows hospital to revoke access to a doctor
    function revokeAccessToAll(
        address _doctor
    ) external authorizedHospital(_doctor, msg.sender) {
        delete accessList[_doctor];
    }

    // Allows owner to withdraw funds from the contract
    function withdraw() external onlyOwner {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }

    // Allows user to set the cost of registering a hospital
    function setCost(uint _fee) external onlyOwner {
        cost = _fee;
    }

    // Rest of your contract remains unchanged...

    // Fallback function to receive ether
    receive() external payable {}
}