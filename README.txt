
API for testing http://localhost:3000/batch

handled only this cases:

with URL params: 
	only "ids" is supported the rest data should be in the body of request, for example:

	url: http://localhost:3000/batch?ids=[1,3,2]
	body:
	[{
            "name": "newName",
            "email": "test@kj.com",
            "age": 30
        }, {
            "age": 25
        },{
            "age": 6
        }]
	

with body but without params:
	works as described in the example byt data should be in "data" property 
for example:

	url: http://localhost:3000/batch
	body:
	[{
	"ver": "POST",
	
		"data": {
		
			"name": "newName",
		
			"email": "test@kj.com",
		
			"age": 30
	
		}

	}, {
	"ver": "PUT",
	
		"userId": 3,
	
		"data": {
		
			"age": 25
		
}
	
}, {
	
		"ver": "DETELE",
	
		"userId": 3

	}]

Also implemented check for 503 error with one more retry
Used Bottleneck for Rate Limits



	