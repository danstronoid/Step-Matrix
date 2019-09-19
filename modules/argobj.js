// create an object containing arguments to pass to the source class
function SourceArgs(parameters) {
    this.oscType = $('#' + parameters).find('#oscType').val();
    this.freq = $('#' + parameters).find('#freq').val();
    this.veloc = 127;
    this.attack = Number($('#' + parameters).find('#attack').val());
    this.release = Number($('#' + parameters).find('#release').val());
    this.modType = $('#' + parameters).find('#modType').val();
    this.multi = $('#' + parameters).find('#multi').val();
    this.modDepth = Number($('#' + parameters).find('#modDepth').val());
}

// create an object containing arguments to pass to the fx class
function FxArgs(parameters) {
    this.delay = Number($('#' + parameters).find('#delay').val());
    this.dLvl = Number($('#' + parameters).find('#dLvl').val());
    this.dPan = Number($('#' + parameters).find('#dPan').val());
    this.filter = Number($('#' + parameters).find('#filter').val());
    this.ftype = $('#' + parameters).find('#fType').val();
    this.fattack = Number($('#' + parameters).find('#fattack').val());
    this.frelease = Number($('#' + parameters).find('#frelease').val());
    this.pan = Number($('#' + parameters).find('#pan').val());
    this.vol = Number($('#' + parameters).find('#volume').val());
}

// load arguments to a parameters module in the DOM
function loadArgs(parameters, sourceArgs, fxArgs) {
    $('#' + parameters).find('#oscType').val(sourceArgs.oscType);
    $('#' + parameters).find('#freq').val(sourceArgs.freq);
    $('#' + parameters).find('#attack').val(sourceArgs.attack);
    $('#' + parameters).find('#release').val(sourceArgs.release);
    $('#' + parameters).find('#modType').val(sourceArgs.modType);
    $('#' + parameters).find('#multi').val(sourceArgs.multi);
    $('#' + parameters).find('#modDepth').val(sourceArgs.modDepth);
    $('#' + parameters).find('#delay').val(fxArgs.delay);
    $('#' + parameters).find('#dLvl').val(fxArgs.dLvl);
    $('#' + parameters).find('#dPan').val(fxArgs.dPan);
    $('#' + parameters).find('#filter').val(fxArgs.filter);
    $('#' + parameters).find('#fType').val(fxArgs.ftype);
    $('#' + parameters).find('#fattack').val(fxArgs.fattack);
    $('#' + parameters).find('#frelease').val(fxArgs.frelease);
    $('#' + parameters).find('#pan').val(fxArgs.pan);
    $('#' + parameters).find('#volume').val(fxArgs.vol);
}

export {SourceArgs, FxArgs, loadArgs};