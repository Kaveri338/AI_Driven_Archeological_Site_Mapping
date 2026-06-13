AI-Driven Archaeological Site Mapping
Overview

This project leverages Artificial Intelligence and Computer Vision to assist in archaeological site mapping by detecting vegetation patterns and soil characteristics from aerial and satellite imagery. The system uses a YOLOv8-based object detection model to identify regions of archaeological interest, helping researchers perform faster and more efficient surveys.

Features
Vegetation Analysis using remote sensing imagery
Soil Detection and Classification
Archaeological Site Identification
YOLOv8 Object Detection Model
Web-based Deployment for easy access
Dataset

Datasets were sourced from Kaggle:

Vegetation Analysis Dataset
Soil Detection Dataset

The datasets contain annotated aerial and satellite images used for training and evaluation.

Model
Framework: Ultralytics YOLOv8
Task: Object Detection
Training Environment: Python, PyTorch
Evaluation Metrics:
mAP (Mean Average Precision)
Precision
Recall
Tech Stack
Python
YOLOv8
OpenCV
NumPy
Pandas
PyTorch
Streamlit / Gradio
Deployment
Frontend

Deployed on Vercel

Model Hosting

Deployed on Hugging Face Spaces

Project Workflow
Data Collection from Kaggle
Data Preprocessing and Annotation
YOLOv8 Model Training
Model Evaluation
Deployment on Hugging Face Spaces
Frontend Integration via Vercel
Results

The model successfully detects vegetation and soil patterns that can indicate potential archaeological locations, enabling quicker site analysis compared to manual inspection.

Future Enhancements
Integration with GIS systems
Multi-class archaeological feature detection
Higher-resolution satellite imagery support
Real-time drone image processing
Repository

GitHub: https://github.com/Kaveri338/AI_Driven_Archeological_Site_Mapping
