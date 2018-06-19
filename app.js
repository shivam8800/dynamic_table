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
		[ 'monero_classic','XMO', 'http://xmo.superpools.online:2117/stats'], 
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
		profitCalculation(list_coins);
	}, 300000);

	function finalProfit(){
		var hashRate = $('#hashrate').val();
		var profit = (hashRate * 86400 / coin_difficulty) * coin_reward
		return profit
	}

	coin_details = {}
	getDetails(list_coins);

	function getDetails(main_list){
		main_list.forEach(function(item){
		    $.ajax({
				url: item[2],
				type: 'GET',
				success: function(success) {
					// console.log(success.network.difficulty , "name", item[1], "reward", success.lastblock);
					if (success.lastblock == undefined){
						index =0;
						while (index < 9){
							$.ajax({
								url: item[2],
								type: 'GET',
								success: function(json) {
									console.log(index);
									console.log(json.lastblock);
									index++;
								}
							});
						}
					} else {
						coin_details[item[1] + "-difficulty"] = success.network.difficulty;
						coin_details[item[1] + "-reward"] = success.lastblock.reward;
						console.log(success.lastblock.reward)
					}
				}
			});
			
		});
	}

} );