$(document).ready( function () {
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})

	$(function () {
	  $('[data-toggle="popover"]').popover()
	});

	var list_coins = [ 
		['bytecoin','BCN','http://bcn.superpools.online:8117/stats', 'https://api.coingecko.com/api/v3/coins/bytecoin'], 
		['digitalnote','XDN', 'http://xdn.superpools.online:8117/stats','https://api.coingecko.com/api/v3/coins/digitalnote'], 
		[ 'monero_original','XMO', 'http://xmo.superpools.online:8117/stats','https://api.coingecko.com/api/v3/coins/monero-original'],
		[ 'monero_classic','XMC', 'http://xmo.superpools.online:2117/stats','https://api.coingecko.com/api/v3/coins/monero-classic'], 
		['dero','DERO', 'http://dero.superpools.online:1117/stats','https://api.coingecko.com/api/v3/coins/dero'], 
		['sumo','SUMO', 'http://sumo.superpools.online:4117/stats', 'https://api.coingecko.com/api/v3/coins/sumokoin'], 
		['karbo','KRB', 'http://krb.superpools.online:8117/stats', 'https://api.coingecko.com/api/v3/coins/karbo'], 
		['newton','NCP', 'http://ncp.superpools.online:8117/stats','https://api.coingecko.com/api/v3/coins/newton-coin-project'], 
		['plura','PLURA', 'http://plura.superpools.online:8117/stats','https://api.coingecko.com/api/v3/coins/pluracoin']
		]
	

	$("#hashrate").change(function(){
        getProfit(list_coins, coin_details);
    });

    $('#first').click(function(){
    	$('#hashrate').val(220);
    	getProfit(list_coins, coin_details);
    });
    
    $('#second').click(function(){
    	$('#hashrate').val(20);
    	getProfit(list_coins, coin_details);
    });
    
    $('#third').click(function(){
    	$('#hashrate').val(40);
    	getProfit(list_coins, coin_details);
    });

    $('#forth').click(function(){
    	$('#hashrate').val(70);
    	getProfit(list_coins, coin_details);
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
						getProfit(main_list, coin_details)
					}
				}
			});
		});
	};

	function getProfit(main_list, coin_details){
    	$("#coins_data > tbody").html("");
		final_list = []
		var counter = 0;
		for (var i =0; i < main_list.length; i++){
			
			$.ajax({
				url: main_list[i][3],
				type: 'GET',
				success: function(success){


					var a = finalProfit(coin_details[success.symbol.toUpperCase() +"-difficulty"], coin_details[success.symbol.toUpperCase() +"-reward"], success.symbol);


					one_coin_data = {}
					one_coin_data[success.symbol + "-usd"] = parseFloat((success.market_data.current_price.usd * a[success.symbol]).toFixed(3));

					one_coin_data[success.symbol + "-mbtc"] = parseFloat((success.market_data.current_price.btc / 1000 * a[success.symbol]).toFixed(3));
						
					one_coin_data["coin"] =success.symbol;

					final_list.push(one_coin_data);
					
					counter++;
					if (counter == 9){
						function sortOnKeys(array) {
							var sorted = []
							for (var i = 0; i < array.length; i++) {
								var key = array[i]['coin'] + '-usd'
								sorted[sorted.length] = array[i][key]
							}
							sorted.sort(function(a, b){return b-a});
							var tempArray = [];
							for (var i = 0; i < sorted.length; i++) {
								for (var j = 0; j < array.length; j++) {
									var key = array[j]['coin'] + '-usd'
									if (sorted[i] == array[j][key]) {
										tempArray.push(array[j]);
									};
								};
							};
							return tempArray;
						};

						if ($('#hashrate').val() == ""){
							var main_array = final_list;
						} else {
							var main_array = sortOnKeys(final_list);
						}
						for(var j=0; j < main_array.length; j++ ){

							var coin = main_array[j]['coin'];
							var rowHTML = '<tr><td>'+ main_array[j]['coin'].toUpperCase() +'</td><td>Official Site</td><td>Algorithm</td><td>Wallet</td><td>'+ main_array[j][coin+ "-mbtc"] +'</td><td>'+ main_array[j][coin+ "-usd"] +'</td><td>Cell</td><td><a class="btn btn-primary button1" href="#" role="button"> Start Mining </a></td></tr>';
						
							$("table tbody").append(rowHTML);

						}
					}
				}
			})
		}
	}

} );