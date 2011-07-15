var ajaxRequest = null;
var nudgeBox;

function create_nudge_box() {
    nudgeBox = document.getElementById('inspireNudge');
    get_inspire_results();
    create_feedback_functionality();
}

function toggle_visibility_of_why() {
    why = document.getElementById('why');
    if (why.style.display == 'none')
        why.style.display = '';
    else
        why.style.display = 'none';
}

function create_feedback_functionality() {
    var feedbackForm = document.createElement('div');
    feedbackForm.setAttribute('id', 'feedbackForm');

    var header = document.createTextNode();
    header.textContent = 'Did INSPIRE give results you expected?';
    feedbackForm.appendChild(header);

    var yesNo = document.createElement('div');
    yesNo.setAttribute('id', 'yesNo');
    var expected = document.createElement('input');
    expected.setAttribute('type', 'radio');
    expected.setAttribute('name', 'expectation');
    expected.setAttribute('value', 'expected');
    expected.setAttribute('checked');
    expected.setAttribute('onclick', 'toggle_visibility_of_why();');
    var expectedLabel = document.createTextNode();
    expectedLabel.textContent = 'Yes!';
    var unexpected = document.createElement('input');
    unexpected.setAttribute('type', 'radio');
    unexpected.setAttribute('name', 'expectation');
    unexpected.setAttribute('value', 'unexpected');
    unexpected.setAttribute('onclick', 'toggle_visibility_of_why();');
    var unexpectedLabel = document.createTextNode();
    unexpectedLabel.textContent = 'No';

    yesNo.appendChild(expected);
    yesNo.appendChild(expectedLabel);
    yesNo.appendChild(unexpected);
    yesNo.appendChild(unexpectedLabel);

    feedbackForm.appendChild(yesNo);

    var why = document.createElement('div');
    why.setAttribute('id', 'why');
    why.setAttribute('style', 'display:none');
    var whyLabel = document.createTextNode();
    whyLabel.textContent = 'Why not? ';
    var whyBox = document.createElement('input');
    whyBox.setAttribute('name', 'why');
    whyBox.setAttribute('id', 'whyBox');
    whyBox.setAttribute('type', 'text');

    why.appendChild(whyLabel);
    why.appendChild(whyBox);

    feedbackForm.appendChild(why);

    var submit = document.createElement('button');
    submit.setAttribute('type', 'button');
    submit.innerHTML = 'Tell us!';
    submit.setAttribute('onclick', 'notify()');

    feedbackForm.appendChild(submit);

    nudgeBox.appendChild(feedbackForm);
}

function notify() {
    yesNo = document.getElementById('yesNo').children[0].checked;
    why = document.getElementById('whyBox').value;

    $.getJSON('https://inspire.slac.stanford.edu/cgi-bin/feedback.py?yesNo='+yesNo+'&message='+why,
              {},
              null);

    feedbackForm = document.getElementById('feedbackForm');
    feedbackForm.innerHTML = 'Thanks!'
}

function populate_results(data, textStatus, jqXHR) {
    // data is a dictionary containing results (a list) and num_results (an integer)
    showOff = $('<div></div>');
    showOff.addClass('inspireresults');
    showOff.attr('id', 'inspireresults');
    showOff.text('INSPIRE got ' + data.num_results + ' hits for the same query!');

    list = $('<ol></ol>');
    for (i=0; i<data.results.length; i++) {
        result = data.results[i];
        result.title = result.title.replace(/>/g, '&gt');
        result.title = result.title.replace(/</g, '&lt');
        item = $('<li></li>');
        link = $('<a href="http://inspirebeta.net/record/' + result.recid + '">' + result.title + '. ' +
                result.firstauthor + '</a>');
        link.appendTo(item);
        item.appendTo(list);
    }
    list.appendTo(showOff);

    showOff.appendTo($('div#inspireNudge'));

    feedbackForm = $('div#feedbackForm');
    feedbackForm.before(showOff);
}

function get_query() {
    stuff = window.location.search;
    search = stuff.split('rawcmd=')[1].split('&')[0];

    return search;
}

function get_inspire_results() {
    $.getJSON('https://inspire.slac.stanford.edu/cgi-bin/queryinspire.py?query='+get_query(),
              {},
              populate_results);
}
