export const bindQuesWithAns = (ques,ans) => {
    console.log(ques);
    console.log(ans);
    let data = []
    ques.map(ques => {
        let obj = {}
        const type = ques.type
        obj["type"] = type
        obj["questionStatement"] = ques.questionStatement
        ans.map(ans =>{
            if(ques.uuid===ans.questionId){
                const answers = obj["answers"]
                if(answers) answers.push(ans.answer[0])
                obj["answers"] = answers ? answers : [ans.answer[0]];
            }
        })
        data.push(obj)
    })

   console.log("data",data);
return data;
}
