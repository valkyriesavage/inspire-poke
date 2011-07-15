#!/usr/bin/env python26

import cgi
from email.mime.text import MIMEText
import json
import smtplib

FEEDBACK = 'feedback@inspirebeta.net'
CRAZYSPIRESMACHINE = 'crazyspiresmachine@slac.stanford.edu'

def mail_feedback(yes_no, message):
    """ take the info, send it to INSPIRE feedback """
    if yes_no:
        yes_no = 'yes'
    else:
        yes_no = 'no'
    message = """
    Dear INSPIRE feedback folks,
        A SPIRES user interacted with your box in SPIRES!
        What they said was
            Did INSPIRE give results you expected? %(yes_no)s
            Why? %(message)s

    Regards,
    THE CRAZY SPIRES MACHINE
    """ % { 'message' : message,
            'yes_no' : yes_no }

    msg = MIMEText(message)
    msg['Subject'] = 'INSPIRE feedback originating from SPIRES'
    msg['To'] = FEEDBACK
    msg['From'] = CRAZYSPIRESMACHINE

    s = smtplib.SMTP('smtp.slac.stanford.edu')
    s.sendmail(CRAZYSPIRESMACHINE, [FEEDBACK], msg.as_string())
    s.quit()

    return True

if __name__ == '__main__':
    print "Content-type: application/json"
    print

    fs = cgi.FieldStorage()
    message = ''
    yes_no = False
    if fs.has_key('message'):
        message = fs.getvalue('message')
    if fs.has_key('yesNo'):
        yes_no = fs.getvalue('yesNo')
    print json.dumps(mail_feedback(yes_no, message))
