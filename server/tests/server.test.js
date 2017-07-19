const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id : new ObjectID(),
    text : 'First test todo'
}, {
    _id : new ObjectID(),
    text : 'Second test todo',
    completed : true,
    completeAt : 3333
}];

// // testing lifecycle for POST
// beforeEach((done)=>{
// // mongooseModel.remove fx, must have callback
//     Todo.remove({}).then(()=>{
//         done();
//     });
// });

// testing lifecycle for GET
beforeEach((done)=>{
// mongooseModel.remove fx, must have callback
    Todo.remove({}).then(()=>{
         return Todo.insertMany(todos);
    }).then(()=>{
        done();
    });
});

describe('POST /todos', ()=>{
    it('should create a new todo', (done)=>{
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text : text}) 
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
            })
            .end((err, res)=>{
                if(err) {
                    return done(err);
                }

            // match the result with database
            Todo.find({text : text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=>{
                done(e);
            });

            });

    });

    it('should not create todo with invalid body data', (done)=>{
            
            request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res)=>{
                if(err) {
                    return done(err);
                }

                // match the result with database
                Todo.find().then((todos)=>{
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e)=>{
                    done(e);
                });

            });
    });
});

describe('GET /todos', ()=>{
    it('should get all todos', (done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todosArray.length).toBe(2);
            expect(res.body.code).toBe(200);
        })
        .end(done);
    });
});

describe('GET /todos/:id', ()=>{
    it('should return todo doc', (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todoByID.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done)=>{

        let id = new ObjectID().toHexString(); //random id
        request(app)
        .get(`/todos/${id}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done)=>{
        
        let id = 12345;
        request(app)
        .get(`/todos/${todos[0].id}`)
        .expect(400)
        .end(done);
    });



});

describe('DELETE /todos/:id', ()=>{
    it('should remove a todo', (done)=>{
        let hexid = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexid}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todoDeleted._id).toBe(hexid);
        })
        .end((err,res) =>{
            if(err) {
                return done(err);
            }
            //confirm the delete to make sure the obj not exist
            Todo.findById(hexid).then((todo)=>{
                expect(todo).toNotExist();
                done();
            }).catch((e)=>{
                done(e);
            });
        });
    });

    it('should return 404 if todo not found', (done)=>{

        let hexid = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexid}`)
        .expect(404)
        .end(done);

    });

    it('should return 404 if object ID is not valid', (done)=>{
        
        let id = 12345;
        request(app)
        .delete(`/todos/${id}`)
        .expect(400)
        .end(done);

    });


});

describe('PATCH /todos/:id', ()=>{

    it('should update todo', (done)=>{
        let hexid = todos[0]._id.toHexString();
        let update = {
            text : "Read Bill Gate book",
            completed : true
        };

        request(app)
        .patch(`/todos/${hexid}`)
        .send(update) //send update to app.patch
        .expect(200)
        .expect((res)=>{

            expect(res.body.TodoUpdated.text).toBe(update.text);
            expect(res.body.TodoUpdated.completed).toBe(true);
            expect(res.body.TodoUpdated.completeAt).toBeA('string');
        })
        .end(done);
        });

    it('should clear completeAt when todo is not completed', (done)=>{

        let hexid = todos[1]._id.toHexString();
        let update = {
            text : "Read Bill Gate book!!!!!!!!!!!",
            completed : false
        };

        request(app)
        .patch(`/todos/${hexid}`)
        .send(update) //send update to app.patch
        .expect(200)
        .expect((res)=>{

            expect(res.body.TodoUpdated.text).toBe(update.text);
            expect(res.body.TodoUpdated.completed).toBe(false);
            expect(res.body.TodoUpdated.completeAt).toNotExist();
        })
        .end(done);
    })
});