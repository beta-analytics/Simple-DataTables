#!./venv/bin/python
import os

import flask
import jinja2
import qdump

app = flask.Flask(__name__)


@app.get('/static/vendors/<path:filepath>')
def vendors(filepath):
    return flask.send_from_directory('./vendors', filepath)


@app.get('/dist/<path:filepath>')
def dist(filepath):
    return flask.send_from_directory('./src/dist', filepath)


@app.get('/src/<path:filepath>')
def src(filepath):
    return flask.send_from_directory('./src/src', filepath)


@app.get('/')
def test():
    path  = os.path.abspath('.' + '/vendors/announcements30.pickle')  # noqa:401
    query = qdump.load(path)
    print(query[0])
    headers = [k for k,v in query[0].items()]
    print(headers)
    return flask.render_template(
        '/home.djhtml',
        query = query,
        headers = headers
    )



@app.get('/table')
def table():
    path  = os.path.abspath('.' + '/vendors/announcements30.pickle')  # noqa:401
    query = qdump.load(path)
    print(query[0])
    headers = [k for k,v in query[0].items()]
    print(headers)
    return flask.render_template(
        '/table.djhtml',
        query = query,
        headers = headers
    )


@app.post('/t')
def t():
    path  = os.path.abspath('.' + '/vendors/announcements30.pickle')  # noqa:401
    query = qdump.load(path)
    print(query[0])
    headers = [k for k,v in query[0].items()]
    print(headers)
    return flask.render_template(
        '/t.djhtml',
        query = query,
        headers = headers
    )

if __name__ == '__main__':
    app.jinja_env.undefined = jinja2.StrictUndefined
    app.run('0.0.0.0', port=8000, debug=True)
