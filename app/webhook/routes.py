from flask import Blueprint, request, jsonify
from app.extensions import mongo
from datetime import datetime

webhook = Blueprint('Webhook', __name__, url_prefix='/webhook')

@webhook.route('/receiver', methods=["POST"])
def receiver():
    event = request.headers.get('X-GitHub-Event')
    payload = request.json
    timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')

    if event == "push":
        author = payload['pusher']['name']
        ref = payload['ref']
        to_branch = ref.replace('refs/heads/', '')
        commit_hash = payload['head_commit']['id']  # Git commit hash

        mongo.db.events.insert_one({
            "request_id": commit_hash,
            "action": "push",
            "author": author,
            "to_branch": to_branch,
            "from_branch": None,  # Not applicable for push events
            "timestamp": timestamp
        })

    elif event == "pull_request":
        action = payload['action']
        pr_id = payload['pull_request']['id']  # Pull request ID
        from_branch = payload['pull_request']['head']['ref']
        to_branch = payload['pull_request']['base']['ref']

        if action == "opened":
            author = payload['pull_request']['user']['login']

            mongo.db.events.insert_one({
                "request_id": pr_id,
                "action": action,
                "author": author,
                "from_branch": from_branch,
                "to_branch": to_branch,
                "timestamp": timestamp
            })

        elif action == 'closed' and payload['pull_request']['merged']:
            author = payload['pull_request']['user']['login']

            mongo.db.events.insert_one({
                "request_id": pr_id,
                "action": "merge",
                "author": author,
                "from_branch": from_branch,
                "to_branch": to_branch,
                "timestamp": timestamp
            })

    return jsonify({"message": "Webhook received"}), 200

@webhook.route('/events', methods=["GET"])
def get_events():
    events = list(mongo.db.events.find({}, {"_id": 0}).sort("timestamp", -1).limit(10))
    return jsonify(events), 200
