var autoUpdate = 1

module.exports = {

	oscInFilter: function(data) {

		console.log(autoUpdate)

		var { address, args, host, port } = data;

		if (address === "/control" && args[1].value === 127 && args[2].value === 1) {
			autoUpdate = 1
		} else if (address === "/control" && args[1].value === 127 && args[2].value === 0) {
			autoUpdate = 0
		} else {}

		if (autoUpdate == 1 && address === "/control" && args[1].value === 126 && args[2].value !== 0) {
			send("midi", "OSC4", "/control", 1, 127, 127);
		}

		var tracks = loadJSON("../template/tracks.json");

		if (address === "/key_pressure") {

			var x = args[1].value;
			var y = args[2].value;
			x = x * 128 + y;

			receive("/selectedTrackName", tracks[x].Track);

			tracks = [tracks[x]];

			var artButtonsNamesVars = [];
			var artButtonsModesAVars = [];
			var artButtonsModesBVars = [];
			var artButtonsTypesVars = [];
			var artButtonsCodesVars = [];
			var artButtonsColorsVars = [];
			var artButtonsDefaultsVars = [];
			var artButtonsOnsVars = [];
			var artButtonsOffsVars = [];
			var artButtonsInputsVars = [];

			var fadCodesVars = [];
			var fadDefaultsVars = [];
			var fadNamesVars = [];
			var fadIDsVars = [];

			var artButtonsNames = [];
			var artButtonsTypes = [];
			var artButtonsCodes = [];
			var artButtonsDefaults = [];
			var artButtonsOns = [];
			var artButtonsOffs = [];
			var artButtonsInputs = [];

			var fadCodes = [];
			var fadDefaults = [];
			var fadNames = [];

			for (var key in tracks) {

				if (!tracks.hasOwnProperty(key)) continue;
				var obj = tracks[key];

				for (var prop in obj) {

					if (!obj.hasOwnProperty(prop)) continue;

					if (prop.includes("_Name")) {

						artButtonsNames.push(obj[prop]);

					} else if (prop.includes("_Type")) {

						artButtonsTypes.push(obj[prop]);

					} else if (prop.includes("_Code")) {

						artButtonsCodes.push(obj[prop]);

					} else if (prop.includes("_Default")) {

						artButtonsDefaults.push(obj[prop]);

					} else if (prop.includes("_On")) {

						artButtonsOns.push(obj[prop]);

					} else if (prop.includes("_Off")) {

						artButtonsOffs.push(obj[prop]);

					} else if (prop.includes("FadA")) {

						fadCodes.push(obj[prop]);

					} else if (prop.includes("FadB")) {

						fadDefaults.push(obj[prop]);

					} else if (prop.includes("FadC")) {

						fadNames.push(obj[prop]);

					} else {

						continue;

					}
				}
			}
			for (let i = 0; i < 8; i++) {

				fadCodesVars[i] = "/CC" + (i + 1) + "_increment_value";
				// fadDefaultsVars[i] = "/CC_Preset_CC" + (i + 1) + "_Default"; //might not need this at all
				fadNamesVars[i] = "/CC" + (i + 1) + "_display_Setting";
				fadIDsVars[i] = "/CC" + (i + 1) + "_fader"

				receive(fadCodesVars[i], parseInt(fadCodes[i]));
				// receive(fadDefaultsVars[i], parseInt(fadDefaults[i])); //might not need this at all
				receive(fadNamesVars[i], fadNames[i]);
				receive(fadIDsVars[i], parseInt(fadDefaults[i]));

				if (fadCodes[i] !== null) {

					send("midi", "OSC4", "/control", 1, parseInt(fadCodes[i]), parseInt(fadDefaults[i]));

				} else {

					continue;

				}
			}
			for (let i = 0; i < 18; i++) {

				artButtonsNamesVars[i] = "/art" + (i + 1) + "name";
				artButtonsModesAVars[i] = "/art" + (i + 1) + "modeA";
				artButtonsModesBVars[i] = "/art" + (i + 1) + "modeB";
				artButtonsTypesVars[i] = "/art" + (i + 1) + "type";
				artButtonsCodesVars[i] = "/art" + (i + 1) + "code";
				artButtonsColorsVars[i] = "/art" + (i + 1) + "color";
				artButtonsDefaultsVars[i] = "/art" + (i + 1) + "default";
				artButtonsOnsVars[i] = "/art" + (i + 1) + "on";
				artButtonsOffsVars[i] = "/art" + (i + 1) + "off";
				artButtonsInputsVars[i] = "/art" + (i + 1) + "input";

				receive(artButtonsNamesVars[i], String(artButtonsNames[i]));
				receive(artButtonsTypesVars[i], String(artButtonsTypes[i]));
				receive(artButtonsCodesVars[i], parseInt(artButtonsCodes[i]));
				receive(artButtonsDefaultsVars[i], parseInt(artButtonsDefaults[i]));
				receive(artButtonsOnsVars[i], parseInt(artButtonsOns[i]));
				receive(artButtonsOffsVars[i], parseInt(artButtonsOffs[i]));
				receive(artButtonsModesAVars[i], 0.15); // reset
				receive(artButtonsModesBVars[i], 0.15); // reset

				//NESTED IF'S PROBABLY NOT GREAT IDEA

				if (artButtonsNames[i] === "") {

					receive(artButtonsInputsVars[i], "true");
					receive(artButtonsColorsVars[i], "#A9A9A9");

				} else {

					receive(artButtonsInputsVars[i], "false");

					if (artButtonsNamesVars[i] === "/art1name" || artButtonsNamesVars[i] === "/art2name") {

						receive(artButtonsColorsVars[i], "#a86739");
						send("midi", "OSC3", String(artButtonsTypes[i]), 1, parseInt(artButtonsCodes[i]), parseInt(artButtonsDefaults[i]));

					} else {

						receive(artButtonsColorsVars[i], "#6dfdbb");
						receive(artButtonsDefaultsVars[i], parseInt(artButtonsDefaults[i]));

						if (parseInt(artButtonsDefaults[i]) !== 0) {

							receive(artButtonsModesAVars[i], 0.75);
							send("midi", "OSC4", String(artButtonsTypes[i]), 1, parseInt(artButtonsCodes[i]), parseInt(artButtonsDefaults[i]));

						} else {

						}
					}
				}
			}
		}

		return { address, args, host, port };

	}
};