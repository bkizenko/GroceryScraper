from firebase_functions import https_fn
from flask import Flask, request, jsonify

app = Flask(__name__)

@https_fn.on_request()
def articles(req: https_fn.Request) -> https_fn.Response:
    if req.method == 'POST':
        try:
            data = req.get_json()
            return https_fn.Response(jsonify({"message": "Data received", "data": data}), status=200, mimetype='application/json')
        except Exception as e:
            return https_fn.Response(jsonify({"error": str(e)}), status=400, mimetype='application/json')
    else:
        return https_fn.Response("Hello, Firebase Cloud Functions with Python", status=200)
