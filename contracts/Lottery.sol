pragma solidity >= 0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Lottery {
  using SafeMath for uint;

  IERC20 token;
  address owner;
  bool active;
  uint numOfPlayers;

  // track if the player already guessed number
  mapping (address => bool) players;
  // map from guess number to the players
  mapping (uint => address[]) public guesses;

  constructor() public {
    // FAU token: https://erc20faucet.com/
    token = IERC20(0xFab46E002BbF0b4509813474841E0716E6730136);
    owner = msg.sender;
    active = true;
  }

  modifier ownerOnly() {
    require(msg.sender == owner, "Owner only.");
    _;
  }

  modifier playerOnly() {
    require(msg.sender != owner, "Player only.");
    _;
  }

  function balance(address addr) public view returns(uint) {
    return token.balanceOf(addr);
  }

  function guess(uint number) public playerOnly returns(bool) {
    require(active, "Game is not activated yet");
    require(number <= 99 && number >= 0,"Guess number should be between 0 and 99");
    require(players[msg.sender] == false, "Already guessed");
    require(numOfPlayers <= 100, "Full slot");
    require(token.allowance(msg.sender, address(this)) >= 10000000000000000, "Please allow this contract to use your 0.01 FAU token");

    token.transferFrom(msg.sender, address(this), 10000000000000000);
    numOfPlayers++;
    players[msg.sender] = true;
    guesses[number].push(msg.sender);
    return true;
  }

  function stop() public ownerOnly returns(bool) {
    uint luckyNumber = block.number % 100;
    uint total = guesses[luckyNumber].length;
    uint balance = balance(address(this));
    if (total == 0) {
      token.transfer(owner, balance);
    } else {
      for (uint i = 0; i < total; i++) {
        address winner = guesses[luckyNumber][i];
        token.transfer(winner, ((balance * 90) / 100) / total);
      }

      token.transfer(owner, (balance * 10) / 100);
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

  function close() public ownerOnly returns(bool) {
    active = false;
    return true;
  }

  function open() public ownerOnly returns(bool) {
    active = true;
    return true;
  }
}
