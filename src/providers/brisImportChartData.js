thorobase.BRISImportChartData = Object.create(thorobase.ThoroData);

thorobase.BRISImportChartData.config = {

	surfaces: {
		"D": "Dirt",
		"T": "Turf",
		"d": "Dirt-Inner",
		"t": "Turf-Inner",
		"s": "Steeplechase",
		"h": "Hurdle"
	},
	raceTypes: {
		"G": "Graded Stk/Hcp",
		"N": "Non-Graded Stk/Hcp",
		"A": "Allowance",
		"AO": "Allowance Optional Claiming",
		"R": "Starter Allowance",
		"T": "Starter Hcp",
		"C": "Claiming",
		"CO": "Optional Claiming",
		"S": "Mdn Sp Wt",
		"M": "Mdn Claiming",
		"MO": "Maiden Optional Claiming",
		"NO": "Optional Claiming Stk"
	},
	raceGrades: [
		"Not Graded", 
		"Grade I", 
		"Grade II", 
		"Grade III", 
		"", 
		"Grade I Canada", 
		"Grade II Canada", 
		"Grade III Canada"
	],
	ageSexRestrCode1: {
		"A": {
			"desc": "2 year olds",
			"shortDesc": "2yo"
		}, 
		"B": {
			"desc": "3 year olds",
			"shortDesc": "3yo"
		},
		"C": {
			"desc": "4 year olds",
			"shortDesc": "4yo"
		},
		"D": {
			"desc": "5 year olds",
			"shortDesc": "5yo"
		},
		"E": {
			"desc": "3 & 4 year olds",
			"shortDesc": "3&4yo"
		},
		"F": {
			"desc": "4 & 5 year olds",
			"shortDesc": "4&5yo"
		},
		"G": {
			"desc": "3, 4 & 5 year olds",
			"shortDesc": "3-5yo"
		},
		"H": {
			"desc": "All ages",
			"shortDesc": "2yo+"
		}
	},
	ageSexRestrCode2: {
		"O": {
			"desc": "That age only",
			"shortDesc": ""
		},
		"U": {
			"desc": "That age and up",
			"shortDesc": "+"
		}
	},
	ageSexRestrCode3: {
		"N": {
			"desc": "No sex restrictions",
			"shortDesc": ""
		},
		"M": {
			"desc": "Mares and Fillies Only",
			"shortDesc": "F&M"
		},
		"C": {
			"desc": "Colts and/or Geldings Only",
			"shortDesc": "C&G"
		},
		"F": {
			"desc": "Fillies Only",
			"shortDesc": "F"
		}
	},
	statebredFlag: 1,
	entryCouplingFlag: "e",
	didNotFinishFlag: 92,
	medicationCodes: [
		"None",
		"Lasix",
		"Bute",
		"Bute & Lasix"
	],
	blinkeredFlag: "b",
	raceCardCols: [0, 1],
	raceCols: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 47],
	perfCols: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
	perfWidthCols: [48, 49, 50, 51, 52, 53]

};

thorobase.BRISImportChartData.parseRaceCards = function (/* google.visualization.DataTable */ data) {
	var raceCards, raceCard, BRISImportChartRace, raceCardIndex, raceDateCYMD;

	raceCards = google.visualization.data.group(data, this.config.raceCardCols, []);

	BRISImportChartRace = [];
	
	for (raceCardIndex = 0; raceCardIndex < raceCards.getNumberOfRows(); raceCardIndex += 1) {
		raceCard = Object.create(thorobase.RaceCard);
				
		raceCard.track = raceCards.getFormattedValue(raceCardIndex, 0) || null;
		
		raceDateCYMD = raceCards.getFormattedValue(raceCardIndex, 1);
		raceCard.raceDate = {};
		raceCard.raceDate.year = raceDateCYMD.substring(0, 4) || null;
		raceCard.raceDate.month = raceDateCYMD.substring(4, 6) || null;
		raceCard.raceDate.day = raceDateCYMD.substring(6) || null;
		
		BRISImportChartRace.push(raceCard);
	}
	
	return BRISImportChartRace;
};

