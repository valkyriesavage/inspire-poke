import cgi
import json
from urllib import quote
from urllib2 import urlopen

INSPIRE_BETA = 'http://inspirebeta.net/search?p='
OPTIONS_MARC = '&rg=3&of=t'
OPTIONS_ID = '&of=id'

TAG_TO_MARC_FIELD = {
    'author'      : ' 700__ $$a',
    'firstauthor' : ' 100__ $$a',
    'title'       : ' 245__ $$a',
    'recid'       : ' 001__ ',
    'date'        : ' 269__ $$c',
    'abstract'    : ' 520__ $$9arXiv$$a',
}

def tag_value(tag, line):
    """ return the value of a given tag in a given line """
    return line.split(TAG_TO_MARC_FIELD[tag])[1].split('$$')[0].strip()

def in_line(tag, line):
    """ take a tag and a line and return true if the tag
        is in the line, false otherwise """
    return TAG_TO_MARC_FIELD[tag] in line

def decode(raw_marc_text):
    """ take a slew of raw marc text and return a list of dictionaries
        containing all the pertinent information:
            title
            firstauthor
            abstract
            date
            recid (for links)
    """
    results = []
    record = {}
    for line in raw_marc_text.split('\n'):
        if in_line('recid', line):
            if record:
                results.append(record)
            record = {'recid' : tag_value('recid', line)}
        for tag in ['title', 'firstauthor', 'abstract', 'date']:
            if in_line(tag, line):
                record[tag] = tag_value(tag, line)
                break
    results.append(record)
    return results

def get_inspire_results(query):
    """ take a query in the SPIRES style and return INSPIRE's first three
        results for that query
    """
    encoded_query = quote(query).replace('%20', '+')
    raw = urlopen(INSPIRE_BETA + encoded_query + OPTIONS_MARC).read()
    results = decode(raw)
    raw_ids = urlopen(INSPIRE_BETA + encoded_query + OPTIONS_ID).read()
    try:
        num_results = len(eval(raw_ids))
    except SyntaxError:
        num_results = 0
    return {
            'results' : results,
            'num_results' : num_results
           }


if __name__ == '__main__':
    print "Content-type: application/json"
    print

    fs = cgi.FieldStorage()
    if fs.has_key('query'):
        print json.dumps(get_inspire_results(fs.getvalue('query')))
