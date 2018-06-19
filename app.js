$(document).ready( function () {
	// Initialize tooltip component
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})

	// Initialize popover component
	$(function () {
	  $('[data-toggle="popover"]').popover()
	});

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

	window.setInterval(function(){
		getDetails(list_coins);
	}, 300000);

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

	coin_details = {}
	getDetails(list_coins);

	function getDetails(main_list){
		var count =0;
		main_list.forEach(function(item){
		    $.ajax({
				url: item[2],
				type: 'GET',
				success: function(success) {
					if (success.lastblock == undefined){
						if (success.network.reward){
							coin_details[item[1] + "-difficulty"] = success.network.difficulty;
							coin_details[item[1] + "-reward"] = success.network.reward;
						}
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
	}

} );