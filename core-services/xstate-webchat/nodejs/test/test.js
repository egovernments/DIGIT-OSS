var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:8080/xstate-chatbot");

// UNIT test begin

describe("Testing Message API",function(){

  it("Should get Messages to Select Language",function(done){
    server
    .post('/message')
    .send({
            "message":{
                "type": "text",
                "input": "1"
            },
            "user":{
                "mobileNumber": "7391904467"
            },
            "extraInfo":{
                "whatsAppBusinessNumber": "917834811114"
            }
     })
    .expect(200)
    .end(function(err,res){
        // ADD the logic to evaluate specific value from response like expect(res.status).to.equal('SUCCESS'); 
      done();
    });
  });

// Below Usecases are mentioned for reference. Based on requirement need to modify and use
//   it("Should get Message to confirm User name",function(done){
//     server
//     .post('/message')
//     .send({
//       "message":{ "type": "text", "input": "1" },
//       "user":{ "mobileNumber": "7391904467" },
//       "extraInfo":{ "whatsAppBusinessNumber": "917834811114"}
//      })
//     .expect(200)
//     .end(function(err,res){
//       res.text.length > 1;
//       done();
//     });
//   });

//   it("Should get Message for Service Type",function(done){
//     server
//     .post('/message')
//     .send({
//       "message":{ "type": "text", "input": "1" },
//       "user":{ "mobileNumber": "7391904467" },
//       "extraInfo":{ "whatsAppBusinessNumber": "917834811114"}
//      })
//     .expect(200)
//     .end(function(err,res){
//       res.text.length > 1;
//       done();
//     });
//   });

//   it("Should get Message for Complaint Type",function(done){
//     server
//     .post('/message')
//     .send({
//       "message":{ "type": "text", "input": "1" },
//       "user":{ "mobileNumber": "7391904467" },
//       "extraInfo":{ "whatsAppBusinessNumber": "917834811114"}
//      })
//     .expect(200)
//     .end(function(err,res){
//       res.text.length > 1;
//       done();
//     });
//   });

});