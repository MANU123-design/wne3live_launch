import  express from "express";
import mongoose from "mongoose";
import User from "../model/Usemodel.js";
import nodemailer from 'nodemailer';
import {config} from "dotenv";
config({path: "../api/config/config.env"});
import fs from 'fs';


const router = express.Router();
const app=express();



router.post('/api/waitlist', async (req, res, next) => {
    const email = req.body.email;
  
    try {
      const existingUser = await User.findOne({ email: email });
  
      if (existingUser) {
        return res.status(409).json({
          message: 'Email already exists'
        });
      }
  
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: email
      });
  
      const savedUser = await user.save();
  
      res.status(200).json({
        message: 'Registration successful',
        new_user: savedUser
      });
      // Read HTML file for email content
      fs.readFile('file.html', 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return;
        }
  
    
        const transporter = nodemailer.createTransport({
        
          service: process.env.YOUR_EMAIL_SERVICE_PROVIDER,
          auth: {
            user: process.env.YOUR_EMAIL,    
            pass: process.env.YOUR_PASSWORD                                  
          }
        });
        const loginLink = `https://${req.headers.host}/login`;
        const mailOptions = {
          from:process.env.YOUR_EMAIL,    
          to: savedUser.email,
          subject: 'You have joined the waitlist',
          html: `${data}<br><br>Hi ${savedUser.name},<br><br>Thank you joined the waitlist. Please click the following link to login: <a href="${loginLink}">Login</a>`
          
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Registration failed'
      });
    }
  });
  
export default router;
