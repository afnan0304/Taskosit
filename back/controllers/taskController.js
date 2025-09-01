import mongoose from "mongoose";
import Task from "../models/Task.js";

export const getAllDAta = async (req, res) =>{
    
    try{

        const { status, sort, search, page, limit} = req.query
        const filter = { user: req.uer.userId }

        if(status){
            filter.status = status
        }

        if(search){
            filter.$or = [
                { title: { $regex: search, $options: 'i'}},
                { description: { $regex: search, $options: 'i'}}
            ]
        }

        let query = Task.find(filter)

        if(sort){
            query = query.sort(sort)
        }

        const skip = (parseInt(page) - 1)* parseInt(limit)
        query = query.skip(skip).limit(parseInt(limit))
        
        const tasks = await query.exec()
        const total = await Task.countDocuments(filter)
        
        res.json({
            tasks,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        })

    }
    catch(err){
        res.status(500).json({'Error': 'Failed To fetch tasks!', error: err.message})
        console.log(err)
    }
}

export const createTask = async (req, res) => {

    try{

        const { title, description, userId} = req.body

        const newTask = new Task({
            title,
            description,
            user: userId
        })

        const savedTask = await newTask.save()
        res.status(201).json(savedTask)
        console.log( `New Task: ${savedTask} has been saved` )
    }
    catch(err){
        res.status(500).json({ 'error': 'Failed To Save Task'})
        console.log(err)
    }
}
export const updateTask = async (req, res) => {
    try{

        const { id } = req.params
        const update = await Task.findByIdAndUpdate(id, req.body, { new : true})
        res.status(201).json(update)
    }
    catch(err){

        res.status(500).json({ 'Error': 'Failed To Update Task'})
        console.log(err)
        console.log(req.params.id)

    }
}
export const removeTask = async (req, res) => {

    try{

        const {id} = req.params
        await Task.findByIdAndDelete(id)
        res.status(204).send()
    }
    catch(err){

        res.status(500).json({'Error': 'Failed To Remove!'})
        console.log(err)
    }
}