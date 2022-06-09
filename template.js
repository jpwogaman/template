var tracks = loadJSON("../template/tracks.json")
const allNotes = ["C-2", "C#-2", "D-2", "D#-2", "E-2", "F-2", "F#-2", "G-2", "G#-2", "A-2", "A#-2", "B-2", "C-1", "C#-1", "D-1", "D#-1", "E-1", "F-1", "F#-1", "G-1", "G#-1", "A-1", "A#-1", "B-1", "C0", "C#0", "D0", "D#0", "E0", "F0", "F#0", "G0", "G#0", "A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1", "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5", "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6", "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7", "C8", "C#8", "D8", "D#8", "E8", "F8", "F#8", "G8", "G#8", "A8", "A#8", "B8", "C9", "C#9", "D9", "D#9", "E9", "F9", "F#9", "G9"]
var artButtonsNamesVars = []
var artButtonsRangesVars = []
var artButtonsModesAVars = []
var artButtonsModesBVars = []
var artButtonsTypesVars = []
var artButtonsCodesVars = []
var artButtonsColorsVars = []
var artButtonsDefaultsVars = []
var artButtonsOnsVars = []
var artButtonsOffsVars = []
var artButtonsInputsVars = []
var fadCodesVars = []
var fadDefaultsVars = []
var fadNamesVars = []
var fadIDsVars = []

for (let i = 0; i < 18; i++) {
	artButtonsNamesVars[i] = "/art" + (i + 1) + "name"
	artButtonsRangesVars[i] = "/art" + (i + 1) + "range"
	artButtonsModesAVars[i] = "/art" + (i + 1) + "modeA"
	artButtonsModesBVars[i] = "/art" + (i + 1) + "modeB"
	artButtonsTypesVars[i] = "/art" + (i + 1) + "type"
	artButtonsCodesVars[i] = "/art" + (i + 1) + "code"
	artButtonsColorsVars[i] = "/art" + (i + 1) + "color"
	artButtonsDefaultsVars[i] = "/art" + (i + 1) + "default"
	artButtonsOnsVars[i] = "/art" + (i + 1) + "on"
	artButtonsOffsVars[i] = "/art" + (i + 1) + "off"
	artButtonsInputsVars[i] = "/art" + (i + 1) + "input"
}

for (let i = 0; i < 8; i++) {
	fadCodesVars[i] = "/CC" + (i + 1) + "_increment_value"
	fadNamesVars[i] = "/CC" + (i + 1) + "_display_Setting"
	fadIDsVars[i] = "/CC" + (i + 1) + "_fader"
}

var artButtonsNames = []
var artButtonRanges = []
var artButtonsTypes = []
var artButtonsCodes = []
var artButtonsDefaults = []
var artButtonsOns = []
var artButtonsOffs = []
var artButtonsInputs = []
var fadCodes = []
var fadDefaults = []
var fadNames = []

for (i in tracks) {
	trackArrays = [tracks[i]]
	for (var key in trackArrays) {
		if (!trackArrays.hasOwnProperty(key)) continue;
		var obj = trackArrays[key];
		for (var prop in obj) {
			if (!obj.hasOwnProperty(prop)) continue;
			if (prop.includes("_Name")) {
				artButtonsNames.push(obj[prop])
			} else if (prop.includes("_Range")) {
				artButtonRanges.push(obj[prop])
			} else if (prop.includes("_Type")) {
				artButtonsTypes.push(obj[prop])
			} else if (prop.includes("_Code")) {
				artButtonsCodes.push(obj[prop])
			} else if (prop.includes("_Default")) {
				artButtonsDefaults.push(obj[prop])
			} else if (prop.includes("_On")) {
				artButtonsOns.push(obj[prop])
			} else if (prop.includes("_Off")) {
				artButtonsOffs.push(obj[prop])
			} else if (prop.includes("FadA")) {
				fadCodes.push(obj[prop])
			} else if (prop.includes("FadB")) {
				fadDefaults.push(obj[prop])
			} else if (prop.includes("FadC")) {
				fadNames.push(obj[prop])
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

			if (tracks[x].Art3_Range === "") {
				receive('/keyRangeVar1', fullRange)
				receive('/keyRangeScript', 1)
			}

			for (let i = 0; i < 8; i++) {
				var y = x * 8 + i
				let idVar = fadIDsVars[i]
				let nameVar = fadNamesVars[i]
				let codeVar = fadCodesVars[i]
				let name = fadNames[y]
				let code = parseInt(fadCodes[y])
				let defa = parseInt(fadDefaults[y])
				let fadPage2 = fadCodes[4]

				receive(codeVar, code)
				receive(nameVar, name)
				receive(idVar, defa)

				if (code !== null) {
					send("midi", "OSC4", "/control", 1, code, defa)
				} else continue

				if (fadPage2 !== null) {
					receive('/faderPanel-color-2', "1px solid red")
				} else {
					receive('/faderPanel-color-2', "")
				}
			}
			for (let i = 0; i < 18; i++) {
				var y = x * 18 + i
				let zz
				let typeVar = artButtonsTypesVars[i]
				let codeVar = artButtonsCodesVars[i]
				let nameVar = artButtonsNamesVars[i]
				let rangeVar = artButtonsRangesVars[i]
				let defaVar = artButtonsDefaultsVars[i]
				let onVar = artButtonsOnsVars[i]
				let offVar = artButtonsOffsVars[i]
				let modeAVar = artButtonsModesAVars[i]
				let modeBVar = artButtonsModesBVars[i]
				let inputVar = artButtonsInputsVars[i]
				let colorVar = artButtonsColorsVars[i]
				let name = artButtonsNames[y]
				let type = artButtonsTypes[y]
				let range = String(artButtonRanges[y])
				let code = parseInt(artButtonsCodes[y])
				let on = parseInt(artButtonsOns[y])
				let off = parseInt(artButtonsOffs[y])
				let defa = parseInt(artButtonsDefaults[y])

				if (type === "/control") {
					zz = 'CC'
				} else if (type === "/note") {
					zz = allNotes[code] + '/'
				} else {
					zz = ''
				}

				if (showCodes && name != "") {
					receive(nameVar, name + ' (' + zz + code + '/' + on + ')')
				} else {
					receive(nameVar, name)
				}

				if (range === "") {
					receive(rangeVar, " ")
				} else {
					receive(rangeVar, range)
				}

				receive(typeVar, type)
				receive(codeVar, code)
				receive(defaVar, defa)
				receive(onVar, on)
				receive(offVar, off)
				receive(modeAVar, 0.15)
				receive(modeBVar, 0.15)

				if (name === "") {
					receive(nameVar, " ")
					receive(inputVar, "true")
					receive(colorVar, "#A9A9A9")
				} else {
					receive(inputVar, "false")
					if (i <= 1) {
						receive(colorVar, "#a86739")
						send("midi", "OSC3", type, 1, code, defa)
					} else {
						receive(colorVar, "#6dfdbb")
						receive(defaVar, defa)
						if (defa !== 0) {
							receive(modeAVar, 0.75)
							send("midi", "OSC4", type, 1, code, defa)
							if (i > 1) {
								receive('/keyRangeVar1', range)
								receive('/keyRangeScript', 1)
							}
						}
					}
				}
			}
		}
		return { address, args, host, port }
	}
};