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

    feedbackForm = document.getElementById('feedbackForm');
    feedbackForm.innerHTML = 'Thanks!'
}

function populate_results(data, textStatus, jqXHR) {
    // data is a dictionary containing results (a list) and num_results (an integer)
    showOff = document.createElement('div');
    showOff.setAttribute('class', 'inspireresults');
    showOff.setAttribute('id', 'inspireresults');
    showOff.innerHTML = 'INSPIRE got ' + data.num_results + ' hits for the same query!';
    nudgeBox.appendChild(showOff);

    showOff.innerHTML += '<table>'
    for (i=0; i<data.results.length; i++) {
        result = data.results[i];
        showOff.innerHTML += '<tr><td><a href="http://inspirebeta.net/record/' + result.recid + '>' +
                             i + ') ' + result.title + '. ' + result.author + '</a></td></tr>';
    }
    showOff.innerHTML += '</table>'
}

function get_query() {
    return document.getElementsByName('rawcmd')[0].value;
}

function get_inspire_results() {
    $.getJSON('http://whereveritis/queryinspire.py?query='+get_query(),
              {},
              populate_results);
}
