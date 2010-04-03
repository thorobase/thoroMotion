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

		console.dir(this.config.raceCardCols);	
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

};

thorobase.BRISImportChartData.parsePerformances = function (/* google.visualization.DataTable */ data, /* thorobase.RaceCard */ raceCard, /* thorobase.Race */ race) {

};

thorobase.BRISImportChartData.createThoroMotionData = function (/* thorobase.Race */ race) {

};
