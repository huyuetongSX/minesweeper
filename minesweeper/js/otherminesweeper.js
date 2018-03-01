$(function() {
	//变量
	//具体参数
	var column, row, mineL, surplus;
	var mine_sweeper = $("#minesweeper-wrap");
	var matrix = [];
	var game_start = false;
	var _time;
	var	matrixArea = []

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
		matrixArea=[];

		for(var i = 0; i < mineL; i++) {
			create_mine(matrix, column, row);
		}
		$("#start-game").hide();
		
		// 创建虚拟节点
		for(var i=0,iL=row;i<iL;i++){
			var columnArr = []
			for(var ii=0,iiL=column;ii<iiL;ii++){
				columnArr.push(0)
			}
			matrixArea.push(columnArr)
		}
		// 合并雷区
		handleMergeMatrix()
		//绑定点击事件
		$("#minesweeper").on("click", "span", m_click);
		$("#minesweeper").on("contextmenu", "span", mark);
		
		time();
	}

	//  合并雷区
	function handleMergeMatrix(){
		for(var i=0,iL=matrix.length;i<iL;i++){
			matrixArea[Math.floor(matrix[i]/column)][matrix[i]%column] = '*'
		}
		for(var i=0,iL=matrix.length;i<iL;i++){
			var columnIndex = Math.floor(matrix[i]/column);
			var rowIndex = matrix[i]%column
			//左三
			if(columnIndex>0){
				if(rowIndex > 0){
					matrixArea[columnIndex-1][rowIndex-1] = handleCreatweeperLength(matrixArea[columnIndex-1][rowIndex-1])
				}
				matrixArea[columnIndex-1][rowIndex] = handleCreatweeperLength(matrixArea[columnIndex-1][rowIndex])
				if(rowIndex < row -1){
					matrixArea[columnIndex-1][rowIndex+1] = handleCreatweeperLength(matrixArea[columnIndex-1][rowIndex+1])
				}
			}
			//中二
			if(rowIndex > 0){
				matrixArea[columnIndex][rowIndex-1] = handleCreatweeperLength(matrixArea[columnIndex][rowIndex-1])
			}
			if(rowIndex < column -1){
				matrixArea[columnIndex][rowIndex+1] = handleCreatweeperLength(matrixArea[columnIndex][rowIndex+1])
			}
			// 右 三
			if(columnIndex < column-1){
				if(rowIndex > 0){
					matrixArea[columnIndex+1][rowIndex-1] = handleCreatweeperLength(matrixArea[columnIndex+1][rowIndex-1])
				}
				matrixArea[columnIndex+1][rowIndex] = handleCreatweeperLength(matrixArea[columnIndex+1][rowIndex])
				if(rowIndex < row -1){
					matrixArea[columnIndex+1][rowIndex+1] = handleCreatweeperLength(matrixArea[columnIndex+1][rowIndex+1])
				}
			}
		}
	}
	
	function handleCreatweeperLength(leng){
		if(typeof(leng)  == 'string'){
			return '*'
		}

		leng++
		return leng
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
	
	//游戏结束
	function mine_show(arr, a) {
		for(var i = 0; i < matrix.length; i++) {
			$("#minesweeper span").eq(matrix[i]).html("*");
			if(a) {
				$("#minesweeper span").eq(matrix[i]).addClass("open");
			}
		}
	}
	//点击事件
	function m_click(a) {

		if(!game_start) {
			return false
		};
		// 九宫格坐标矩阵
		var mineMatrix = []

		var _this = typeof(a) == 'number' ? a : $(this).index() ;
		
		if($("#minesweeper span").eq(_this).hasClass('open')){
			return false
		}
		
		var columnIndex = Math.floor(_this/column);
		var rowIndex = _this%row;
		
		if(matrixArea[columnIndex][rowIndex] == '*'){
			mine_show(matrix, true);
			game_start = false;
			alert("游戏结束！你输了");
			time(true);
			return false;
		}
	
		if(matrixArea[columnIndex][rowIndex]>0){
			$("#minesweeper span").eq(_this).html(matrixArea[columnIndex][rowIndex]).addClass("open").removeClass("mark");
		}else{
			$("#minesweeper span").eq(_this).addClass("open").removeClass("mark");
			
			// 检测以他为矩形的其他的几个方块
			if(columnIndex>0){
				if(rowIndex>0){
					mineMatrix.push([columnIndex-1,rowIndex-1])
				}
				mineMatrix.push([columnIndex-1,rowIndex])
				if(rowIndex<row-1){
					var coordinate = [columnIndex-1,rowIndex-1]
					mineMatrix.push([columnIndex-1,rowIndex+1])
				}
			}
			
			if(rowIndex>0){
				mineMatrix.push([columnIndex,rowIndex-1])
			}
			if(rowIndex < row-1){
				mineMatrix.push([columnIndex,rowIndex+1])
			}
			
			if(columnIndex < column-1){
				if(rowIndex>0){
					mineMatrix.push([columnIndex+1,rowIndex-1])
				}
				mineMatrix.push([columnIndex+1,rowIndex])
				if(rowIndex<row-1){
					var coordinate = [columnIndex+1,rowIndex-1]
					mineMatrix.push([columnIndex+1,rowIndex+1])
				}
			}

			if(mineMatrix && mineMatrix.length > 0){
				for(var i=0,iL=mineMatrix.length;i<iL;i++){
					var indexNum = mineMatrix[i][0]*column + mineMatrix[i][1]
					m_click(indexNum)
				}
			}
		}
		
		//计数判决
		surplus_html();
	}
})