var autoUpdate = 0
var showCodes = 1
var midiMonitor = 0
var monitorTimeOut = 0

const allNotes = ["C-2", "C#-2", "D-2", "D#-2", "E-2", "F-2", "F#-2", "G-2", "G#-2", "A-2", "A#-2", "B-2", "C-1", "C#-1", "D-1", "D#-1", "E-1", "F-1", "F#-1", "G-1", "G#-1", "A-1", "A#-1", "B-1", "C0", "C#0", "D0", "D#0", "E0", "F0", "F#0", "G0", "G#0", "A0", "A#0", "B0", "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1", "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3", "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4", "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5", "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6", "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7", "A7", "A#7", "B7", "C8", "C#8", "D8", "D#8", "E8", "F8", "F#8", "G8", "G#8", "A8", "A#8", "B8", "C9", "C#9", "D9", "D#9", "E9", "F9", "F#9", "G9"]

const keyRangeColors = ["#ff0000", "#8a6dfd", "#9a3515", "#267555", "#176cbc", "#18b205"]

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

var tracks = loadJSON("../template/tracks.json")

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

			} else {

				continue;

			}
		}
	}
}

module.exports = {

	init: function() {

		send("midi", "OSC1", "/control", 3, 17, 1) //grid 'whole notes' resets triplet/dotted
		send("midi", "OSC1", "/control", 3, 25, 1) //reset grid/events to 'grid'
		send("midi", "OSC1", "/control", 2, 9, 1) //reset SoundID/Control Room preset to 'A5X + SUB8'

		setTimeout(() => {
			//grid eighth notes
			send("midi", "OSC1", "/control", 3, 20, 1)
		}, 100)

	},


	oscInFilter: function(data) {

		var { address, args, host, port } = data

		var arg1 = args[1].value
		var arg2 = args[2].value

		if (address === "/control" && port === 'OSC2' & arg1 === 127 && arg2 === 1) {
			autoUpdate = 1
			midiMonitor = 0
		} else if (address === "/control" && port === 'OSC2' && arg1 === 127 && arg2 === 0) {
			autoUpdate = 0
		} else {}

		if (address === "/control" && port === 'OSC2' && arg1 === 126 && arg2 === 1) {
			midiMonitor = 1
			autoUpdate = 0
		} else if (address === "/control" && port === 'OSC2' && arg1 === 126 && arg2 === 0) {
			midiMonitor = 0
		} else {}

		if (address === "/control" && port === 'OSC2' & arg1 === 119 && arg2 === 1) {
			showCodes = 1
			send("midi", "OSC4", "/control", 1, 127, 127);
		} else if (address === "/control" && port === 'OSC2' && arg1 === 119 && arg2 === 0) {
			showCodes = 0
			send("midi", "OSC4", "/control", 1, 127, 127);
		} else {}

		if (autoUpdate === 1) {
			receive('/trackNameColor', '#70b7ff')
		} else if (autoUpdate === 0) {
			receive('/trackNameColor', 'red')
		}

		if (autoUpdate === 1 && address === "/control" && arg1 === 126 && arg2 !== 0) {
			send("midi", "OSC4", "/control", 1, 127, 127);
		}

		//seems like Cubase is always going to chase what is on the track? will always SOUND like what is on the track, anyways. just won't always display correctly.. strange

		if (midiMonitor === 1 && port === 'OSC2' && arg1 !== 126 && arg1 !== 127) {

			if (monitorTimeOut !== 1 && address === "/control") {

				send("midi", "OSC3", "/control", ...args)
				monitorTimeOut = 1 //console will go CRAZY if this is not here...don't think this is the answer here but hmmmmmm. just want it to display what's on the track if I select "Auto Monitor"
				console.log(monitorTimeOut)
				setTimeout(function() {
					monitorTimeOut = 0
					console.log(monitorTimeOut)
				}, 2000)
			}
		}

		// if (address === "/key_pressure") {
		//
		// 	var x = arg1 * 128 + arg2
		// 	var y
		// 	var z
		//
		// 	receive("/selectedTrackName", tracks[x].Track)
		// 	receive("/selectedTrackKeyRanges", tracks[x].Key_FullRanges)
		//
		// 	if (tracks[x].Art3_Range === "") {
		// 		var z = tracks[x].Key_FullRanges
		// 		receive('/keyRangeVar1', z)
		// 		receive('/keyRangeScript', 1)
		// 	}
		//
		// 	for (let i = 0; i < 8; i++) {
		//
		// 		y = x * 7 + (x + i)
		// 		z = y + 4
		//
		// 		receive(fadCodesVars[i], parseInt(fadCodes[y]))
		// 		receive(fadNamesVars[i], fadNames[y])
		// 		receive(fadIDsVars[i], parseInt(fadDefaults[y]))
		//
		// 		if (fadCodes[y] !== null) {
		//
		// 			send("midi", "OSC4", "/control", 1, parseInt(fadCodes[y]), parseInt(fadDefaults[y]))
		//
		// 		} else {
		//
		// 			continue;
		//
		// 		}
		// 		if (fadCodes[z] !== null) {
		// 			receive('/faderPanel-color-2', "1px solid red")
		// 		} else {
		// 			receive('/faderPanel-color-2', "")
		// 		}
		//
		// 	}
		//
		// 	for (let i = 0; i < 18; i++) {
		//
		// 		y = x * 17 + (x + i)
		//
		// 		if (String(artButtonsTypes[y]) === "/control") {
		// 			z = 'CC'
		// 		} else if (String(artButtonsTypes[y]) === "/note") {
		// 			z = allNotes[artButtonsCodes[y]] + '/'
		// 		} else {
		// 			z = ''
		// 		}
		//
		// 		if (showCodes === 1) {
		// 			if (String(artButtonsNames[y]) !== "") {
		// 				receive(artButtonsNamesVars[i], String(artButtonsNames[y]) + ' (' + z + String(artButtonsCodes[y]) + '/' + parseInt(artButtonsOns[y]) + ')')
		// 			}
		// 		} else {
		// 			receive(artButtonsNamesVars[i], String(artButtonsNames[y]))
		// 		}
		//
		// 		if (String(artButtonRanges[y]) === "") {
		// 			receive(artButtonsRangesVars[i], "")
		// 		} else {
		// 			receive(artButtonsRangesVars[i], String(artButtonRanges[y]))
		// 		}
		//
		// 		receive(artButtonsTypesVars[i], String(artButtonsTypes[y]))
		// 		receive(artButtonsCodesVars[i], parseInt(artButtonsCodes[y]))
		// 		receive(artButtonsDefaultsVars[i], parseInt(artButtonsDefaults[y]))
		// 		receive(artButtonsOnsVars[i], parseInt(artButtonsOns[y]))
		// 		receive(artButtonsOffsVars[i], parseInt(artButtonsOffs[y]))
		// 		receive(artButtonsModesAVars[i], 0.15) // reset
		// 		receive(artButtonsModesBVars[i], 0.15) // reset
		//
		// 		//NESTED IF'S PROBABLY NOT GREAT IDEA
		//
		// 		if (String(artButtonsNames[y]) === "") {
		// 			receive(artButtonsNamesVars[i], " ")
		// 			receive(artButtonsInputsVars[i], "true")
		// 			receive(artButtonsColorsVars[i], "#A9A9A9")
		//
		// 		} else {
		//
		// 			receive(artButtonsInputsVars[i], "false")
		//
		// 			if (artButtonsNamesVars[i] === "/art1name" || artButtonsNamesVars[i] === "/art2name") {
		//
		// 				receive(artButtonsColorsVars[i], "#a86739")
		// 				send("midi", "OSC3", String(artButtonsTypes[y]), 1, parseInt(artButtonsCodes[y]), parseInt(artButtonsDefaults[y]))
		//
		// 			} else {
		//
		// 				receive(artButtonsColorsVars[i], "#6dfdbb")
		// 				receive(artButtonsDefaultsVars[i], parseInt(artButtonsDefaults[y]))
		//
		// 				if (parseInt(artButtonsDefaults[y]) !== 0) {
		//
		// 					receive(artButtonsModesAVars[i], 0.75)
		// 					send("midi", "OSC4", String(artButtonsTypes[y]), 1, parseInt(artButtonsCodes[y]), parseInt(artButtonsDefaults[y]))
		//
		// 					if (i > 1) {
		//						z = artButtonRanges[i]
		//						receive('/keyRangeVar1', z)
		//						receive('/keyRangeScript', 1)
		//					}
		//
		// 				} else {
		//
		// 				}
		// 			}
		// 		}
		// 	}
		// }

		if (address === "/key_pressure") {

			artButtonsNames = []
			artButtonRanges = []
			artButtonsTypes = []
			artButtonsCodes = []
			artButtonsDefaults = []
			artButtonsOns = []
			artButtonsOffs = []
			artButtonsInputs = []

			fadCodes = []
			fadDefaults = []
			fadNames = []

			var x = arg1 * 128 + arg2

			receive("/selectedTrackName", tracks[x].Track)
			receive("/selectedTrackKeyRanges", tracks[x].Key_FullRanges)

			if (tracks[x].Art3_Range === "") {
				var z = tracks[x].Key_FullRanges
				receive('/keyRangeVar1', z)
				receive('/keyRangeScript', 1)
			}

			trackArrays = [tracks[x]]

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

					} else {

						continue;

					}
				}
			}

			for (let i = 0; i < 8; i++) {

				receive(fadCodesVars[i], parseInt(fadCodes[i]))
				receive(fadNamesVars[i], fadNames[i])
				receive(fadIDsVars[i], parseInt(fadDefaults[i]))

				if (fadCodes[i] !== null) {

					send("midi", "OSC4", "/control", 1, parseInt(fadCodes[i]), parseInt(fadDefaults[i]))

				} else {

					continue;

				}
				if (fadCodes[4] !== null) {
					receive('/faderPanel-color-2', "1px solid red")
				} else {
					receive('/faderPanel-color-2', "")
				}


			}
			for (let i = 0; i < 18; i++) {

				let z

				if (String(artButtonsTypes[i]) === "/control") {
					z = 'CC'
				} else if (String(artButtonsTypes[i]) === "/note") {
					z = allNotes[artButtonsCodes[i]] + '/'
				} else {
					z = ''
				}

				if (showCodes === 1) {
					if (String(artButtonsNames[i]) !== "") {
						receive(artButtonsNamesVars[i], String(artButtonsNames[i]) + ' (' + z + String(artButtonsCodes[i]) + '/' + parseInt(artButtonsOns[i]) + ')')
					}
				} else {
					receive(artButtonsNamesVars[i], String(artButtonsNames[i]))
				}

				if (String(artButtonRanges[i]) === "") {
					receive(artButtonsRangesVars[i], " ")
				} else {
					receive(artButtonsRangesVars[i], String(artButtonRanges[i]))
				}
				
				receive(artButtonsTypesVars[i], String(artButtonsTypes[i]))
				receive(artButtonsCodesVars[i], parseInt(artButtonsCodes[i]))
				receive(artButtonsDefaultsVars[i], parseInt(artButtonsDefaults[i]))
				receive(artButtonsOnsVars[i], parseInt(artButtonsOns[i]))
				receive(artButtonsOffsVars[i], parseInt(artButtonsOffs[i]))
				receive(artButtonsModesAVars[i], 0.15) // reset
				receive(artButtonsModesBVars[i], 0.15) // reset

				//NESTED IF'S PROBABLY NOT GREAT IDEA

				if (String(artButtonsNames[i]) === "") {
					receive(artButtonsNamesVars[i], " ")
					receive(artButtonsInputsVars[i], "true")
					receive(artButtonsColorsVars[i], "#A9A9A9")

				} else {

					receive(artButtonsInputsVars[i], "false")

					if (artButtonsNamesVars[i] === "/art1name" || artButtonsNamesVars[i] === "/art2name") {

						receive(artButtonsColorsVars[i], "#a86739")
						send("midi", "OSC3", String(artButtonsTypes[i]), 1, parseInt(artButtonsCodes[i]), parseInt(artButtonsDefaults[i]))

					} else {

						receive(artButtonsColorsVars[i], "#6dfdbb")
						receive(artButtonsDefaultsVars[i], parseInt(artButtonsDefaults[i]))

						if (parseInt(artButtonsDefaults[i]) !== 0) {

							receive(artButtonsModesAVars[i], 0.75)
							send("midi", "OSC4", String(artButtonsTypes[i]), 1, parseInt(artButtonsCodes[i]), parseInt(artButtonsDefaults[i]))

							if (i > 1) {
								z = artButtonRanges[i]
								receive('/keyRangeVar1', z)
								receive('/keyRangeScript', 1)
							}

						} else {

						}
					}
				}
			}

		}

		return { address, args, host, port }

	}
};