module.exports = {

	oscInFilter: function(data) {

		var {
			address,
			args,
			host,
			port
		} = data

		if (address === '/control' && args[1].value === 126 && args[2].value !== 0) {

			send('midi', 'OSC4', '/control', 1, 127, 127)

		} else {}

		var tracks = loadJSON('../template/tracks.json')

		if (address === '/key_pressure') {

			var x = args[1].value
			var y = args[2].value

			x = (x * 128) + y

			receive('/text_1', tracks[x].Track)
			tracks = [tracks[x]]

			var artButtonsNamesVars = [];
			var artButtonsModesVars = [];
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

			var artButtonsNames = [];
			var artButtonsModes = [];
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
					if (prop.includes('_Name')) {
						artButtonsNames.push(obj[prop])
					}
					if (prop.includes('_Mode')) {
						artButtonsModes.push(obj[prop])
					}
					if (prop.includes('_Type')) {
						artButtonsTypes.push(obj[prop])
					}
					if (prop.includes('_Code')) {
						artButtonsCodes.push(obj[prop])
					}
					if (prop.includes('_Default')) {
						artButtonsDefaults.push(obj[prop])
					}
					if (prop.includes('_On')) {
						artButtonsOns.push(obj[prop])
					}
					if (prop.includes('_Off')) {
						artButtonsOffs.push(obj[prop])
					}
					if (prop.includes('FadA')) {
						fadCodes.push(obj[prop])
					}
					if (prop.includes('FadB')) {
						fadDefaults.push(obj[prop])
					}
					if (prop.includes('FadC')) {
						fadNames.push(obj[prop])
					}
				}
			}

			for (let i = 0; i < 9; i++) {

				fadCodesVars[i] = '/CC' + (i + 1) + '_increment_value';
				fadDefaultsVars[i] = '/CC_Preset_CC' + (i + 1) + '_Default';
				fadNamesVars[i] = '/CC' + (i + 1) + '_display_Setting';

				receive(fadCodesVars[i], parseInt(fadCodes[i]))
				receive(fadDefaultsVars[i], parseInt(fadDefaults[i]))
				receive(fadNamesVars[i], fadNames[i])

				if (fadCodes[i] !== null) {
					sendOsc({
						address: '/control',
						args: [{
							type: 'i',
							value: 1
						}, {
							type: 'i',
							value: fadCodes[i]
						}, {
							type: 'i',
							value: fadDefaults[i]
						}],
						host: 'midi',
						port: 'OSC4'
					})
				} else {
					return
				}
			}

			for (let i = 0; i < 18; i++) {

				artButtonsNamesVars[i] = '/art' + (i + 1) + 'name';
				artButtonsModesVars[i] = '/art' + (i + 1) + 'mode';
				artButtonsTypesVars[i] = '/art' + (i + 1) + 'type';
				artButtonsCodesVars[i] = '/art' + (i + 1) + 'code';
				artButtonsColorsVars[i] = '/art' + (i + 1) + 'color';
				artButtonsDefaultsVars[i] = '/art' + (i + 1) + 'default';
				artButtonsOnsVars[i] = '/art' + (i + 1) + 'on';
				artButtonsOffsVars[i] = '/art' + (i + 1) + 'off';
				artButtonsInputsVars[i] = '/art' + (i + 1) + 'input';

				receive(artButtonsNamesVars[i], artButtonsNames[i])
				receive(artButtonsModesVars[i], artButtonsModes[i])
				receive(artButtonsTypesVars[i], artButtonsTypes[i])
				receive(artButtonsCodesVars[i], parseInt(artButtonsCodes[i]))
				receive(artButtonsDefaultsVars[i], parseInt(artButtonsDefaults[i]))
				receive(artButtonsOnsVars[i], parseInt(artButtonsOns[i]))
				receive(artButtonsOffsVars[i], parseInt(artButtonsOffs[i]))

				if (artButtonsNames[i] === "" || artButtonsNames[i] === null) {

					receive(artButtonsInputsVars[i], 'true')
					receive(artButtonsColorsVars[i], "#A9A9A9")
					receive(artButtonsModesVars[i], 0.15) //alphaFillOff for buttons 1&2 alphaFillOn for rest

				} else {

					receive(artButtonsModesVars[i], 0.75)
					if (artButtonsNamesVars[i] === '/art1name' || artButtonsNamesVars[i] === '/art2name') {


						receive(artButtonsInputsVars[i], 'false')
						receive(artButtonsColorsVars[i], "#a86739")
						sendOsc({
							address: artButtonsTypes[i],
							args: [{
								type: 'i',
								value: 1
							}, {
								type: 'i',
								value: parseInt(artButtonsCodes[i])
							}, {
								type: 'i',
								value: parseInt(artButtonsDefaults[i])
							}],
							host: 'midi',
							port: 'OSC3' //OSC3 means OSC will also receive this command
						})

					} else {

						receive(artButtonsColorsVars[i], "#6dfdbb")
						receive(artButtonsDefaultsVars[i], parseInt(artButtonsDefaults[i]))

						if (parseInt(artButtonsDefaults[i]) !== 0) {

							sendOsc({
								address: artButtonsTypes[i],
								args: [{
									type: 'i',
									value: 1
								}, {
									type: 'i',
									value: parseInt(artButtonsCodes[i])
								}, {
									type: 'i',
									value: parseInt(artButtonsDefaults[i])
								}],
								host: 'midi',
								port: 'OSC4' //OSC4 means only Cubase will receive this command
							})

						} else {

							receive(artButtonsModesVars[i], 0.15)

						}
					}
				}
			}

		}

		return {
			address,
			args,
			host,
			port
		}

	},

}
