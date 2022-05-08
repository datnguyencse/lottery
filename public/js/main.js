App = {
    web3Provider: null,
    contracts: {},
    lotteryContract: lottery.networks['42'].address,

    init: async function() {
      App.contracts.Lottery = TruffleContract(lottery);
      App.contracts.Fau = TruffleContract(fau);
      return App.initWeb3();
    },

    initWeb3: async function() {
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        web3 = window.web3;
        let account = await ethereum.enable();
        console.log(`Connected Account: ${account}`)
        App.web3Provider = web3.currentProvider;
      } else {
        alert("Please install metamask");
      }

      accounts = web3.eth.accounts;
    },

    getConnectedAccount: async function() {
      let accounts = await ethereum.enable();
      if (accounts.length <= 0) throw new Error("No account connected, please check your metamask");
      return accounts[0];
    },

    guess: async function(number) {
      App.contracts.Lottery.setProvider(App.web3Provider);
      let instance = await App.contracts.Lottery.deployed();
      let receipt = await instance.guess(number, {
        gas: 2000000,
        from: await App.getConnectedAccount()
      });

      return receipt;
    },

    stop: async function() {
      App.contracts.Lottery.setProvider(App.web3Provider);
      let instance = await App.contracts.Lottery.deployed();
      let receipt = await instance.stop({
        gas: 2000000,
        from: await App.getConnectedAccount()
      });

      return receipt;
    },

    allowance: async function() {
      var _guess = $('#number').val();
      await App.contracts.Fau.setProvider(App.web3Provider);
      let account = await App.getConnectedAccount();
      let instance = await App.contracts.Fau.deployed();
      let receipt = instance.allowance(account, App.lotteryContract, {
        gas: 2000000
      });

      return receipt;
    },

    approve: async function() {
      var _guess = $('#number').val();
      await App.contracts.Fau.setProvider(App.web3Provider);
      let account = await App.getConnectedAccount();
      let instance = await App.contracts.Fau.deployed();
      // approve 0.01 FAU
      let receipt = instance.approve(App.lotteryContract, "10000000000000000", {
        gas: 2000000,
        from: account
      });

      return receipt;
    },

    balanceOf: async function(address) {
      var _guess = $('#number').val();
      await App.contracts.Fau.setProvider(App.web3Provider);
      let instance = await App.contracts.Fau.deployed();
      let receipt = await instance.balanceOf(address);
      return receipt;
    },
  }

!async function() {
  try {
    await App.init();
    console.log('Connected');
    let allowance = await App.allowance();
    allowance = BigInt(allowance.toString());
    if (allowance < BigInt("10000000000000000")) {
      $(".guess").hide();
      $(".approve").show();
    } else {
      $(".guess").show();
      $(".approve").hide();
    }

    console.log(allowance.toString());
  } catch (e) {
    console.log(e)
    console.log('Not Connected')
  }
}();

$('#stop').click(async function(event) {
  try {
    event.preventDefault();
    $("#message").html('Sending transaction.....');
    let transaction = await App.stop();
    if (transaction && transaction.receipt && transaction.receipt.status == true) {
      console.log(`Stop, tx id: ${transaction.tx}`);
      alert(`Success, tx id: ${transaction.tx}`);
    } else {
      alert(`Send stop transaction failed. Visit console for more details.`);
      console.log(transaction);
    }
  } catch (e) {
    console.log('Approve failed: ', e);
  }

  $("#message").html('');
});

$('#approve').click(async function(event) {
  try {
    event.preventDefault();
    $("#message").html('Sending transaction.....');
    let transaction = await App.approve();
    if (transaction && transaction.receipt && transaction.receipt.status == true) {
      $(".guess").show();
      $(".approve").hide();
      console.log(`Approved, tx id: ${transaction.tx}`);
      alert(`Success, tx id: ${transaction.tx}`);
    } else {
      alert(`Send approve transaction failed. Visit console for more details.`);
      console.log(transaction);
    }
  } catch (e) {
    console.log('Approve failed: ', e);
  }

  $("#message").html('');
});

$("#send").click(async function(event) {
  try {
    event.preventDefault();
    $("#message").html('Sending transaction.....');
    let transaction = await App.guess($("#number").val());
    if (transaction && transaction.receipt && transaction.receipt.status == true) {
      $('#guess-form').trigger("reset");
      alert(`Success, tx id: ${transaction.tx}`);
    } else {
      alert(`Send transaction failed. Visit console for more details.`);
      console.log(transaction);
    }
  } catch (e) {
    alert(`Guess number failed: ${e.message}`);
  }

  $("#message").html('');
});

window.ethereum.on('accountsChanged', function (accounts) {
  location.reload();
})

/*==================================================================
[ Validate ]*/
var input = $('.validate-input .input100');

$('.validate-form').on('submit', function() {
  var check = true;

  for (var i = 0; i < input.length; i++) {
    if (validate(input[i]) == false) {
      showValidate(input[i]);
      check = false;
    }
  }

  return check;
});


$('.validate-form .input100').each(function() {
  $(this).focus(function() {
    hideValidate(this);
  });
});

function validate(input) {
  if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
    if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
      return false;
    }
  } else {
    if ($(input).val().trim() == '') {
      return false;
    }
  }
}

function showValidate(input) {
  var thisAlert = $(input).parent();

  $(thisAlert).addClass('alert-validate');
}

function hideValidate(input) {
  var thisAlert = $(input).parent();

  $(thisAlert).removeClass('alert-validate');
}
