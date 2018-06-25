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
		['plura','PLURA', 'http://plura.superpools.online:8117/stats','https://api.coingecko.com/api/v3/coins/pluracoin'],
		['b2bcoin', 'B2B', 'http://b2b.superpools.online:8117/stats']
		]
	
	$('select').on('change', function (e) {
		var optionSelected = $("option:selected", this);
    	var valueSelected = this.value;
    	if (valueSelected == "H/s"){
    		var hashrate = $('#hashrate').val() / 1000;
    		console.log(hashrate)
    		getProfit(list_coins, coin_details);
    	} else if ( valueSelected == "MH/s"){
    		var hashrate = $('#hashrate').val() * 1000;
    		console.log(hashrate)
    		getProfit(list_coins, coin_details);	
    	}
	});

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


	function finalProfit(coin_difficulty,coin_reward, coin, coin_decimal, coin_unit){
		var hashRate = $('#hashrate').val();
		if (hashRate == ""){
			profit = 0
			hashRate =0;
		} else {
			var profit = (hashRate * 86400 / coin_difficulty) * coin_reward
		}
		var profit_of_coin = {}
		var decimal = Math.pow(10, (coin_decimal - 1));
		var unit = coin_unit / decimal
		profit = profit / unit
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
							coin_details[item[1] + "-decimal"] = success.config.coinDecimalPlaces;
							coin_details[item[1] + "-unit"] = success.config.coinUnits;
						}
					} else {
						coin_details[item[1] + "-difficulty"] = success.network.difficulty;
						coin_details[item[1] + "-reward"] = success.lastblock.reward;
						coin_details[item[1] + "-decimal"] = success.config.coinDecimalPlaces;
						coin_details[item[1] + "-unit"] = success.config.coinUnits;
					}
					count++;
					if (count == 10){
						getProfit(main_list, coin_details)
					}
				}
			});
		});
	};

	function get_b2b(jugad){
		var b2b_data = []
		$.ajax({
			url: 'https://stocks.exchange/api2/prices',
			type: 'GET',
			async: false,
			success: function(success) {
				success.forEach(function(value){
					if (value['market_name'] == 'B2B_BTC') {
						var price_btc = value['sell']
						var price_mbtc = price_btc * 1000
						b2b_data.push(price_mbtc)
						$.ajax({
							url: 'https://blockchain.info/ticker',
							type: 'GET',
							async: false,
							success: function(json) {
								var btc_usd = json['USD']['last']
								var price_usd = price_btc * btc_usd
								b2b_data.push(price_usd);
							}
						});
					};
				});
			}
		})
		.done(function(){
			jugad = true;
		});

	    if (jugad == true){
			return b2b_data;			
		}

		
	};
	// get_b2b();
	function getProfit(main_list, coin_details){
		var jugad = false;
    	$("#coins_data > tbody").html("");
		final_list = []
		var data = get_b2b();
		var b2b_profit = finalProfit(coin_details['B2B-difficulty'], coin_details['B2B-reward'], 'b2b', coin_details['B2B-decimal'], coin_details['B2B-unit']);
		var b2b_prices = {}
		b2b_prices['b2b-usd'] = parseFloat((data[1] * b2b_profit['b2b']).toFixed(4));
		b2b_prices['b2b-mbtc'] = parseFloat((data[0] * b2b_profit['b2b']).toFixed(4));
		b2b_prices['coin'] = 'b2b';
		final_list.push(b2b_prices);
		var counter = 0;
		for (var i =0; i < (main_list.length - 1); i++){
			
			$.ajax({
				url: main_list[i][3],
				type: 'GET',
				success: function(success){


					var a = finalProfit(coin_details[success.symbol.toUpperCase() +"-difficulty"], coin_details[success.symbol.toUpperCase() +"-reward"], success.symbol, coin_details[success.symbol.toUpperCase() + "-decimal"], coin_details[success.symbol.toUpperCase() + "-unit"]);


					one_coin_data = {}
					one_coin_data[success.symbol + "-usd"] = parseFloat((success.market_data.current_price.usd * a[success.symbol]).toFixed(4));

					one_coin_data[success.symbol + "-mbtc"] = parseFloat((success.market_data.current_price.btc * 1000 * a[success.symbol]).toFixed(4));
						
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