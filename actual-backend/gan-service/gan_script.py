from flask import Flask, request, jsonify
from flask_cors import CORS
import fal_client
from dotenv import load_dotenv
import os
import boto3
from werkzeug.utils import secure_filename

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}) # This will enable CORS for all routes

AWS_S3_BUCKET_NAME = os.getenv('AWS_S3_BUCKET_NAME_projectsfinal_1')
AWS_REGION = os.getenv('AWS_REGION_projectsfinal_1')
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_projectsfinal_1')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY_projectsfinal_1')

s3 = boto3.client(
        service_name = 's3',
        region_name = AWS_REGION,
        aws_access_key_id = AWS_ACCESS_KEY,
        aws_secret_access_key = AWS_SECRET_KEY
    )

def upload_images(user_image):
    
    #garment_image = request.files['garment_image']
    filename = secure_filename(user_image.filename)
    s3.upload_fileobj(user_image,AWS_S3_BUCKET_NAME,filename)
    s3_url = f"https://{AWS_S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{filename}"
    print(s3_url)
    return s3_url


@app.route('/api/process', methods=['POST'])

def process_image():
    try:
        # Get the data from the request
        garment_url = request.form.get('garmentImage')
        user_image = request.files.get('userImage')
        # description = request.form.get('description')
        user_url = upload_images(user_image)
        # print(description)
        print(garment_url)

        # Check if the images and description are provided
        # if not user_image or not garment_url or not description:
        #     return jsonify({"error": "Missing required fields."}), 400
        

        
        # Placeholder logic: Process the images here as needed
        # For now, we'll just return a placeholder URL
        image_url = solve(garment_url,user_url )

        # Return the image URL in a JSON response
        return jsonify({'image_url': image_url})

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": "Internal server error."}), 500
    


def solve(garment_url,user_url):
    
    def on_queue_update(update):
     if isinstance(update, fal_client.InProgress):
        for log in update.logs:
           print(log["message"])

    fal_key = os.getenv('FAL_KEY')
    result = fal_client.subscribe(
    "fal-ai/idm-vton",
    arguments={
        "human_image_url": f"{user_url}",
        "garment_image_url": f"{garment_url}",
        "description": " "
    },
    with_logs=True,
    on_queue_update=on_queue_update,
    )
    print(result)
    return result

if __name__ == '__main__':
    app.run(debug=True)
