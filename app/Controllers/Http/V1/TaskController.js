'use strict'

const Logger = use('Logger')
const Task = use('App/Models/Task')
const { validate } = use('Validator')


class TaskController {
    async index({ request, response }){
        try {
            response.status(200).json({
                "status":"success",
                "message":"Successfully Requested",
                "data":await Task.all()
            })
            return
        } catch (error) {
            Logger.error("Get All Task API V1:\n",error)
            response.status(500).json({
                "status":"fail",
                "message":"Something went wrong",
                "data":null
            })
            return
        }
    }


    async create({ request, response }){
        try {
            const rules = {
                name: 'required'
            }

            const validation = await validate(request.all(), rules)

            if (validation.fails()) {
                return response.status(422).json({
                    "status":"fail",
                    "message":"Bad Request",
                    "data": validation.messages()
                })
            }


            response.status(200).json({
                "status":"success",
                "message":"Successfully Requested",
                "data":await Task.create({ name : request.input('name') })
            })
            return
        } catch (error) {
            Logger.error("Create Task API V1:\n",error)
            response.status(500).json({
                "status":"fail",
                "message":"Something went wrong",
                "data":null
            })
            return
        }
    }

    async update({ request, response, params }){
        try {
            const rules = {
                name: 'required_without_any:is_complete',
                is_complete:'boolean | required_without_any:name'
            }

            const validation = await validate(request.all(), rules)

            if (validation.fails()) {
                return response.status(422).json({
                    "status":"fail",
                    "message":"Bad Request",
                    "data": validation.messages()
                })
            }

            const task = await Task.find(params.id);

            if(!task) {
                response.status(404).json({
                    "status":"fail",
                    "message":"Task Not Found",
                    "data":null
                })
                return
            }

            task.merge(request.all())

            await task.save()

            response.status(200).json({
                "status":"success",
                "message":"Successfully Requested",
                "data": task
            })
            return
        } catch (error) {
            Logger.error("Create Task API V1:\n",error)
            response.status(500).json({
                "status":"fail",
                "message":"Something went wrong",
                "data":null
            })
            return
        }
    }
}

module.exports = TaskController
