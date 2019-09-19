function addSource(count) {
    ++count.source;
    $('#notes0').clone().attr('id', 'notes' + count.source).appendTo('tbody');
    $('#veloc0').clone().attr('id', 'veloc' + count.source).appendTo('tbody');
    $('#track0').clone().attr('id', 'track' + count.source).appendTo('tbody');
    $('#parameters0').clone().attr('id', 'parameters' + count.source).appendTo('body');
    $('#parameters' + count.source).find('#parametersLabel').text('Source ' + (count.source + 1) + ' Controls');
    $('#track' + count.source).find("#controls").attr('data-target', '#parameters' + count.source).text('S' + (count.source + 1));

    for (let i = 0; i <= count.step; ++i) {
        $('#notes' + count.source).find('#n' + i).val('-');
        $('#veloc' + count.source).find('#v' + i).val('127');
        $('#track' + count.source).find('#b' + i).attr('class', 'btn btn-light btn-outline-dark btn-lg step');
    } 
}

function rmSource(count) {
    $('#notes' + count.source).remove();
    $('#veloc' + count.source).remove();
    $('#track' + count.source).remove();
    $('#parameters' + count.source).remove();
    --count.source;
}

function addStep(count) {
    ++count.step;
    // create a new step for each source
    for (let i = 0; i <= count.source; ++i) {
        let cloneB = $('#b0').clone().attr('id', 'b' + count.step).attr('class', 'btn btn-light btn-outline-dark btn-lg step').text(count.step + 1);
        let newB = $('<td></td>').html(cloneB);
        $('#track' + i).append(newB);

        let cloneN = $('#n0').clone().attr('id', 'n' + count.step).val('-');
        let newN = $('<td></td>').html(cloneN);
        $('#notes' + i).append(newN);

        let cloneV = $('#v0').clone().attr('id', 'v' + count.step).val('127');
        let newV = $('<td></td>').html(cloneV);
        $('#veloc' + i).append(newV);
    }
}

function rmStep(count) {
    // remove the step for all sources
    for (let i = 0; i <= count.source; ++i) {
        $('#track' + i).find('#b' + count.step).parent().remove();

        $('#notes' + i).find('#n' + count.step).parent().remove();

        $('#veloc' + i).find('#v' + count.step).parent().remove();
    }
    --count.step;
}

export {addSource, rmSource, addStep, rmStep};