#!/usr/bin/env python3

from glob import glob
from os import environ
from os.path import isdir, join, sep

WD = environ["WD"]

TEMPLATE_ROOT = """
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>{title}</title>
<link rel="stylesheet" href="style.css">
<link rel="shortcut icon" href="#">
</head>
<body>
<div class="center">
{items}
</div>
</body>
</html>
"""

TEMPLATE_ITEM = """<div><a href="src/{subdir}/index.html">{subdir}</a></div>"""

TEMPLATE_SUBDIR = """
<!DOCTYPE html>
<html>
<head>
<title>{title}</title>
<meta charset="utf-8">
<link rel="stylesheet" href="../../style.css">
<link rel="shortcut icon" href="#">
</head>
<body>
<div class="center">
<div><a href="../../index.html">back</a></div>
<canvas id="canvas" width="775" height="775"></canvas>
<script src="../geom.js"></script>
<script src="../math.js"></script>
<script src="../main.js"></script>
<script src="script.js" type="text/javascript"></script>
</div>
<div class="code">
<pre>
<code>
{script}
</code>
</pre>
</div>
</body>
</html>
"""


def main():
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
            file.write(TEMPLATE_SUBDIR.format(
                title=title,
                script=script,
            ))
        items.append(TEMPLATE_ITEM.format(subdir=subdir))
    with open(join(WD, "index.html"), "w") as file:
        file.write(TEMPLATE_ROOT.format(title=root, items="".join(items)))


if __name__ == "__main__":
    main()
