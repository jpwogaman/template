var tracks = loadJSON("../template/tracks.json")
const allNotes = ["C-2", "C#-2", "D-2", "D#-2", "E-2", "F-2", "F#-2", "G-2", "G#-2", "A-2", "A#-2", "B-2", "C-1", "C#-1", "D-1", "D#-1", "E-1", "F-1", "F#-1", "G-1", "G#-1", "A-1", "A#-1", "B-1", "C0", "C#0", "D0", "D#0", "E0", "F0", "F#0", "G0", "G#0", "A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1", "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5", "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6", "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7", "C8", "C#8", "D8", "D#8", "E8", "F8", "F#8", "G8", "G#8", "A8", "A#8", "B8", "C9", "C#9", "D9", "D#9", "E9", "F9", "F#9", "G9"]
var artNamesVars = []
var artRangsVars = []
var artModsAVars = []
var artModsBVars = []
var artTypesVars = []
var artCodesVars = []
var artColrsVars = []
var artDeftsVars = []
var artOns__Vars = []
var artOffs_Vars = []
var artInptsVars = []
var fadCodesVars = []
var fadNamesVars = []
var fadIDs__Vars = []
var artNames____ = []
var artRangs____ = []
var artTypes____ = []
var artCodes____ = []
var artDefts____ = []
var artOns______ = []
var artOffs_____ = []
var artInpts____ = []
var fadCodes____ = []
var fadDefts____ = []
var fadNames____ = []

for (let i = 0; i < 18; i++) {
	artNamesVars[i] = "/artname_" + parseInt(i + 1)
	artRangsVars[i] = "/artrang_" + parseInt(i + 1)
	artModsAVars[i] = "/artmodA_" + parseInt(i + 1)
	artModsBVars[i] = "/artmodB_" + parseInt(i + 1)
	artTypesVars[i] = "/arttype_" + parseInt(i + 1)
	artCodesVars[i] = "/artcode_" + parseInt(i + 1)
	artColrsVars[i] = "/artcolr_" + parseInt(i + 1)
	artDeftsVars[i] = "/artdeft_" + parseInt(i + 1)
	artOns__Vars[i] = "/arton___" + parseInt(i + 1)
	artOffs_Vars[i] = "/artoff__" + parseInt(i + 1)
	artInptsVars[i] = "/artinpt_" + parseInt(i + 1)
}

for (let i = 0; i < 8; i++) {
	fadCodesVars[i] = "/CC_incr_" + parseInt(i + 1)
	fadNamesVars[i] = "/CC_disp_" + parseInt(i + 1)
	fadIDs__Vars[i] = "/CC_fad__" + parseInt(i + 1)
}

for (i in tracks) {
	trackArrays = [tracks[i]]
	for (var key in trackArrays) {
		if (!trackArrays.hasOwnProperty(key)) continue;
		var obj = trackArrays[key];
		for (var prop in obj) {
			if (!obj.hasOwnProperty(prop)) continue;
			if (prop.includes("_Name")) {
				artNames____.push(obj[prop])
			} else if (prop.includes("_Range")) {
				artRangs____.push(obj[prop])
			} else if (prop.includes("_Type")) {
				artTypes____.push(obj[prop])
			} else if (prop.includes("_Code")) {
				artCodes____.push(obj[prop])
			} else if (prop.includes("_Default")) {
				artDefts____.push(obj[prop])
			} else if (prop.includes("_On")) {
				artOns______.push(obj[prop])
			} else if (prop.includes("_Off")) {
				artOffs_____.push(obj[prop])
			} else if (prop.includes("FadA")) {
				fadCodes____.push(obj[prop])
			} else if (prop.includes("FadB")) {
				fadDefts____.push(obj[prop])
			} else if (prop.includes("FadC")) {
				fadNames____.push(obj[prop])
			} else continue
		}
	}
}

var autoUpdate = false
var showCodes = true

