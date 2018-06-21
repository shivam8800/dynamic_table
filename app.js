$(document).ready( function () {
	// Initialize tooltip component
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})

	// Initialize popover component
	$(function () {
	  $('[data-toggle="popover"]').popover()
	});

	//Varaible containing the List of all the Coins and Important Details
	var list_coins = [ 
		['bytecoin','BCN','http://bcn.superpools.online:8117/stats'], 
		['digitalnote','XDN', 'http://xdn.superpools.online:8117/stats'], 
		[ 'monero_original','XMO', 'http://xmo.superpools.online:8117/stats'],
		[ 'monero_classic','XMC', 'http://xmo.superpools.online:2117/stats'], 
		['dero','DERO', 'http://dero.superpools.online:1117/stats'], 
		['sumo','SUMO', 'http://sumo.superpools.online:4117/stats'], 
		['karbo','KRB', 'http://krb.superpools.online:8117/stats'], 
		['newton','NCP', 'http://ncp.superpools.online:8117/stats'], 
		['plura','PLURA', 'http://plura.superpools.online:8117/stats']
		]
	

	$("#hashrate").change(function(){
        // profitCalculation(list_coins);
        console.log("fds",coin_details);
    });

	//To get the difficulty and rewards of each pool after every 5 minutes
	window.setInterval(function(){
		getDetails(list_coins);
	}, 300000);

	//Function Defined to get the Final Profit
	function finalProfit(coin_difficulty,coin_reward, coin){
		var hashRate = $('#hashrate').val();
		if (hashRate == ""){
			profit = "NAN"
		} else {
			var profit = (hashRate * 86400 / coin_difficulty) * coin_reward
		}
		var profit_of_coin = {}
		profit_of_coin[coin] = profit
		return profit_of_coin
	}

	//Calling the Function to get Details and Creating a disctionary of collected data.
	coin_details = {}
	getDetails(list_coins);

	//Main Function Defined to get the details of the Coin (Rewards and Difficulty)
	function getDetails(main_list){
		var count =0;
		main_list.forEach(function(item){
		    $.ajax({
				url: item[2],
				type: 'GET',
				success: function(success) {
					if (success.lastblock == undefined){
						// if (success.network.reward){
						// 	coin_details[item[1] + "-difficulty"] = success.network.difficulty;
						// 	coin_details[item[1] + "-reward"] = success.network.reward;
						// }
						var currentTime = new Date().getTime();
						while (currentTime + 2000 >= new Date().getTime()){

						}
						coin_details[item[1] + "-difficulty"] = success.network.difficulty;
						coin_details[item[1] + "-reward"] = success.lastblock.reward;
					} else {
						coin_details[item[1] + "-difficulty"] = success.network.difficulty;
						coin_details[item[1] + "-reward"] = success.lastblock.reward;
					}
					count++;
					if (count == 9){
						for (var i =0; i < main_list.length; i++){
							// console.log(main_list[i][1], coin_details[main_list[i][1].toString() +"-difficulty"])
							finalProfit(coin_details[main_list[i][1].toString() +"-difficulty"], coin_details[main_list[i][1].toString() +"-reward"], main_list[i][1]);
						}
					}
				}
			});
		});
	};

	//Variable defined to store the links of the Coins who's prices are available on the Crypto Compare API
	//Look for current_price
	var coin_price = [
	['bytecoin', 'BCN', 'https://api.coingecko.com/api/v3/coins/bytecoin'],
	['digitalnote','XDN', 'https://api.coingecko.com/api/v3/coins/digitalnote'], 
	['monero_original','XMO', 'https://api.coingecko.com/api/v3/coins/monero-original'],
	['monero_classic','XMC', 'https://api.coingecko.com/api/v3/coins/monero-classic'],
	['dero','DERO', 'https://api.coingecko.com/api/v3/coins/dero'],
	['sumo','SUMO', 'https://api.coingecko.com/api/v3/coins/sumokoin'], 
	['karbo','KRB', 'https://api.coingecko.com/api/v3/coins/karbo'],
	['newton','NCP', 'https://api.coingecko.com/api/v3/coins/newton-coin-project'], 
	['plura','PLURA', 'https://api.coingecko.com/api/v3/coins/pluracoin']
	]

} );