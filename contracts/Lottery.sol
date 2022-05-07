pragma solidity >= 0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Lottery {
  using SafeMath for uint;

  address owner;
  bool active;
  uint numOfPlayers;

  // track if the player already guessed number
  mapping (address => bool) players;
  // map from guess number to the players
  mapping (uint => address[]) public guesses;

  constructor() public {
    owner = msg.sender;
    active = true;
  }

  modifier onlyowner() {
    require(msg.sender == owner, "Owner only.");
    _;
  }

  modifier onlyplayer() {
    require(msg.sender != owner, "Player only.");
    _;
  }

  function guess(uint number) public onlyplayer payable returns(bool) {
    require(active, "This game is not yet active");
    require(number <= 99 && number >= 0,"Guess number should be between 0 and 99");
    require(msg.value == 1, "Deposit value mush be 1 wei");
    require(players[msg.sender] == false, "Already guessed");
    require(numOfPlayers <= 100, "Full slot");

    numOfPlayers++;
    players[msg.sender] = true;
    guesses[number].push(msg.sender);
    return true;
  }

  function stop() public onlyowner returns(bool) {
    uint luckyNumber = block.number % 100;
    if (guesses[luckyNumber].length == 0) {
      payable(owner).transfer(address(this).balance);
    } else {
      for (uint i = 0; i < guesses[luckyNumber].length; i++) {
        address winner = guesses[luckyNumber][i];
        payable(winner).transfer(((address(this).balance * 90) / 100) / guesses[luckyNumber].length);
      }

      payable(owner).transfer( (address(this).balance * 10) / 100);
    }

    numOfPlayers = 0;
    for (uint i = 0; i < 100; i++) {
      for (uint j = 0; j < guesses[i].length; j++) {
        delete players[guesses[i][j]];
        delete guesses[i][j];
      }

      delete guesses[i];
    }

    return true;
  }

  function close() public onlyowner returns(bool) {
    active = false;
    return true;
  }

  function open() public onlyowner returns(bool) {
    active = true;
    return true;
  }
}
