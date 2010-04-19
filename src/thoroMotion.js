/*
 * Wraps the Motion Chart into the ThoroMotion object and transforms thoroData 
 * into the thoroMotion-compatible format
 */
thorobase.ThoroMotion = {
	tmChart: null,
	
	tmInit: function (/* DOM Node */ container) {
		this.tmChart = new google.visualization.MotionChart(container);
	},
	
	tmDraw: function (/* google.visualization.DataTable */ thoroMotionData, /* Array */ options) {
		this.tmChart.draw(thoroMotionData, options)
	},
	
	/*
	 * Constructs the racing data into the required format for displaying a thoroMotion
	 * returns google.visualization.DataTable
	 */
	createThoroMotionData: function(/* thorobase.thorodata.Race */ race) {
		var thoroMotionData, numRunners, startRowIndex, performance, startDist = 10000, railPosFlag = -1, callPosIndex, perfCallPos, furlongYards = 220;

		thoroMotionData = new google.visualization.DataTable();
		thoroMotionData.addColumn('string', 'Horse Name', 'horseName');		// horse name
		thoroMotionData.addColumn('number', 'Furlongs', 'furlongs');		// use integer (years) to simulate furlongs due to 1901 date restriction
		thoroMotionData.addColumn('number', 'Lengths Behind', 'lengths');	// position (in lengths) versus the leader
		thoroMotionData.addColumn('number', 'Wide', 'wide');				// if available, how wide from rail, otherwise PP value
		thoroMotionData.addColumn('number', 'PP', 'pp');					// post position
		thoroMotionData.addColumn('number', 'Odds', 'odds');				// horse odds to $1

		numRunners = race.performances.length;

		// we need to create the first rows to represent the horses in the starting gate about to race		
		for (startRowIndex = 0; startRowIndex < numRunners; startRowIndex += 1) {
			performance = race.performances[startRowIndex];

			thoroMotionData.addRow([
				performance.horseName, 				// horse name
				startDist,							// 0 furlongs travelled*
				0, 									// all level as it's the start
				(railPosFlag * performance.pp),		// use PP for wide value as in the gate
				performance.pp,						// post position
				performance.odds					// horse odds to $1
			]);

			for (callPosIndex = 0; callPosIndex < performance.callPositions.length; callPosIndex += 1) {
				perfCallPos = performance.callPositions[callPosIndex];

				thoroMotionData.addRow([
					performance.horseName,								// horse name 
					startDist + (perfCallPos.pocDist / furlongYards), 	// furlongs travelled at point of call*
					(railPosFlag * perfCallPos.pocLengths), 			// lengths behind the leader at point of call
					(railPosFlag * perfCallPos.pocWide),				// width from rail at this point of call
					performance.pp,										// post position
					performance.odds									// horse odds to $1
				]);
			}
		}

		return thoroMotionData;
	},	
};