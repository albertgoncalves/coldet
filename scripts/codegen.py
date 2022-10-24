#!/usr/bin/env python3

from glob import glob
from os import environ
from os.path import isdir, join, sep

WD = environ["WD"]

TEMPLATE_ITEM = "<div><a href=\"src/{subdir}/index.html\">{subdir}</a></div>"


def main():
    with open(join(WD, "templates", "subdir.html"), "r") as file:
        template_subdir = file.read()
    items = []
    (_, root) = WD.rsplit(sep, 1)
    for path in sorted(glob(join(WD, "src", "*"))):
        if not isdir(path):
            continue
        (_, subdir) = path.rsplit(sep, 1)
        (_, title) = subdir.split("_", 1)
        with open(join(path, "script.js"), "r") as file:
            script = file.read()
        (_, script) = script.split("\"use strict\";", 1)
        script = script.strip()
        with open(join(path, "index.html"), "w") as file:
            file.write(template_subdir.format(
                title=title,
                script=script,
            ))
        items.append(TEMPLATE_ITEM.format(subdir=subdir))
    with open(join(WD, "templates", "root.html"), "r") as file:
        template_root = file.read()
    with open(join(WD, "index.html"), "w") as file:
        file.write(template_root.format(title=root, items="".join(items)))


if __name__ == "__main__":
    main()
