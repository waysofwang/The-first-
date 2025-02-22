from flask import Flask, jsonify
import requests

app = Flask(__name__)

# Replace with your own Etherscan API key
ETHERSCAN_API_KEY = 'YOUR_ETHERSCAN_API_KEY'
ETHERSCAN_BASE_URL = 'https://api.etherscan.io/api'

# Function to get transactions for a specific address
def get_transactions(address):
    """
    Fetch transaction history for a given Ethereum address using Etherscan API.
    
    Args:
        address (str): The Ethereum wallet address to track.
    
    Returns:
        dict: JSON response containing transaction data.
    """
    params = {
        'module': 'account',
        'action': 'txlist',
        'address': address,
        'startblock': 0,
        'endblock': 99999999,
        'sort': 'asc',
        'apikey': ETHERSCAN_API_KEY
    }
    response = requests.get(ETHERSCAN_BASE_URL, params=params)
    return response.json()

# API endpoint to fetch transactions for a given address
@app.route('/transactions/<address>', methods=['GET'])
def transactions(address):
    """
    API endpoint to fetch transactions for a given Ethereum address.
    
    Args:
        address (str): The Ethereum wallet address to fetch transactions for.
    
    Returns:
        JSON: Transaction data for the specified address.
    """
    data = get_transactions(address)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
