module.exports = {

	oscInFilter: function(data) {

		// TODO: find away to have atom beautify ignore the objects from OSC so the "var {} = data" bit could be on one line (this happens in other situations)
		var {
			address,
			args,
			host,
			port
		} = data

		// TODO: control for autoUpdateTracks button. essentially, I don't necessarily want the faders and articulation buttons to update automatically. there should be an option. beyond this, there should be an option to update (auto and not) the buttons and faders to whatever is currently on the track. i.e. MIDI chase

		// var autoUpdateTracks = []
		//
		// if (port === 'OSC2' && address === '/control' && args[1].value === 127 && args[2].value == 1){
		//     autoUpdateTracks[0] = 1
		// }
		// if (port === 'OSC2' && address === '/control' && args[1].value === 127 && args[2].value == 0){
		//     autoUpdateTracks[0] = 0
		// }
		//1) if there is no data on the track where selected, set the faders to these defaults and send CC (will also be in flag)
		//2) if there is data on the track, set the faders to whatever is on the track where selected and send CC. this has been most difficult so far, the MIDI monitor in Cubase seems to always cause a feedback loop. Also, I need to come up with a way to get a MIDI signal if I select a track that is not MIDI, i.e. instrument, audio, marker, tracks, etc.



		if (address === '/control' && args[1].value === 126 && args[2].value !== 0) {
			send('midi', 'OSC4', '/control', 1, 127, 127)
		}

		var tracks = loadJSON('../template/tracks.json')

		if (address === '/key_pressure') {

			var artButtonsNamesVars = [];
			var artButtonsModesVars = [];
			var artButtonsTypesVars = [];
			var artButtonsCodesVars = [];
			var artButtonsColorsVars = [];
			var artButtonsDefaultsVars = [];
			var artButtonsOnsVars = [];
			var artButtonsOffsVars = [];
			var artButtonsInputsVars = [];

			var artButtonsNames = [];
			var artButtonsModes = [];
			var artButtonsTypes = [];
			var artButtonsCodes = [];
			var artButtonsDefaults = [];
			var artButtonsOns = [];
			var artButtonsOffs = [];
			var artButtonsInputs = [];

			var x = args[1].value
			var y = args[2].value

			x = (x * 128) + y


			// TODO: clean this shit up!


			//DECLARE ALL VARIABLES FROM JSON///////////////////////////////////////////////////////////

			receive('/text_1', tracks[x].Track)
			tracks = [tracks[x]]

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

					if (artButtonsNamesVars[i] === '/art1name' || artButtonsNamesVars[i] === '/art2name') {
                        receive(artButtonsModesVars[i], 0.75)
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
						if (parseInt(artButtonsDefaults[i]) != 0) {
                            receive(artButtonsModesVars[i], 0.75)
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

/*
            receive('/art2name', art2name)
            receive('/art2mode', art2mode)
            receive('/art2type', art2type)
            receive('/art2code', art2code)
            receive('/art2on', art2on)
            receive('/art2off', art2off)

            if (art2name === "") {
              receive('/art2input', 'true')
              receive('/art2color', "#A9A9A9")
              receive('/art2mode', 0.15)
            } else {
              receive('/art2input', 'false')
              receive('/art2color', "#a86739")
              receive('/art2off', art2off)
              receive('/art2mode', 0.75)
              // receive('/art2default', art2default)
              sendOsc({
                address: art2type,
                args: [{
                  type: 'i',
                  value: 1
                }, {
                  type: 'i',
                  value: art2code
                }, {
                  type: 'i',
                  value: art2default
                }],
                host: 'midi',
                port: 'OSC3'
              })
            }

            receive('/art3name', art3name)
            receive('/art3mode', art3mode)
            receive('/art3type', art3type)
            receive('/art3code', art3code)
            receive('/art3on', art3on)
            receive('/art3off', art3off)
            receive('/art3mode', 0.75)

            if (art3name === "") {
              receive('/art3color', "#A9A9A9")
              receive('/art3mode', 0.15)
            } else {
              receive('/art3color', "#6dfdbb")
              receive('/art3default', art3default)
              if (art3default != 0) {
                receive('/art3mode', 0.75)
                sendOsc({
                  address: art3type,
                  args: [{
                    type: 'i',
                    value: 1
                  }, {
                    type: 'i',
                    value: art3code
                  }, {
                    type: 'i',
                    value: art3default
                  }],
                  host: 'midi',
                  port: 'OSC4'
                })
              } else {
                receive('/art3mode', 0.15)
              }
            }
*/





			// for (let i = 0; i < 9; i++) {
			//   receive('/CC' + String.fromCharCode(65 + i) + '_increment_value', String.fromCharCode(97 + i) + 1)
			//   var String.fromCharCode(97 + i) + 1 = parseInt(tracks[x].String.fromCharCode(65 + i) + 1)
			//   var String.fromCharCode(97 + i) + 2 = parseInt(tracks[x].String.fromCharCode(65 + i) + 2)
			//   var String.fromCharCode(97 + i) + 3 = tracks[x].String.fromCharCode(65 + i) + 3
			// }

			//POPULATE ARTICULATION BUTTONS//////////////////////////////////////////


			// for (let i = 0; i < 3; i++) {
			//   //should this be "+String(i)+" ???
			//   receive('/art' + i + 'name', art + i + name)
			//   receive('/art' + i + 'mode', art + i + mode)
			//   receive('/art' + i + 'type', art + i + type)
			//   receive('/art' + i + 'code', art + i + code)
			//   receive('/art' + i + 'on', art + i + on)
			//   receive('/art' + i + 'off', art + i + off)
			//   if (art + i + name === "") {
			//     receive('/art' + i + 'input', 'true')
			//     receive('/art' + i + 'mode', 0.15) //alphaFillOn - ON
			//     receive('/art' + i + 'color', "#A9A9A9")
			//   } else {
			//     receive('/art' + i + 'input', 'false')
			//     receive('/art' + i + 'color', "#a86739")
			//     receive('/art' + i + 'off', art + i + off)
			//     receive('/art' + i + 'mode', 0.75) //alphaFillOn - ON
			//     sendOsc({
			//       address: art + i + type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art + i + code
			//       }, {
			//         type: 'i',
			//         value: art + i +
			//           default
			//       }],
			//       host: 'midi',
			//       port: 'OSC3' //OSC3 means OSC will also receive this command
			//     })
			//   }
			// }
			// for (let i = 3; i < 19; i++) {
			//   receive('/art' + i + 'name', art + i + name)
			//   receive('/art' + i + 'mode', art + i + mode)
			//   receive('/art' + i + 'type', art + i + type)
			//   receive('/art' + i + 'code', art + i + code)
			//   receive('/art' + i + 'on', art + i + on)
			//   receive('/art' + i + 'off', art + i + off)
			//   receive('/art' + i + 'mode', 0.75)
			//   if (art + i + name === "") {
			//     receive('/art' + i + 'color', "#A9A9A9")
			//     receive('/art' + i + 'mode', 0.15) //alphaFillOff - OFF
			//   } else {
			//     receive('/art' + i + 'color', "#6dfdbb")
			//     receive('/art' + i + 'default', art + i +
			//       default)
			//     if (art + i +
			//       default != 0) {
			//       receive('/art' + i + 'mode', 0.75) //alphaFillOff - OFF
			//       sendOsc({
			//         address: art + i + type,
			//         args: [{
			//           type: 'i',
			//           value: 1
			//         }, {
			//           type: 'i',
			//           value: art + i + code
			//         }, {
			//           type: 'i',
			//           value: art + i +
			//             default
			//         }],
			//         host: 'midi',
			//         port: 'OSC4' //OSC4 means only Cubase will receive this command
			//       })
			//     } else {
			//       receive('/art' + i + 'mode', 0.15)
			//     }
			//   }
			// }


			//POPULATE FADERS/////////////////////////////////////////////////////////


			// receive('/text_1', tn) //rename this text ID
			// for (let i = 0; i < 9; i++) {
			//   receive('/CC' + String.fromCharCode(65 + i) + '_increment_value', String.fromCharCode(97 + i) + 1)
			//   receive('/CC_Preset_CC' + String.fromCharCode(65 + i) + '_Default', String.fromCharCode(97 + i) + 2)
			//   receive('/CC' + String.fromCharCode(65 + i) + '_display_Setting', String.fromCharCode(97 + i) + 3)
			//   if (tracks[x].String.fromCharCode(65 + i) + 1 !== null) {
			//     sendOsc({
			//       address: '/control',
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: String.fromCharCode(97 + i) + 1
			//       }, {
			//         type: 'i',
			//         value: String.fromCharCode(97 + i) + 2
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {}
			// }


			//OLD///////////////////////////////////////////////////////////////////////////////////
			// var b1 = parseInt(tracks[x].B1)
			// var b2 = parseInt(tracks[x].B2)
			// var b3 = tracks[x].B3
			// var c1 = parseInt(tracks[x].C1)
			// var c2 = parseInt(tracks[x].C2)
			// var c3 = tracks[x].C3
			// var d1 = parseInt(tracks[x].D1)
			// var d2 = parseInt(tracks[x].D2)
			// var d3 = tracks[x].D3
			// var e1 = parseInt(tracks[x].E1)
			// var e2 = parseInt(tracks[x].E2)
			// var e3 = tracks[x].E3
			// var f1 = parseInt(tracks[x].F1)
			// var f2 = parseInt(tracks[x].F2)
			// var f3 = tracks[x].F3
			// var g1 = parseInt(tracks[x].G1)
			// var g2 = parseInt(tracks[x].G2)
			// var g3 = tracks[x].G3
			// var h1 = parseInt(tracks[x].H1)
			// var h2 = parseInt(tracks[x].H2)
			// var h3 = tracks[x].H3


			// var art1name = tracks[x].Art1_Name
			// var art1mode = parseInt(tracks[x].Art1_Mode)
			// var art1type = tracks[x].Art1_Type
			// var art1code = parseInt(tracks[x].Art1_Code)
			// var art1default = parseInt(tracks[x].Art1_Default)
			// var art1on = parseInt(tracks[x].Art1_On)
			// var art1off = parseInt(tracks[x].Art1_Off)
			//
			// var art2name = tracks[x].Art2_Name
			// var art2mode = parseInt(tracks[x].Art2_Mode)
			// var art2type = tracks[x].Art2_Type
			// var art2code = parseInt(tracks[x].Art2_Code)
			// var art2default = parseInt(tracks[x].Art2_Default)
			// var art2on = parseInt(tracks[x].Art2_On)
			// var art2off = parseInt(tracks[x].Art2_Off)
			//
			// var art3name = tracks[x].Art3_Name
			// var art3mode = parseInt(tracks[x].Art3_Mode)
			// var art3type = tracks[x].Art3_Type
			// var art3code = parseInt(tracks[x].Art3_Code)
			// var art3default = parseInt(tracks[x].Art3_Default)
			// var art3on = parseInt(tracks[x].Art3_On)
			// var art3off = String(tracks[x].Art3_Off)
			//
			// var art4name = tracks[x].Art4_Name
			// var art4mode = parseInt(tracks[x].Art4_Mode)
			// var art4type = tracks[x].Art4_Type
			// var art4code = parseInt(tracks[x].Art4_Code)
			// var art4default = parseInt(tracks[x].Art4_Default)
			// var art4on = parseInt(tracks[x].Art4_On)
			// var art4off = String(tracks[x].Art4_Off)
			//
			// var art5name = tracks[x].Art5_Name
			// var art5mode = parseInt(tracks[x].Art5_Mode)
			// var art5type = tracks[x].Art5_Type
			// var art5code = parseInt(tracks[x].Art5_Code)
			// var art5default = parseInt(tracks[x].Art5_Default)
			// var art5on = parseInt(tracks[x].Art5_On)
			// var art5off = String(tracks[x].Art5_Off)
			//
			// var art6name = tracks[x].Art6_Name
			// var art6mode = parseInt(tracks[x].Art6_Mode)
			// var art6type = tracks[x].Art6_Type
			// var art6code = parseInt(tracks[x].Art6_Code)
			// var art6default = parseInt(tracks[x].Art6_Default)
			// var art6on = parseInt(tracks[x].Art6_On)
			// var art6off = String(tracks[x].Art6_Off)
			//
			// var art7name = tracks[x].Art7_Name
			// var art7mode = parseInt(tracks[x].Art7_Mode)
			// var art7type = tracks[x].Art7_Type
			// var art7code = parseInt(tracks[x].Art7_Code)
			// var art7default = parseInt(tracks[x].Art7_Default)
			// var art7on = parseInt(tracks[x].Art7_On)
			// var art7off = String(tracks[x].Art7_Off)
			//
			// var art8name = tracks[x].Art8_Name
			// var art8mode = parseInt(tracks[x].Art8_Mode)
			// var art8type = tracks[x].Art8_Type
			// var art8code = parseInt(tracks[x].Art8_Code)
			// var art8default = parseInt(tracks[x].Art8_Default)
			// var art8on = parseInt(tracks[x].Art8_On)
			// var art8off = String(tracks[x].Art8_Off)
			//
			// var art9name = tracks[x].Art9_Name
			// var art9mode = parseInt(tracks[x].Art9_Mode)
			// var art9type = tracks[x].Art9_Type
			// var art9code = parseInt(tracks[x].Art9_Code)
			// var art9default = parseInt(tracks[x].Art9_Default)
			// var art9on = parseInt(tracks[x].Art9_On)
			// var art9off = String(tracks[x].Art8_Off)
			//
			// var art10name = tracks[x].Art10_Name
			// var art10mode = parseInt(tracks[x].Art10_Mode)
			// var art10type = tracks[x].Art10_Type
			// var art10code = parseInt(tracks[x].Art10_Code)
			// var art10default = parseInt(tracks[x].Art10_Default)
			// var art10on = parseInt(tracks[x].Art10_On)
			// var art10off = String(tracks[x].Art10_Off)
			//
			// var art11name = tracks[x].Art11_Name
			// var art11mode = parseInt(tracks[x].Art11_Mode)
			// var art11type = tracks[x].Art11_Type
			// var art11code = parseInt(tracks[x].Art11_Code)
			// var art11default = parseInt(tracks[x].Art11_Default)
			// var art11on = parseInt(tracks[x].Art11_On)
			// var art11off = String(tracks[x].Art11_Off)
			//
			// var art12name = tracks[x].Art12_Name
			// var art12mode = parseInt(tracks[x].Art12_Mode)
			// var art12type = tracks[x].Art12_Type
			// var art12code = parseInt(tracks[x].Art12_Code)
			// var art12default = parseInt(tracks[x].Art12_Default)
			// var art12on = parseInt(tracks[x].Art12_On)
			// var art12off = String(tracks[x].Art12_Off)
			//
			// var art13name = tracks[x].Art13_Name
			// var art13mode = parseInt(tracks[x].Art13_Mode)
			// var art13type = tracks[x].Art13_Type
			// var art13code = parseInt(tracks[x].Art13_Code)
			// var art13default = parseInt(tracks[x].Art13_Default)
			// var art13on = parseInt(tracks[x].Art13_On)
			// var art13off = String(tracks[x].Art13_Off)
			//
			// var art14name = tracks[x].Art14_Name
			// var art14mode = parseInt(tracks[x].Art14_Mode)
			// var art14type = tracks[x].Art14_Type
			// var art14code = parseInt(tracks[x].Art14_Code)
			// var art14default = parseInt(tracks[x].Art14_Default)
			// var art14on = parseInt(tracks[x].Art14_On)
			// var art14off = String(tracks[x].Art14_Off)
			//
			// var art15name = tracks[x].Art15_Name
			// var art15mode = parseInt(tracks[x].Art15_Mode)
			// var art15type = tracks[x].Art15_Type
			// var art15code = parseInt(tracks[x].Art15_Code)
			// var art15default = parseInt(tracks[x].Art15_Default)
			// var art15on = parseInt(tracks[x].Art15_On)
			// var art15off = String(tracks[x].Art15_Off)
			//
			// var art16name = tracks[x].Art16_Name
			// var art16mode = parseInt(tracks[x].Art16_Mode)
			// var art16type = tracks[x].Art16_Type
			// var art16code = parseInt(tracks[x].Art16_Code)
			// var art16default = parseInt(tracks[x].Art16_Default)
			// var art16on = parseInt(tracks[x].Art16_On)
			// var art16off = String(tracks[x].Art16_Off)
			//
			// var art17name = tracks[x].Art17_Name
			// var art17mode = parseInt(tracks[x].Art17_Mode)
			// var art17type = tracks[x].Art17_Type
			// var art17code = parseInt(tracks[x].Art17_Code)
			// var art17default = parseInt(tracks[x].Art17_Default)
			// var art17on = parseInt(tracks[x].Art17_On)
			// var art17off = String(tracks[x].Art17_Off)
			//
			// var art18name = tracks[x].Art18_Name
			// var art18mode = parseInt(tracks[x].Art18_Mode)
			// var art18type = tracks[x].Art18_Type
			// var art18code = parseInt(tracks[x].Art18_Code)
			// var art18default = parseInt(tracks[x].Art18_Default)
			// var art18on = parseInt(tracks[x].Art18_On)
			// var art18off = String(tracks[x].Art18_Off)

			// receive('/art1name', art1name)
			// receive('/art1mode', art1mode)
			// receive('/art1type', art1type)
			// receive('/art1code', art1code)
			// receive('/art1on', art1on)
			// receive('/art1off', art1off)
			// if (art1name === "") {
			//   receive('/art1input', 'true')
			//   receive('/art1mode', 0.15)
			//   receive('/art1color', "#A9A9A9")
			// } else {
			//   receive('/art1input', 'false')
			//   receive('/art1color', "#a86739")
			//   receive('/art1off', art1off)
			//   receive('/art1mode', 0.75)
			//   sendOsc({
			//     address: art1type,
			//     args: [{
			//       type: 'i',
			//       value: 1
			//     }, {
			//       type: 'i',
			//       value: art1code
			//     }, {
			//       type: 'i',
			//       value: art1default
			//     }],
			//     host: 'midi',
			//     port: 'OSC3'
			//   })
			// }
			// receive('/art2name', art2name)
			// receive('/art2mode', art2mode)
			// receive('/art2type', art2type)
			// receive('/art2code', art2code)
			// receive('/art2on', art2on)
			// receive('/art2off', art2off)
			//
			// if (art2name === "") {
			//   receive('/art2input', 'true')
			//   receive('/art2color', "#A9A9A9")
			//   receive('/art2mode', 0.15)
			// } else {
			//   receive('/art2input', 'false')
			//   receive('/art2color', "#a86739")
			//   receive('/art2off', art2off)
			//   receive('/art2mode', 0.75)
			//   // receive('/art2default', art2default)
			//   sendOsc({
			//     address: art2type,
			//     args: [{
			//       type: 'i',
			//       value: 1
			//     }, {
			//       type: 'i',
			//       value: art2code
			//     }, {
			//       type: 'i',
			//       value: art2default
			//     }],
			//     host: 'midi',
			//     port: 'OSC3'
			//   })
			// }
			//
			// receive('/art3name', art3name)
			// receive('/art3mode', art3mode)
			// receive('/art3type', art3type)
			// receive('/art3code', art3code)
			// receive('/art3on', art3on)
			// receive('/art3off', art3off)
			// receive('/art3mode', 0.75)
			//
			// if (art3name === "") {
			//   receive('/art3color', "#A9A9A9")
			//   receive('/art3mode', 0.15)
			// } else {
			//   receive('/art3color', "#6dfdbb")
			//   receive('/art3default', art3default)
			//   if (art3default != 0) {
			//     receive('/art3mode', 0.75)
			//     sendOsc({
			//       address: art3type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art3code
			//       }, {
			//         type: 'i',
			//         value: art3default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art3mode', 0.15)
			//   }
			// }
			//
			//
			// receive('/art4name', art4name)
			// receive('/art4mode', art4mode)
			// receive('/art4type', art4type)
			// receive('/art4code', art4code)
			// receive('/art4on', art4on)
			// receive('/art4off', art4off)
			//
			// if (art4name === "") {
			//   receive('/art4color', "#A9A9A9")
			//   receive('/art4mode', 0.15)
			// } else {
			//   receive('/art4color', "#6dfdbb")
			//   receive('/art4default', art4default)
			//   if (art4default != 0) {
			//     receive('/art4mode', 0.75)
			//     sendOsc({
			//       address: art4type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art4code
			//       }, {
			//         type: 'i',
			//         value: art4default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art4mode', 0.15)
			//   }
			// }
			//
			// receive('/art5name', art5name)
			// receive('/art5mode', art5mode)
			// receive('/art5type', art5type)
			// receive('/art5code', art5code)
			// receive('/art5on', art5on)
			// receive('/art5off', art5off)
			//
			// if (art5name === "") {
			//   receive('/art5color', "#A9A9A9")
			//   receive('/art5mode', 0.15)
			// } else {
			//   receive('/art5color', "#6dfdbb")
			//   receive('/art5default', art5default)
			//   if (art5default != 0) {
			//     receive('/art5mode', 0.75)
			//     sendOsc({
			//       address: art5type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art5code
			//       }, {
			//         type: 'i',
			//         value: art5default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art5mode', 0.15)
			//   }
			// }
			//
			// receive('/art6name', art6name)
			// receive('/art6mode', art6mode)
			// receive('/art6type', art6type)
			// receive('/art6code', art6code)
			// receive('/art6on', art6on)
			// receive('/art6off', art6off)
			//
			// if (art6name === "") {
			//   receive('/art6color', "#A9A9A9")
			//   receive('/art6mode', 0.15)
			// } else {
			//   receive('/art6color', "#6dfdbb")
			//   receive('/art6default', art6default)
			//   if (art6default != 0) {
			//     receive('/art6mode', 0.75)
			//     sendOsc({
			//       address: art6type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art6code
			//       }, {
			//         type: 'i',
			//         value: art6default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art6mode', 0.15)
			//   }
			// }
			//
			// receive('/art7name', art7name)
			// receive('/art7mode', art7mode)
			// receive('/art7type', art7type)
			// receive('/art7code', art7code)
			// receive('/art7on', art7on)
			// receive('/art7off', art7off)
			//
			// if (art7name === "") {
			//   receive('/art7color', "#A9A9A9")
			//   receive('/art7mode', 0.15)
			// } else {
			//   receive('/art7color', "#6dfdbb")
			//   receive('/art7default', art7default)
			//   if (art7default != 0) {
			//     receive('/art7mode', 0.75)
			//     sendOsc({
			//       address: art7type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art7code
			//       }, {
			//         type: 'i',
			//         value: art7default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art7mode', 0.15)
			//   }
			// }
			//
			// receive('/art8name', art8name)
			// receive('/art8mode', art8mode)
			// receive('/art8type', art8type)
			// receive('/art8code', art8code)
			// receive('/art8on', art8on)
			// receive('/art8off', art8off)
			//
			// if (art8name === "") {
			//   receive('/art8color', "#A9A9A9")
			//   receive('/art8mode', 0.15)
			// } else {
			//   receive('/art8color', "#6dfdbb")
			//   receive('/art8default', art8default)
			//   if (art8default != 0) {
			//     receive('/art8mode', 0.75)
			//     sendOsc({
			//       address: art8type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art8code
			//       }, {
			//         type: 'i',
			//         value: art8default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art8mode', 0.15)
			//   }
			// }
			//
			// receive('/art9name', art9name)
			// receive('/art9mode', art9mode)
			// receive('/art9type', art9type)
			// receive('/art9code', art9code)
			// receive('/art9on', art9on)
			// receive('/art9off', art9off)
			//
			// if (art9name === "") {
			//   receive('/art9color', "#A9A9A9")
			//   receive('/art9mode', 0.15)
			// } else {
			//   receive('/art9color', "#6dfdbb")
			//   receive('/art9default', art9default)
			//   if (art9default != 0) {
			//     receive('/art9mode', 0.75)
			//     sendOsc({
			//       address: art9type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art9code
			//       }, {
			//         type: 'i',
			//         value: art9default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art9mode', 0.15)
			//   }
			// }
			//
			// receive('/art10name', art10name)
			// receive('/art10mode', art10mode)
			// receive('/art10type', art10type)
			// receive('/art10code', art10code)
			// receive('/art10on', art10on)
			// receive('/art10off', art10off)
			//
			// if (art10name === "") {
			//   receive('/art10color', "#A9A9A9")
			//   receive('/art10mode', 0.15)
			// } else {
			//   receive('/art10color', "#6dfdbb")
			//   receive('/art10default', art10default)
			//   if (art10default != 0) {
			//     receive('/art10mode', 0.75)
			//     sendOsc({
			//       address: art10type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art10code
			//       }, {
			//         type: 'i',
			//         value: art10default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art10mode', 0.15)
			//   }
			// }
			//
			// receive('/art11name', art11name)
			// receive('/art11mode', art11mode)
			// receive('/art11type', art11type)
			// receive('/art11code', art11code)
			// receive('/art11on', art11on)
			// receive('/art11off', art11off)
			//
			// if (art11name === "") {
			//   receive('/art11color', "#A9A9A9")
			//   receive('/art11mode', 0.15)
			// } else {
			//   receive('/art11color', "#6dfdbb")
			//   receive('/art11default', art11default)
			//   if (art11default != 0) {
			//     receive('/art11mode', 0.75)
			//     sendOsc({
			//       address: art11type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art11code
			//       }, {
			//         type: 'i',
			//         value: art11default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art11mode', 0.15)
			//   }
			// }
			//
			// receive('/art12name', art12name)
			// receive('/art12mode', art12mode)
			// receive('/art12type', art12type)
			// receive('/art12code', art12code)
			// receive('/art12on', art12on)
			// receive('/art12off', art12off)
			//
			// if (art12name === "") {
			//   receive('/art12color', "#A9A9A9")
			//   receive('/art12mode', 0.15)
			// } else {
			//   receive('/art12color', "#6dfdbb")
			//   receive('/art12default', art12default)
			//   if (art12default != 0) {
			//     receive('/art12mode', 0.75)
			//     sendOsc({
			//       address: art12type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art12code
			//       }, {
			//         type: 'i',
			//         value: art12default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art12mode', 0.15)
			//   }
			// }
			//
			// receive('/art13name', art13name)
			// receive('/art13mode', art13mode)
			// receive('/art13type', art13type)
			// receive('/art13code', art13code)
			// receive('/art13on', art13on)
			// receive('/art13off', art13off)
			//
			// if (art13name === "") {
			//   receive('/art13color', "#A9A9A9")
			//   receive('/art13mode', 0.15)
			// } else {
			//   receive('/art13color', "#6dfdbb")
			//   receive('/art13default', art13default)
			//   if (art13default != 0) {
			//     receive('/art13mode', 0.75)
			//     sendOsc({
			//       address: art13type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art13code
			//       }, {
			//         type: 'i',
			//         value: art13default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art13mode', 0.15)
			//   }
			// }
			//
			// receive('/art14name', art14name)
			// receive('/art14mode', art14mode)
			// receive('/art14type', art14type)
			// receive('/art14code', art14code)
			// receive('/art14on', art14on)
			// receive('/art14off', art14off)
			//
			// if (art14name === "") {
			//   receive('/art14color', "#A9A9A9")
			//   receive('/art14mode', 0.15)
			// } else {
			//   receive('/art14color', "#6dfdbb")
			//   receive('/art14default', art14default)
			//   if (art14default != 0) {
			//     receive('/art14mode', 0.75)
			//     sendOsc({
			//       address: art14type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art14code
			//       }, {
			//         type: 'i',
			//         value: art14default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art14mode', 0.15)
			//   }
			// }
			//
			// receive('/art15name', art15name)
			// receive('/art15mode', art15mode)
			// receive('/art15type', art15type)
			// receive('/art15code', art15code)
			// receive('/art15on', art15on)
			// receive('/art15off', art15off)
			//
			// if (art15name === "") {
			//   receive('/art15color', "#A9A9A9")
			//   receive('/art15mode', 0.15)
			// } else {
			//   receive('/art15color', "#6dfdbb")
			//   receive('/art15default', art15default)
			//   if (art15default != 0) {
			//     receive('/art15mode', 0.75)
			//     sendOsc({
			//       address: art15type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art15code
			//       }, {
			//         type: 'i',
			//         value: art15default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art15mode', 0.15)
			//   }
			// }
			//
			// receive('/art16name', art16name)
			// receive('/art16mode', art16mode)
			// receive('/art16type', art16type)
			// receive('/art16code', art16code)
			// receive('/art16on', art16on)
			// receive('/art16off', art16off)
			//
			// if (art16name === "") {
			//   receive('/art16color', "#A9A9A9")
			//   receive('/art16mode', 0.15)
			// } else {
			//   receive('/art16color', "#6dfdbb")
			//   receive('/art16default', art16default)
			//   if (art16default != 0) {
			//     receive('/art16mode', 0.75)
			//     sendOsc({
			//       address: art16type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art16code
			//       }, {
			//         type: 'i',
			//         value: art16default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art16mode', 0.15)
			//   }
			// }
			//
			// receive('/art17name', art17name)
			// receive('/art17mode', art17mode)
			// receive('/art17type', art17type)
			// receive('/art17code', art17code)
			// receive('/art17on', art17on)
			// receive('/art17off', art17off)
			//
			// if (art17name === "") {
			//   receive('/art17color', "#A9A9A9")
			//   receive('/art17mode', 0.15)
			// } else {
			//   receive('/art17color', "#6dfdbb")
			//   receive('/art17default', art17default)
			//   if (art17default != 0) {
			//     receive('/art17mode', 0.75)
			//     sendOsc({
			//       address: art17type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art17code
			//       }, {
			//         type: 'i',
			//         value: art17default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art17mode', 0.15)
			//   }
			// }
			//
			// receive('/art18name', art18name)
			// receive('/art18mode', art18mode)
			// receive('/art18type', art18type)
			// receive('/art18code', art18code)
			// receive('/art18on', art18on)
			// receive('/art18off', art18off)
			//
			// if (art18name === "") {
			//   receive('/art18color', "#A9A9A9")
			//   receive('/art18mode', 0.15)
			// } else {
			//   receive('/art18color', "#6dfdbb")
			//   receive('/art18default', art18default)
			//   if (art18default != 0) {
			//     receive('/art18mode', 0.75)
			//     sendOsc({
			//       address: art18type,
			//       args: [{
			//         type: 'i',
			//         value: 1
			//       }, {
			//         type: 'i',
			//         value: art18code
			//       }, {
			//         type: 'i',
			//         value: art18default
			//       }],
			//       host: 'midi',
			//       port: 'OSC4'
			//     })
			//   } else {
			//     receive('/art18mode', 0.15)
			//   }
			// }




			//POPULATE FADERS/////////////////////////////////////////////////////////
			// receive('/text_1', tn)
			// receive('/CCA_increment_value', a1)
			// receive('/CC_Preset_CCA_Default', a2)
			// receive('/CCA_display_Setting', a3)
			// if (tracks[x].A1 !== null) {
			//   sendOsc({
			//     address: '/control',
			//     args: [{
			//       type: 'i',
			//       value: 1
			//     }, {
			//       type: 'i',
			//       value: a1
			//     }, {
			//       type: 'i',
			//       value: a2
			//     }],
			//     host: 'midi',
			//     port: 'OSC4'
			//   })
			// } else {}
			// receive('/CCB_increment_value', b1)
			// receive('/CC_Preset_CCB_Default', b2)
			// receive('/CCB_display_Setting', b3)
			// if (tracks[x].B1 !== null) {
			//   sendOsc({
			//     address: '/control',
			//     args: [{
			//       type: 'i',
			//       value: 1
			//     }, {
			//       type: 'i',
			//       value: b1
			//     }, {
			//       type: 'i',
			//       value: b2
			//     }],
			//     host: 'midi',
			//     port: 'OSC4'
			//   })
			// } else {}
			// receive('/CCC_increment_value', c1)
			// receive('/CC_Preset_CCC_Default', c2)
			// receive('/CCC_display_Setting', c3)
			// if (tracks[x].C1 !== null) {
			//   sendOsc({
			//     address: '/control',
			//     args: [{
			//       type: 'i',
			//       value: 1
			//     }, {
			//       type: 'i',
			//       value: c1
			//     }, {
			//       type: 'i',
			//       value: c2
			//     }],
			//     host: 'midi',
			//     port: 'OSC4'
			//   })
			// } else {}
			// receive('/CCD_increment_value', d1)
			// receive('/CC_Preset_CCD_Default', d2)
			// receive('/CCD_display_Setting', d3)
			// if (tracks[x].D1 !== null) {
			//   sendOsc({
			//     address: '/control',
			//     args: [{
			//       type: 'i',
			//       value: 1
			//     }, {
			//       type: 'i',
			//       value: d1
			//     }, {
			//       type: 'i',
			//       value: d2
			//     }],
			//     host: 'midi',
			//     port: 'OSC4'
			//   })
			// } else {}
			// receive('/CCE_increment_value', e1)
			// receive('/CC_Preset_CCE_Default', e2)
			// receive('/CCE_display_Setting', e3)
			// if (tracks[x].E1 !== null) {
			//   sendOsc({
			//     address: '/control',
			//     args: [{
			//       type: 'i',
			//       value: 1
			//     }, {
			//       type: 'i',
			//       value: e1
			//     }, {
			//       type: 'i',
			//       value: e2
			//     }],
			//     host: 'midi',
			//     port: 'OSC4'
			//   })
			// }
			// receive('/CCF_increment_value', f1)
			// receive('/CC_Preset_CCF_Default', f2)
			// receive('/CCF_display_Setting', f3)
			// if (tracks[x].F1 !== null) {
			//   sendOsc({
			//     address: '/control',
			//     args: [{
			//       type: 'i',
			//       value: 1
			//     }, {
			//       type: 'i',
			//       value: f1
			//     }, {
			//       type: 'i',
			//       value: f2
			//     }],
			//     host: 'midi',
			//     port: 'OSC4'
			//   })
			// } else {}
			// receive('/CCG_increment_value', g1)
			// receive('/CC_Preset_CCG_Default', g2)
			// receive('/CCG_display_Setting', g3)
			// if (tracks[x].G1 !== null) {
			//   sendOsc({
			//     address: '/control',
			//     args: [{
			//       type: 'i',
			//       value: 1
			//     }, {
			//       type: 'i',
			//       value: g1
			//     }, {
			//       type: 'i',
			//       value: g2
			//     }],
			//     host: 'midi',
			//     port: 'OSC4'
			//   })
			// } else {}
			// receive('/CCH_increment_value', h1)
			// receive('/CC_Preset_CCH_Default', h2)
			// receive('/CCH_display_Setting', h3)
			// if (tracks[x].H1 !== null) {
			//   sendOsc({
			//     address: '/control',
			//     args: [{
			//       type: 'i',
			//       value: 1
			//     }, {
			//       type: 'i',
			//       value: h1
			//     }, {
			//       type: 'i',
			//       value: h2
			//     }],
			//     host: 'midi',
			//     port: 'OSC4'
			//   })
			// } else {}

			//  line 34 if (address === '/key_pressure') {
		}

		return {
			address,
			args,
			host,
			port
		}

	},

}
