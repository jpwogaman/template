# Template Notes


## OSC

- [ ] design interface for adding new tracks
- [ ] fix that one stupid color: '/Art1' when set to null

- [ ] create a panner reset
- [ ] figure out a way to set the dotted/triplet & grid/event buttons on project load
- [ ] set up buttons for optimizing punch/update functionality

    * send = receive all, update faders & buttons, then send all, does not record onto track
    * punch = may or may not receive all, may or may not update faders & buttons, then send all & record onto track

    ###### commands
    - [ ] manual punch all as is on OSC
    - [ ] manual punch all defaults

    - [ ] manual send all as is on OSC (I guess this is what the faders and buttons do on their own, but individually)

    - [ ] manual send all defaults (current "Refresh Track")

    - [ ] manual send all currently on track under transport/cursor location

    ###### options
    - [ ] manual send all defaults (current "Refresh Track")
    - [ ] auto-send on track select by defaults (currently what is happening on track select)

    - [ ] manual send all currently on track under transport/cursor location
    - [ ] auto-send on track select by what is currently on track under transport/cursor location

- [ ] change the bypass sends/inserts/EQ/channel strip commands to PLE commands, as opposed to mixer commands with timeouts (this also bypasses the MIDI sends unfortunately)
    - [ ] create PLE presets
    - [ ] reconnect the buttons in studio setup
    - [ ] re-label buttons in excel
    - [ ] remove the scripting from the buttons in OSC

- [ ] make the CC Faders page the main tab for as opposed to a modal, all of the other buttons could either be a modal or a different tab. I don't like the delay when trying to click something out of the modal.

## Instruments

- [ ] make sure CSS is working perfectly
    - [ ] CC5 back to CC1
    - [ ] see if disabling "EXT" in Kontakt disables the tempo sync for measured tremolos. might be a better fix overall

- [ ] configure pan & levels for harp, strings, section piano, brass 