thorobase.BRISImportChartData.parseRaces = function (/* google.visualization.DataTable */data, /* thorobase.RaceCard */ raceCard) {
	var raceCardView, raceCardRaces, races, raceIndex, race, raceRunDateCYMD, distanceVal, surfaceCode, raceTypeCode, raceGradeCode, ageSexRestrDesc, ageSexRestrCode, raceAgeSexRestrArray, racePointsOfFractions, fractionsIndex, fraction;
	
	raceCardView = new google.visualization.DataView(data);
	
	// filter the View by track and card date
	raceCardView.setRows(
		data.getFilteredRows([
			{column: 0, value: raceCard.track}, 
			{column: 1, value: raceCard.getRaceDateCYMD()}
		])
	);
	
	// group the View by the columns that contain just pertinent race data		
	raceCardRaces = google.visualization.data.group(raceCardView, this.config.raceCols, []);
		
	races = [];
	
	for (raceIndex = 0; raceIndex < raceCardRaces.getNumberOfRows(); raceIndex += 1) {
		race = Object.create(thorobase.Race);
		
		race.raceTrack = raceCardRaces.getValue(raceIndex, 0);
		
		raceRunDateCYMD = raceCardRaces.getFormattedValue(raceIndex, 1);
		race.raceRunDate = {};
		race.raceRunDate.year = raceRunDateCYMD.substring(0, 4) || null;
		race.raceRunDate.month = raceRunDateCYMD.substring(4, 6) || null;
		race.raceRunDate.day = raceRunDateCYMD.substring(6) || null;
		
		race.raceNumber = raceCardRaces.getValue(raceIndex, 2) || null;
		
		distanceVal = raceCardRaces.getValue(raceIndex, 3);
		race.distance = {};
		race.distance.unit = "yards";
		race.distance.value = Math.abs(distanceVal) || null;
		race.distance.isAbout = (distanceVal < 0) ? true : false;
		
		surfaceCode = raceCardRaces.getFormattedValue(raceIndex, 4);
		race.surface = {};
		race.surface.code = surfaceCode || null;
		race.surface.desc = this.config.surfaces[surfaceCode] || null;
		race.surface.condition = raceCardRaces.getFormattedValue(raceIndex, 16) || null;
		
		raceTypeCode = raceCardRaces.getFormattedValue(raceIndex, 5);
		race.raceType = {};
		race.raceType.code = raceTypeCode || null;
		race.raceType.desc = this.config.raceTypes[raceTypeCode] || null;
		race.raceType.classRaceName = raceCardRaces.getFormattedValue(raceIndex, 17) || null;
		
		raceGradeCode = raceCardRaces.getValue(raceIndex, 6);
		race.raceGrade = {};
		race.raceGrade.code = raceGradeCode || 0;
		race.raceGrade.desc = this.config.raceGrades[raceGradeCode] || null;
		
		race.purse = {};
		race.purse.unit = "USD";
		race.purse.total = raceCardRaces.getValue(raceIndex, 7) || 0;
		
		// get the age and sex restriction details for this race
		ageSexRestrDesc = [];
		ageSexRestrCode = raceCardRaces.getFormattedValue(raceIndex, 8);
		raceAgeSexRestrArray = ageSexRestrCode.split("");
		ageSexRestrDesc[0] = this.config.ageSexRestrCode1[raceAgeSexRestrArray[0]].desc || null;
		ageSexRestrDesc[1] = this.config.ageSexRestrCode2[raceAgeSexRestrArray[1]].desc || null;
		ageSexRestrDesc[2] = this.config.ageSexRestrCode3[raceAgeSexRestrArray[2]].desc || null;
		race.ageSexRestr = {};
		race.ageSexRestr.code = ageSexRestrCode || null;
		race.ageSexRestr.desc = ageSexRestrDesc || null;
		race.ageSexRestr.shortDesc = (
			this.config.ageSexRestrCode1[raceAgeSexRestrArray[0]].shortDesc +
			this.config.ageSexRestrCode2[raceAgeSexRestrArray[1]].shortDesc +
			this.config.ageSexRestrCode3[raceAgeSexRestrArray[2]].shortDesc
		);
		
		race.isStatebred = (raceCardRaces.getValue(raceIndex, 9) === this.config.statebredFlag ? true : false);
		
		racePointsOfFractions = thorobase.Equibase.pointsOfFractions[race.distance.value];
		race.fractions = [];
		
		for (fractionsIndex = 0; fractionsIndex < racePointsOfFractions.length; fractionsIndex += 1) {
			if (racePointsOfFractions[fractionsIndex] && raceCardRaces.getValue(raceIndex, (10 + fractionsIndex)) ) {
				fraction = {
					pofDist: racePointsOfFractions[fractionsIndex], 
					pofTime: raceCardRaces.getValue(raceIndex, (10 + fractionsIndex)),
					splitStart: fractionsIndex === 0 ? 0 : fraction.pofDist,
					splitTime: fractionsIndex === 0 ? raceCardRaces.getValue(raceIndex, (10 + fractionsIndex)) : +( raceCardRaces.getValue(raceIndex, (10  + fractionsIndex)) - fraction.pofTime ).toFixed(2)
				};
				race.fractions.push(fraction);
			}
		}
		
		races.push(race);
	}

	return races;
};

thorobase.BRISImportChartData.parsePerformances = function (/* google.visualization.DataTable */ data, /* thorobase.RaceCard */ raceCard, /* thorobase.Race */ race) {

};

thorobase.BRISImportChartData.createThoroMotionData = function (/* thorobase.Race */ race) {

};
