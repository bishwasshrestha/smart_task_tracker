from flask import Flask, request, jsonify

app = Flask(__name__)   

CATEGORIES = {
    "Chores": ["clean", "wash", "vacuum", "laundry", "tidy", "eat","make"],
    "Education": ["read", "study", "homework", "learn", "research"],
    "Shopping": ["buy", "shop", "purchase", "groceries", "order"],
    "Work": ["email", "meeting", "report", "deadline", "task"],
    "Health": ["exercise", "meditate", "run", "yoga", "workout"],
}

@app.route('/suggest', methods=['POST'])    
def suggest_category():  
    data = request.get_json()   
    task = data.get('task', '').lower() 
    
    best_match = None
    max_matches = 0
    for category, keywords in CATEGORIES.items():  
        match_count = sum(1 for word in keywords if word in task)  
        if match_count > max_matches:  
            best_match = category  
            max_matches = match_count
            
    if not best_match:
        best_match = "Miscellaneous"
        confidence = "0.3"
    else:
        max_possible = len(CATEGORIES[best_match])
        confidence = 0.5 + (max_matches / max_possible) * 0.5
        confidence = round(confidence, 2)
            
   
    return jsonify({'category': best_match,
                    'confidence': confidence})    

if __name__ == '__main__':  
    app.run(host='0.0.0.0', port=5000)  
