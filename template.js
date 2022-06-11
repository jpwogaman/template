//variable & input values to be sent to OSC
var allTrack_jsn = loadJSON("../template/tracks.json")
var artName__jsn = []
var artType__jsn = []
var artCode__jsn = []
var artDeflt_jsn = []
var artOn____jsn = []
var artOff___jsn = []
var artRange_jsn = []
var fadName__jsn = []
var fadType__jsn = []
var fadCode__jsn = []
var fadDeflt_jsn = []

for (i in allTrack_jsn) {
	var trackArrays = [allTrack_jsn[i]]
	for (var key in trackArrays) {
		if (!trackArrays.hasOwnProperty(key)) continue;
		var obj = trackArrays[key];
		for (var prop in obj) {
			if (!obj.hasOwnProperty(prop)) continue;
			if (prop.includes("artName__")) {
				artName__jsn.push(obj[prop])
			}
			if (prop.includes("artType__")) {
				artType__jsn.push(obj[prop])
			}
			if (prop.includes("artCode__")) {
				artCode__jsn.push(obj[prop])
			}
			if (prop.includes("artDeflt_")) {
				artDeflt_jsn.push(obj[prop])
			}
			if (prop.includes("artOn____")) {
				artOn____jsn.push(obj[prop])
			}
			if (prop.includes("artOff___")) {
				artOff___jsn.push(obj[prop])
			}
			if (prop.includes("artRange_")) {
				artRange_jsn.push(obj[prop])
			}
			if (prop.includes("fadName__")) {
				fadName__jsn.push(obj[prop])
			}
			if (prop.includes("fadCode__")) {
				fadCode__jsn.push(obj[prop])
			}
			if (prop.includes("fadDeflt_")) {
				fadDeflt_jsn.push(obj[prop])
			}
		}
	}
}
//variable & input ID's/addresses in OSC
var artName__osc = []
var artType__osc = []
var artCode__osc = []
var artInput_osc = []
var artDeflt_osc = []
var artOn____osc = []
var artOff___osc = []
var artRange_osc = []
var artColor_osc = []
var artModeA_osc = []
var artModeB_osc = []
var fadName__osc = []
var fadAddr__osc = []
var fadCode__osc = []

for (let i = 0; i < 18; i++) {
	artName__osc[i] = "/artname_" + parseInt(i + 1)
	artType__osc[i] = "/arttype_" + parseInt(i + 1)
	artCode__osc[i] = "/artcode_" + parseInt(i + 1)
	artInput_osc[i] = "/artinpt_" + parseInt(i + 1)
	artDeflt_osc[i] = "/artdeft_" + parseInt(i + 1)
	artOn____osc[i] = "/arton___" + parseInt(i + 1)
	artOff___osc[i] = "/artoff__" + parseInt(i + 1)
	artRange_osc[i] = "/artrang_" + parseInt(i + 1)
	artColor_osc[i] = "/artcolr_" + parseInt(i + 1)
	artModeA_osc[i] = "/artmodA_" + parseInt(i + 1)
	artModeB_osc[i] = "/artmodB_" + parseInt(i + 1)
}
for (let i = 0; i < 8; i++) {
	fadName__osc[i] = "/CC_disp_" + parseInt(i + 1)
	fadAddr__osc[i] = "/CC_fad__" + parseInt(i + 1)
	fadCode__osc[i] = "/CC_incr_" + parseInt(i + 1)
}
//array of all notes (Middle C == C3 == MIDI Code 60)
var allNotes_loc = []
for (let i = -2; i < 9; i++) {
	var cn = String('C' + i)
	var cs = String('C#' + i)
	var dn = String('D' + i)
	var ds = String('D#' + i)
	var en = String('E' + i)
	var fn = String('F' + i)
	var fs = String('F#' + i)
	var gn = String('G' + i)
	var gs = String('G#' + i)
	var an = String('A' + i)
	var as = String('A#' + i)
	var bn = String('B' + i)
	allNotes_loc.push(cn, cs, dn, ds, en, fn, fs, gn, gs, an, as, bn)
}
//toggle counters
var togUpdat_loc = false
var togCodes_loc = true
// var osc1 = false
// var osc2 = false
// var osc3 = false
// var osc4 = false
// var ctrl = false
// var note = false
// var ptch = false
// var keyP = false
// var myPorts__vrt = ["OSC1", "OSC2", "OSC3", "OSC4"]
// var myAddrs__vrt = ['/control', '/note', '/pitch', '/key_pressure']
// var myPorts__loc = [osc1, osc2, osc3, osc4]
// var myAddrs__loc = [ctrl, note, ptch, keyP]

