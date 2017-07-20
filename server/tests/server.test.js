const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user')

const {todos, users ,populateTodos, populateUsers} = require('./seed/seed');

// PASS FX DEFINITION RATHEN THAN populateTodos()
beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', ()=>{
    it('should create a new todo', (done)=>{
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todosArray.length).toBe(1);
            expect(res.body.code).toBe(200);
        })
        .end(done);
    });
});

// create an object, send request, check if response is equal to the object we have populated
describe('GET /todos/:id', ()=>{
    it('should return todo doc', (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todoByID.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should not return todo doc created by other user', (done)=>{
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if todo not found', (done)=>{

        let id = new ObjectID().toHexString(); //random id
        request(app)
        .get(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done)=>{
        
        let id = 12345;
        request(app)
        .get(`/todos/${todos[0].id}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(400)
        .end(done);
    });



});

describe('DELETE /todos/:id', ()=>{
    it('should remove a todo', (done)=>{
        let hexid = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexid}`)
        .set('x-auth', users[1].tokens[0].token)
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

    it('should not remove other user todo', (done)=>{
        let hexid = todos[0]._id.toHexString();

        request(app)
        .delete(`/todos/${hexid}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err,res) =>{
            if(err) {
                return done(err);
            }
            //confirm the delete to make sure the obj not exist
            Todo.findById(hexid).then((todo)=>{
                expect(todo).toExist();
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
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);

    });

    it('should return 404 if object ID is not valid', (done)=>{
        
        let id = 12345;
        request(app)
        .delete(`/todos/${id}`)
        .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
        .send(update) //send update to app.patch
        .expect(200)
        .expect((res)=>{

            expect(res.body.TodoUpdated.text).toBe(update.text);
            expect(res.body.TodoUpdated.completed).toBe(true);
            expect(res.body.TodoUpdated.completeAt).toBeA('string');
        })
        .end(done);
    });
    
    it('should not update todo created by other user', (done)=>{
        let hexid = todos[0]._id.toHexString();
        let update = {
            text : "Read Bill Gate book",
            completed : true
        };

        request(app)
        .patch(`/todos/${hexid}`)
        .set('x-auth', users[1].tokens[0].token)
        .send(update) //send update to app.patch
        .expect(404)
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
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res)=>{

            expect(res.body.TodoUpdated.text).toBe(update.text);
            expect(res.body.TodoUpdated.completed).toBe(false);
            expect(res.body.TodoUpdated.completeAt).toNotExist();
        })
        .end(done);
    });

});

describe('GET /users/me', ()=>{

    it('should return user if authenticated', (done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 if authenticated', (done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    });

});

describe('POST /users',()=>{
    it('should create a user', (done)=>{
        var email = 'hesterhaha@gmail.com';
        var password = 'hesterliong';

        request(app)
        .post('/users')
        .send({email , password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
            expect(res.body._id).toExist();
            expect(res.body.email).toBe(email);
        })
        .end((err)=>{
            if(err) {
                return done(err);
            }

            User.findOne({email}).then((user)=>{
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            });
        });
    });

    it('should return validation errors if request invalid', (done)=>{
        request(app)
        .post('/users')
        .send({
            email : 'and',
            password : '123'
        })
        .expect(400)
        .end(done);
    });

    it('should not create user if email in use', (done)=>{
        request(app)
        .post('/users')
        .send({
            email : users[0].email,
            password : 'hahaha'
        })
        .expect(400)
        .end(done);
    });

});

    describe('POST /users/login', ()=>{
        it('should login user and return auth token', (done)=>{
            request(app)
            .post('/users/login')
            .send({
                email : users[1].email,
                password : users[1].password
            })
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res)=>{
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens[1]).toInclude({
                        access : 'auth',
                        token : res.headers['x-auth']
                    });
                    done();
                }).catch((e)=>{
                    done(e);
                })
            });
        });

        it('should reject invalid login', (done)=>{

            request(app)
            .post('/users/login')
            .send({
                email : users[1].email,
                password : users[1].password + '1'
            })
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res)=>{
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user)=>{
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e)=>{
                    done(e);
                })
            });
        });
    });

    describe('DELETE /users/me/token', ()=>{
        it('should remove auth token on logout', (done)=>{
            request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err,res)=>{
                if(err) {
                    return done(err);
                }
                User.findOne({
                    email : users[0].email
                }).then((user)=>{
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e)=>{
                    done(e);
                })
            });
        });
    });
