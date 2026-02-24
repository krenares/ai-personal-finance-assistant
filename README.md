# AI Personal Finance Assistant

Live Demo:  
https://ai-personal-finance-assistant-941458672134.us-west1.run.app/

An AI-powered personal finance assistant that provides budgeting insights, financial analysis, and conversational guidance through an interactive chatbot. The application integrates Google's Gemini model to generate structured financial recommendations based on user input and is deployed in a production cloud environment.

---

## Overview

This project demonstrates full-stack AI integration using a modern React + TypeScript frontend and Gemini AI for real-time conversational financial assistance. Users can input financial data, ask budgeting questions, and receive intelligent recommendations through a responsive chatbot interface.

The application is deployed to **Google Cloud Run**, showcasing containerized deployment and cloud-based scalability.

---

## Features

- Interactive AI chatbot for personal finance questions
- Budget analysis and personalized financial recommendations
- Real-time conversational interface powered by Gemini
- Structured prompt engineering for reliable responses
- Modular React component architecture
- Production deployment on Google Cloud Run

---

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite

**AI Integration**
- Google Gemini API
- Prompt engineering
- Service abstraction layer

**Cloud & Deployment**
- Google Cloud Run
- Containerized deployment

---

## Architecture Overview
'''
User
  ↓
React Frontend
  ↓
Gemini Service Layer (services/geminiService.ts)
  ↓
Gemini API
  ↓
Response Processing
  ↓
UI Display
'''

## Project Structure

components/        React UI components
services/          Gemini API integration layer
types.ts           Shared TypeScript types
App.tsx            Main application logic
index.tsx          Application entry point
index.html         Root HTML template
package.json       Dependencies and scripts
vite.config.ts     Build configuration

## Project Structure
- Install dependencies:
npm install

- Start development server:
npm run dev

- Build for production:
npm run build

## Deployment

This application is deployed using:

- Google Cloud Run

- Containerized environment

- Cloud-hosted runtime configuration

Live URL:
https://ai-personal-finance-assistant-941458672134.us-west1.run.app/

## Engineering Highlights

- Designed structured prompts for consistent financial analysis responses

- Integrated Gemini AI through a dedicated service layer

- Implemented modular and maintainable React architecture

- Built a conversational chatbot interface

- Deployed a production-ready application to Google Cloud Run

- Applied clean separation between UI, services, and application logic

## Purpose

This project explores production-level integration of large language models into modern web applications, focusing on reliability, structured AI interaction, and scalable cloud deployment.

## Author

Full-Stack Software Engineer specializing in scalable APIs, AI-enabled applications, and modern cloud-deployed systems.

