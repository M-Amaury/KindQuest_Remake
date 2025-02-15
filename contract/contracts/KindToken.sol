// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KindToken is ERC20, Ownable {
    mapping(address => bool) isVerifier;
    mapping(uint256 => Mission) missions;
    mapping(uint256 => mapping(address => bool)) isMissionClaimed;
    uint256 public missionCount;

    struct Mission {
        string name;
        string description;
        uint256 kindReward;
        uint256 xrpReward;
        bool active;
    }

    event MissionCreated(uint256 indexed missionId, string name, uint256 kindReward, uint256 xrpReward);
    event MissionCompleted(uint indexed missionId, address indexed participant);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    event TokensMinted(address indexed participant, uint256 amount);
    event TokensBurned(address indexed participant, uint256 amount);

    constructor() ERC20("KindToken", "KIND") Ownable(msg.sender) {}
    
    function burn(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) external onlyOwner{
        require(balanceOf(account) >= amount, "Insufficient balance");
        _burn(account, amount);
        emit TokensBurned(account, amount);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function addVerifier(address verifier) external onlyOwner {
        isVerifier[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function removeVerifier(address verifier) external onlyOwner {
        isVerifier[verifier] = false;
        emit VerifierRemoved(verifier);
    }

    function createMission(
        string memory _name, 
        string memory _description, 
        uint256 _kindReward, 
        uint256 _xrpReward
        ) external onlyOwner {
            missions[missionCount] = Mission({
                name: _name,
                description: _description,
                kindReward: _kindReward,
                xrpReward: _xrpReward,
                active: true
            });
            emit MissionCreated(missionCount, _name, _kindReward, _xrpReward);
            missionCount++;
    }
    
    function completeMissionForParticipant(uint256 _missionId, address _participant) external {
        require(missions[_missionId].active, "Mission is not active");
        require(!isMissionClaimed[_missionId][_participant], "Mission already claimed");
        
        isMissionClaimed[_missionId][_participant] = true;
        _mint(_participant, missions[_missionId].kindReward);
        emit MissionCompleted(_missionId, _participant);
    }

    function closeMission(uint256 _missionId) external onlyOwner {
        require(missions[_missionId].active, "Mission is not active");
        missions[_missionId].active = false;
    }

    function isParticipantRewarded(uint256 _missionId, address _participant) external view returns (bool) {
        return isMissionClaimed[_missionId][_participant];
    }
}
