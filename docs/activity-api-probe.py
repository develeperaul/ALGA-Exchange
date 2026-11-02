"""Inspect response structure only; account credentials stay in memory.

Runs login and read-only GETs. Prints types/key names, not private values.
"""
import getpass
import argparse
import json
import urllib.error
import urllib.request

ORIGIN = 'https://admin.aminexpay.com'


def request(path, token=None, body=None):
    headers = {'Accept': 'application/json'}
    if token:
        headers['Authorization'] = 'Bearer ' + token
    if body is not None:
        headers['Content-Type'] = 'application/json'
    req = urllib.request.Request(ORIGIN + path, headers=headers,
        data=json.dumps(body).encode() if body is not None else None)
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            return response.status, json.load(response)
    except urllib.error.HTTPError as error:
        try:
            return error.code, json.load(error)
        except ValueError:
            return error.code, None


def shape(value, key=''):
    if isinstance(value, dict):
        return {k: shape(v, k) for k, v in value.items()}
    if isinstance(value, list):
        return {'length': len(value), 'first_shape': shape(value[0]) if value else None}
    if key in ('type', 'currency', 'basis', 'kind') and isinstance(value, str) and value in (
        'referral', 'referrals', 'referral_profiles', 'referral_profile', 'referral_relations',
        'referral_transactions', 'transactions', 'payouts', 'USDT', 'merchant_commission', 'reward', 'legacy'):
        return value
    return type(value).__name__


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('paths', nargs='*')
args = parser.parse_args()
paths = args.paths or ['/api/referrals/me', '/api/referrals/relations', '/api/referrals/transactions?page[size]=1', '/api/balance/history?page=1']
allowed = {'/api/referrals/me', '/api/referrals/relations', '/api/referrals/transactions', '/api/referrals/profit', '/api/transactions', '/api/balance/history'}
if any(path.split('?')[0] not in allowed for path in paths):
    raise SystemExit('Only known read endpoints are supported.')
email = getpass.getpass('Email (hidden): ')
password = getpass.getpass('Password (hidden): ')
status, auth = request('/api/auth/login', body={'email': email, 'password': password})
del email, password
token = (auth or {}).get('data', {}).get('attributes', {}).get('token')
del auth
if not token:
    raise SystemExit('Login HTTP ' + str(status))
for path in paths:
    status, result = request(path, token)
    output = {'path': path, 'http': status, 'shape': shape(result)}
    if status == 422 and isinstance(result, dict):
        output['validation_errors'] = result.get('errors')
    print(json.dumps(output, ensure_ascii=False))
del token, result
