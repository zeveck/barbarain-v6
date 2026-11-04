#!/usr/bin/env python3
"""Static server for play-testing: no caching, so every reload sees the latest files.
   python3 tools/serve.py PORT DIR"""
import sys, http.server, functools
class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    def log_message(self, *a): pass
port, d = int(sys.argv[1]), sys.argv[2]
http.server.ThreadingHTTPServer(('127.0.0.1', port), functools.partial(H, directory=d)).serve_forever()