module.exports = {

	init: function() {
		send("midi", "OSC1", "/control", 3, 17, 1) //'whole notes'
		send("midi", "OSC1", "/control", 3, 25, 1) //'grid'
		send("midi", "OSC1", "/control", 2, 09, 1) //'A5X + SUB8'
		setTimeout(() => {
			send("midi", "OSC1", "/control", 3, 20, 1) //grid eighth notes
		}, 100)
	},

	oscInFilter: function(data) {

		var { address, args, host, port } = data
		var arg1 = args[1].value
		var arg2 = args[2].value

		// for (i in myPorts__loc) {
		// 	if (port === myPorts__vrt[i]) {
		// 		myPorts__loc[i] = true
		// 	} else {
		// 		myPorts__loc[i] = false
		// 	}
		// }
		// for (i in myAddrs__loc) {
		// 	if (address === myAddrs__vrt[i]) {
		// 		myAddrs__loc[i] = true
		// 		console.log()
		// 	} else {
		// 		myAddrs__loc[i] = false
		// 	}
		// }
		///////////////////////////////////
		var osc1 = false
		var osc2 = false
		var osc3 = false
		var osc4 = false
		var ctrl = false
		var note = false
		var ptch = false
		var keyP = false
		if (port === 'OSC1') {
			osc1 = true
		}
		if (port === 'OSC2') {
			osc2 = true
		}
		if (port === 'OSC3') {
			osc3 = true
		}
		if (port === 'OSC4') {
			osc4 = true
		}
		if (address === '/control') {
			ctrl = true
		}
		if (address === '/note') {
			note = true
		}
		if (address === '/key_pressure') {
			keyP = true
		}
		///////////////////////////////////
		if (ctrl && osc2 && arg1 === 127) {
			if (arg2 === 1) {
				togUpdat_loc = true
			} else {
				togUpdat_loc = false
			}
		}

		if (ctrl && osc2 && arg1 === 119) {
			send("midi", "OSC4", "/control", 1, 127, 127)
			if (arg2 === 1) {
				togCodes_loc = true
			} else {
				togCodes_loc = false
			}
		}

		if (togUpdat_loc) {
			receive('/trackNameColor', '#70b7ff')
		} else {
			receive('/trackNameColor', 'red')
		}

		if (togUpdat_loc && ctrl && arg1 === 126 && arg2 !== 0) {
			send("midi", "OSC4", "/control", 1, 127, 127)
		}

		if (keyP) {

			var trkNumb = arg1 * 128 + arg2
			var trkRang = allTrack_jsn[trkNumb].INFO_XXX_trkRnge____
			var trkName = allTrack_jsn[trkNumb].INFO_001_trkName____
			var artRng3 = allTrack_jsn[trkNumb].INFO_057_artRange_03

			receive("/selectedTrackName", trkName)
			receive("/selectedTrackKeyRanges", trkRang)

			if (artRng3 === "") {
				receive('/keyRangeVar1', trkRang)
				receive('/keyRangeScript', 1)
			}

			for (let i = 0; i < 8; i++) {
				var fadIndx = trkNumb * 8 + i
				let nameOsc = fadName__osc[i]
				let addrOsc = fadAddr__osc[i]
				let codeOsc = fadCode__osc[i]
				let nameJsn = fadName__jsn[fadIndx]
				let codeJsn = parseInt(fadCode__jsn[fadIndx])
				let deftJsn = parseInt(fadDeflt_jsn[fadIndx])
				let fadPage = fadCode__jsn[4]

				receive(nameOsc, nameJsn)
				receive(addrOsc, deftJsn)
				receive(codeOsc, codeJsn)

				if (codeJsn !== null) {
					send("midi", "OSC4", "/control", 1, codeJsn, deftJsn)
				} else continue

				if (fadPage !== null) {
					receive('/faderPanel-color-2', "1px solid red")
				} else {
					receive('/faderPanel-color-2', "")
				}
			}
			for (let i = 0; i < 18; i++) {
				var artIndx = trkNumb * 18 + i
				let nameOsc = artName__osc[i]
				let typeOsc = artType__osc[i]
				let codeOsc = artCode__osc[i]
				let inptOsc = artInput_osc[i]
				let deftOsc = artDeflt_osc[i]
				let on__Osc = artOn____osc[i]
				let off_Osc = artOff___osc[i]
				let rangOsc = artRange_osc[i]
				let colrOsc = artColor_osc[i]
				let modAOsc = artModeA_osc[i]
				let modBOsc = artModeB_osc[i]
				let nameJsn = artName__jsn[artIndx]
				let typeJsn = artType__jsn[artIndx]
				let codeJsn = parseInt(artCode__jsn[artIndx])
				let deftJsn = parseInt(artDeflt_jsn[artIndx])
				let on__Jsn = parseInt(artOn____jsn[artIndx])
				let off_Jsn = parseInt(artOff___jsn[artIndx])
				let rangJsn = String(artRange_jsn[artIndx])
				let codeDsp

				if (typeJsn === "/control") {
					codeDsp = 'CC'
				} else if (typeJsn === "/note") {
					codeDsp = allNotes_loc[codeJsn] + '/'
				} else {
					codeDsp = ''
				}

				if (togCodes_loc && nameJsn !== "") {
					receive(nameOsc, nameJsn + ' (' + codeDsp + codeJsn + '/' + on__Jsn + ')')
				} else {
					receive(nameOsc, nameJsn)
				}

				if (rangJsn === "") {
					receive(rangOsc, " ")
				} else {
					receive(rangOsc, rangJsn)
				}

				receive(typeOsc, typeJsn)
				receive(codeOsc, codeJsn)
				receive(deftOsc, deftJsn)
				receive(on__Osc, on__Jsn)
				receive(off_Osc, off_Jsn)
				receive(modAOsc, 0.15)
				receive(modBOsc, 0.15)

				if (nameJsn === "") {
					receive(nameOsc, " ")
					receive(inptOsc, "true")
					receive(colrOsc, "#A9A9A9")
				} else {
					receive(inptOsc, "false")
					if (i <= 1) {
						receive(colrOsc, "#a86739")
						send("midi", "OSC3", typeJsn, 1, codeJsn, deftJsn)
					} else {
						receive(colrOsc, "#6dfdbb")
						receive(deftOsc, deftJsn)
						if (deftJsn !== 0) {
							receive(modAOsc, 0.75)
							send("midi", "OSC4", typeJsn, 1, codeJsn, deftJsn)
							receive('/keyRangeVar1', rangJsn)
							receive('/keyRangeScript', 1)
						}
					}
				}
			}
		}
		return { address, args, host, port }
	}
};