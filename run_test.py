import http.server
import socketserver
import threading
import subprocess
import time
import os
import json

os.chdir('D:/Kana game project')
PORT = 8100
test_result = None
result_event = threading.Event()

class TestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        global test_result
        if self.path == '/test-done':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            test_result = json.loads(post_data.decode('utf-8'))
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'OK')
            result_event.set()
        else:
            self.send_response(404)
            self.end_headers()

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

httpd = ThreadedHTTPServer(('127.0.0.1', PORT), TestHandler)
t = threading.Thread(target=httpd.serve_forever)
t.daemon = True
t.start()
time.sleep(0.5)

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
cmd = [edge_path, '--headless', '--disable-gpu', f'http://127.0.0.1:{PORT}/test_gameplay.html']
proc = subprocess.Popen(cmd)

got_result = result_event.wait(timeout=8)

proc.terminate()
httpd.shutdown()

print('================ TEST SUMMARY ================')
if got_result:
    print('RECEIVED FROM BROWSER:', test_result)
    if test_result.get('success'):
        print(f"SUCCESS: ALL {test_result.get('passed')} OF {test_result.get('total')} TESTS PASSED IN EDGE BROWSER!")
    else:
        print(f"FAILED: {test_result.get('error')}")
else:
    print('TIMED OUT')
print('==============================================')
