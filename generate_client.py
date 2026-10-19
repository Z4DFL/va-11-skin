# -*- coding: utf-8 -*-
"""Splice the embedded official character art into client.template.js -> client.js."""
import base64
import os

base = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(base, "client.template.js"), encoding="utf-8") as fh:
    template = fh.read()


def data_uri(name):
    path = os.path.join(base, "assets", name + ".webp")
    with open(path, "rb") as fh:
        raw = fh.read()
    return base64.b64encode(raw).decode("ascii")


client = (template
          .replace("__JILL__", data_uri("jill"))
          .replace("__DANA__", data_uri("dana")))


def font_uri(name):
    path = os.path.join(base, "assets", name)
    with open(path, "rb") as fh:
        return base64.b64encode(fh.read()).decode("ascii")


client = client.replace("__FONT__", font_uri("share-tech-mono.woff2"))
client = client.replace("__LOGO__", font_uri("logo.webp"))

with open(os.path.join(base, "client.js"), "w", encoding="utf-8") as fh:
    fh.write(client)
print("client.js generated,", len(client), "chars")
