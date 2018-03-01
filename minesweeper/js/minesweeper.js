$(function() {
	//变量
	//具体参数
	var column, row, mineL, surplus;
	var mine_sweeper = $("#minesweeper-wrap");
	var matrix = [];
	var game_start = false;
	var _time;

	//主程序
	init();

	function init() {
		$("#create").on("click", create);
		$("#play").on("click", play);
	}

	//新建游戏
	function create() {
		//布置场景
		if($("#minesweeper")) {
			$("#minesweeper").remove();
		}
		$("#start-game").show();

		column = $("#column").val() ? parseInt($("#column").val()) : 10;
		row = $("#row").val() ? parseInt($("#row").val()) : 10;
		mineL = $("#minelength").val() ? parseInt($("#minelength").val()) : 10;
		surplus = column * row;

		surplus_html(true);
		var mine_html = "<div class='minesweeper' id='minesweeper' style='column-count:" + column + "'>";
		for(var i = 0, iL = column * row; i < iL; i++) {
			mine_html += "<span></span>";
		}
		mine_html += "</div>";
		mine_sweeper.append(mine_html);
		
		time(true);
	}

	//开始游戏
	function play() {
		game_start = true;
		matrix = [];
		for(var i = 0; i < mineL; i++) {
			create_mine(matrix, column, row);
		}
		$("#start-game").hide();

		//绑定点击事件
		$("#minesweeper").on("click", "span", m_click);
		$("#minesweeper").on("contextmenu", "span", mark);
		
		time();
	}

	//生成雷
	function create_mine(arr, mx, my) {
		var coordinate = Math.floor(Math.random() * (mx * my));
		if(arr.indexOf(coordinate) != -1) {
			create_mine(arr, mx, my);
		} else {
			arr.push(coordinate);
		}
	}

	function mine_show(arr, a) {
		for(var i = 0; i < matrix.length; i++) {
			$("#minesweeper span").eq(matrix[i]).html("*");
			if(a) {
				$("#minesweeper span").eq(matrix[i]).addClass("open");
			}
		}
	}

	//surplus - 1
	function surplus_html(start) {
		if(!start) {
			surplus--;
		}
		$("#surplus").html(surplus);

		if(surplus == mineL) {
			game_start = false;
			alert("游戏结束！你赢了");
			time(true);
		}
	}

	//shijian
	function time(a) {
		if(!a) {
			clearInterval(_time);
			$("#time").html("00:00:00");
			var start = new Date().getTime();
			_time = setInterval(function() {
				var now = new Date().getTime() - start;
				$("#time").html(timeFormat(Math.floor(now / 1000 / 60 / 60)) + ":" + timeFormat(Math.floor(now / 1000 / 60 % 60)) + ":" + timeFormat(Math.floor(now / 1000 % 60)))
			}, 500)
		} else {
			clearInterval(_time);
		}
	}
	function timeFormat(date){
		if(String(date).length == 1){
			return '0'+date
		}else{
			return date
		}
	}

	//mark
	function mark() {
		if(!$(this).hasClass("mark") && !$(this).hasClass("open")) {
			$(this).addClass("mark");
		} else {
			$(this).removeClass("mark");
		}
		return false;
	}

	//点击事件
	function m_click(a) {
		console.log(a)
		if(!game_start) {
			return false
		};

		var _this;
		if(typeof a == "number") {
			_this = a;
		} else {
			_this = $(this).index();

			if($(this).hasClass("open") || $(this).hasClass("mark")) {
				return false;
			}

			//如果直接踩到雷GG
			if(matrix.indexOf(_this) != -1) {
				mine_show(matrix, true);
				game_start = false;
				alert("游戏结束！你输了");
				time(true);
				return false;
			}
		}
		var adjacent_box = [];
		var _this_in = 0;

		//左3
		if(_this >= row) {
			this_up(_this - row - 1);
			adjacent_box.push(_this - row);
			this_down(_this - row + 1);
		} else {
			//for(var i = 0; i < 3; i++){
			//	adjacent_box.push(-1);
			//}
		}

		//中2
		this_up(_this - 1);
		this_down(_this + 1);

		//右3
		if(_this < (column * row) - row) {
			this_up(_this + row - 1);
			adjacent_box.push(_this + row);
			this_down(_this + row + 1);
		} else {
			//for(var i = 0; i < 3; i++){
			//	adjacent_box.push(-1);
			//}
		}

		for(var i = 0, iL = adjacent_box.length; i < iL; i++) {
			if(matrix.indexOf(adjacent_box[i]) != -1) {
				_this_in++;
			}
		}
		
		//如果没有雷，则递归调用
		if(_this_in > 0) {
			$("#minesweeper span").eq(_this).html(_this_in).addClass("open").removeClass("mark");
		} else {
			$("#minesweeper span").eq(_this).addClass("open").removeClass("mark");
			for(var i = 0, iL = adjacent_box.length; i < iL; i++) {
				if(!$("#minesweeper span").eq(adjacent_box[i]).hasClass("open")) {
					m_click(adjacent_box[i]);
				}
			}
		}

		//计数判决
		surplus_html();

		function this_up(a) {
			if((_this - 1) % row < row - 1 && (_this - 1) % row >= 0) {
				adjacent_box.push(a);
			} else {
				//adjacent_box.push(-1)
			}
		}

		function this_down(a) {
			if((_this + 1) % row <= row - 1 && (_this + 1) % row > 0) {
				adjacent_box.push(a);
			} else {
				//adjacent_box.push(-1)
			}
		}
	}
})