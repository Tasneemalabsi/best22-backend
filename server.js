'use strict';
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const server=express();
server.use(cors());
const mongoose = require('mongoose');
server.use(express.json());
const PORT = process.env.PORT;

mongoose.connect(`${process.env.MONGO_LINK}`,{ useNewUrlParser: true, useUnifiedTopology: true });

server.post('/addmovies',handleAddingData);
server.get('/getmovies',handleGettingData);
server.delete('/deletemovies/:movieID',handleDeletingData);
server.put('/updatemovies/:movieID',handleUpdatingData);


const movieSchema = new mongoose.Schema({
    title: String,
    overview:String,
    email:String
  });

  const movieModel = mongoose.model('movies22', movieSchema);


async function handleAddingData (req,res){

 let {title,overview,email} = req.body;
 console.log(req.body);

 await movieModel.create({title:title, overview:overview, email:email});

 movieModel.find({email}, (error,movieData)=>{
     if (error) {
         console.log('error in adding the data',error);
     }
     else {
         console.log('successfully added');
         res.send(movieData);
     }
 })

}

async function handleGettingData (req,res){
    let email=req.query.email;
    await movieModel.find({email},(error,movieData)=>{
        if (error) {
            console.log('error in getting the data',error);
        }
        else {
            console.log('successfully read');
            console.log('hhhhhhhhhhhhhhhhh',movieData);
            res.send(movieData);
        }
    })
}

async function handleDeletingData (req,res){
    let email = req.query.email;
    let movieID = req.params.movieID;
    await movieModel.remove({_id:movieID},(error,movieData)=>{
        if (error) {
            console.log('error in deleting the data',error);
        }
        else {
            // console.log('successfully deleted');
            // console.log('hhhhhhhhhhhhhhhhh',movieData);
            res.send(movieData);
        }
    })

    await movieModel.find({email},(error,movieData)=>{
        if (error) {
            console.log('error in GETTING AFTER DELETING the data',error);
        }
        else {
            console.log('successfully deleted');
            console.log('hhhhhhhhhhhhhhhhh',movieData);
            res.send(movieData);
        }
    })
}

async function handleUpdatingData (req,res){
    let movieID = req.params.movieID
    let {title,overview,email} = req.body;
    await movieModel.findOne({_id:movieID},(error,movieData)=>{
        movieData.title=title;
        movieData.overview=overview;
        movieData.email=email
        console.log('aaaaaaaaaaaaaa',movieData)

       movieData.save()
       .then (()=>{
        movieModel.find({email},(error,data)=>{
            if (error) {
                console.log('error in GETTING AFTER DELETING the data',error);
            }
            else {
                console.log('successfully updated');
                console.log('updated data: ',data);
                res.send(data);
            }
        })
       })
    })
}

server.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`);
});