module.exports = {

	init: function() {

		send("midi", "OSC1", "/control", 3, 17, 1) //'whole notes'
		send("midi", "OSC1", "/control", 3, 25, 1) //'grid'
		send("midi", "OSC1", "/control", 2, 9, 1) //'A5X + SUB8'

		setTimeout(() => {
			send("midi", "OSC1", "/control", 3, 20, 1) //grid eighth notes
		}, 100)

	},

	oscInFilter: function(data) {

		var { address, args, host, port } = data
		var arg1 = args[1].value
		var arg2 = args[2].value
		var osc1 = false
		var osc2 = false
		var osc3 = false
		var osc4 = false
		var control = false
		var note = false
		var keyPressure = false

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
			control = true
		}
		if (address === '/note') {
			note = true
		}
		if (address === '/key_pressure') {
			keyPressure = true
		}

		if (control && osc2 && arg1 === 127) {
			if (arg2 === 1) {
				autoUpdate = true
			} else {
				autoUpdate = false
			}
		}

		if (control && osc2 && arg1 === 119) {
			send("midi", "OSC4", "/control", 1, 127, 127)
			if (arg2 === 1) {
				showCodes = true
			} else {
				showCodes = false
			}
		}

		if (autoUpdate) {
			receive('/trackNameColor', '#70b7ff')
		} else {
			receive('/trackNameColor', 'red')
		}

		if (autoUpdate && control && arg1 === 126 && arg2 !== 0) {
			send("midi", "OSC4", "/control", 1, 127, 127)
		}

		if (keyPressure) {
			var x = arg1 * 128 + arg2
			var fullRange = tracks[x].Key_FullRanges

			receive("/selectedTrackName", tracks[x].Track)
			receive("/selectedTrackKeyRanges", fullRange)

			if (tracks[x].Art3_rang___ === "") {
				receive('/keyRangeVar1', fullRange)
				receive('/keyRangeScript', 1)
			}

			for (let i = 0; i < 8; i++) {
				var y = x * 8 + i
				let id__Var = fadIDs__Vars[i]
				let nameVar = fadNamesVars[i]
				let codeVar = fadCodesVars[i]
				let name___ = fadNames____[y]
				let code___ = parseInt(fadCodes____[y])
				let deft___ = parseInt(fadDefts____[y])
				let fadPge2 = fadCodes____[4]

				receive(codeVar, code___)
				receive(nameVar, name___)
				receive(id__Var, deft___)

				if (code___ !== null) {
					send("midi", "OSC4", "/control", 1, code___, deft___)
				} else continue

				if (fadPge2 !== null) {
					receive('/faderPanel-color-2', "1px solid red")
				} else {
					receive('/faderPanel-color-2', "")
				}
			}
			for (let i = 0; i < 18; i++) {
				var y = x * 18 + i
				let zz
				let typeVar = artTypesVars[i]
				let codeVar = artCodesVars[i]
				let nameVar = artNamesVars[i]
				let rangVar = artRangsVars[i]
				let deftVar = artDeftsVars[i]
				let on__Var = artOns__Vars[i]
				let off_Var = artOffs_Vars[i]
				let modAVar = artModsAVars[i]
				let modBVar = artModsBVars[i]
				let inptVar = artInptsVars[i]
				let colrVar = artColrsVars[i]
				let name___ = artNames____[y]
				let type___ = artTypes____[y]
				let rang___ = String(artRangs____[y])
				let code___ = parseInt(artCodes____[y])
				let on_____ = parseInt(artOns______[y])
				let off____ = parseInt(artOffs_____[y])
				let deft___ = parseInt(artDefts____[y])

				if (type___ === "/control") {
					zz = 'CC'
				} else if (type___ === "/note") {
					zz = allNotes[code___] + '/'
				} else {
					zz = ''
				}

				if (showCodes && name___ != "") {
					receive(nameVar, name___ + ' (' + zz + code___ + '/' + on_____ + ')')
				} else {
					receive(nameVar, name___)
				}

				if (rang___ === "") {
					receive(rangVar, " ")
				} else {
					receive(rangVar, rang___)
				}

				receive(typeVar, type___)
				receive(codeVar, code___)
				receive(deftVar, deft___)
				receive(on__Var, on_____)
				receive(off_Var, off____)
				receive(modAVar, 0.15)
				receive(modBVar, 0.15)

				if (name___ === "") {
					receive(nameVar, " ")
					receive(inptVar, "true")
					receive(colrVar, "#A9A9A9")
				} else {
					receive(inptVar, "false")
					if (i <= 1) {
						receive(colrVar, "#a86739")
						send("midi", "OSC3", type___, 1, code___, deft___)
					} else {
						receive(colrVar, "#6dfdbb")
						receive(deftVar, deft___)
						if (deft___ !== 0) {
							receive(modAVar, 0.75)
							send("midi", "OSC4", type___, 1, code___, deft___)
							receive('/keyRangeVar1', rang___)
							receive('/keyRangeScript', 1)
						}
					}
				}
			}
		}
		return { address, args, host, port }
	}
};