#!/usr/bin/python

import sys
import pickle


class Row(dict):
    def __getattr__(self, name):
        return self[name]

    def __iter__(self):
        for v in self.values():
            yield v


def save(FILE, *, query=None, row=None, mapping=None):
    if query is not None:
        with open(FILE, 'wb') as fp:
            pickle.dump([ row._asdict() for row in query ], fp)

    if row is not None:
        with open(FILE, 'wb') as fp:
            pickle.dump(row._asdict(), fp)

    if mapping is not None:
        with open(FILE, 'wb') as fp:
            pickle.dump(mapping, fp)


def load(FILE, **kwargs):
    with open(FILE, 'rb') as fp:
        load = pickle.load(fp)
        if isinstance(load, list):
            return [ Row(r) for r in load ]

        return Row(load)


if __name__ == '__main__':
    print(load(sys.argv[1]))
