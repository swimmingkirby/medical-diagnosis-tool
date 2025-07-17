# Use Python 3.10 as base image
FROM python:3.10-slim

# Set working directory inside container
WORKDIR /app

# Install system dependencies needed for audio processing
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first (for better Docker caching)
COPY requirements.txt .

# Install Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py .

# Expose port 5000 for the web server
EXPOSE 5000

# Command to run when container starts
CMD ["python", "app.py"]