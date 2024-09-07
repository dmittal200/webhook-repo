# Step 1: Use an official Python runtime as a base image
FROM python:3.11-slim

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the requirements.txt file to the working directory
COPY requirements.txt .

# Step 4: Install the dependencies from the requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Step 5: Copy the rest of the application files to the container
COPY . .

# Step 6: Set environment variables (optional but recommended for Flask apps)
ENV FLASK_APP=app.py

# Step 7: Expose the port that Flask runs on (default: 5000)
EXPOSE 5000

# Step 8: Set the command to run the Flask application
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
