import jwt

# Replace with your token
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwMTI3MTY2LCJpYXQiOjE3Mjg4MzExNjYsImp0aSI6IjA2ZWY1ODEyOTI3ZDQwYTlhYjg4YWZkYjY4MTFlNGQzIiwidXNlcl9pZCI6MX0.0Wmvu7bDFZI3gKr9ynnHBVrmJd_BBCVt5iBdkTlnsH0"

# Decode the token without verifying the signature
decoded_token = jwt.decode(token, options={"verify_signature": False})

# Check the expiration time
exp_timestamp = decoded_token.get("exp")
if exp_timestamp:
    import datetime
    expiry_date = datetime.datetime.utcfromtimestamp(exp_timestamp)
    print(f"Token expires at: {expiry_date}")
else:
    print("No expiration found in token.")