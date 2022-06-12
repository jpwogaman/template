# Template
## What you need to know:

- Open Stage Control (OSC) is a "Libre and modular OSC / MIDI controller" used on a touch screens in music production environments. [view repo](https://github.com/jean-emmanuel/open-stage-control.git)

- Vienna Ensemble Pro (VEP) hosts Virtual Instruments, Samplers, VSTs, etc.

- Cubase is a digital audio workstation (DAW)

- template.json is my OSC work file which contains buttons, widgets, sliders, etc.

- template.js is a "custom module" that can be loaded into Open Stage Control

- tracks.json is a list of names, parameters, playable ranges, etc. for the orchestral instrument VSTs (hosted in VEP) that I use in Cubase. these parameters are viewed and adjusted in OSC via the custom module.

- GR1-OSC1-CH2.xml, etc. are "Generic Remotes" that are used and configured in Cubase. They correlate with certain buttons and widgets in OSC and among other things, essentially allow for key commands to be activated with MIDI commands.

## the OSC launcher
![the OSC launcher](./Images/osc-launcher.png)

## the OSC client with my work file loaded
![the OSC client with my work file loaded](./Images/template.png)

## Generic Remote loaded into Cubase
![Generic Remote loaded into Cubase](./Images/GR1-OSC1-CH2.png)

## Custom Module in action
![Custom Module in action](./Images/custom-module-in-action.mp4)
