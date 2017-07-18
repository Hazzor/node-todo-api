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
    text : 'Second test todo'
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
            .send({text : text}) //send as variable, not as string
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

        let id = new ObjectID().toHexString();
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